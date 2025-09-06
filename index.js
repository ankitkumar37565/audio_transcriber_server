import 'dotenv/config';
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";



const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);



async function uploadLargeFile(filePath, mimeType) {
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;

  const file = await ai.files.create({
    displayName: "audio-file",
    config: { mimeType },
  });


  const stream = fs.createReadStream(filePath, { highWaterMark: 1 * 1024 * 1024 }); // 1 MB
  let partNumber = 0;

  for await (const chunk of stream) {
    partNumber++;
    console.log(`Uploading part ${partNumber} (${chunk.length} bytes)...`);

    await ai.files.uploadPart(file.name, partNumber, chunk);
  }

  // Step 3: Mark upload complete
  const finalFile = await ai.files.completeUpload(file.name);
  console.log("Upload complete:", finalFile);

  return finalFile;
}

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

const myfile = await ai.files.upload({
    file: filePath,
    config: { mimeType: "audio/m4a" },
  });

// const myfile = await uploadLargeFile(filePath, mimeType);

  const prompt = "Please provide a transcript of the audio in Hinglish. For example, 'Hello, my name is...' should be 'Hello, mera naam...'.";
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: createUserContent([
      createPartFromUri(myfile.uri, myfile.mimeType),
      prompt,
    ]),
  });
    const text = response.text;
    console.log("Hinglish Transcript:");
    console.log(text)

    // cleanup
    fs.unlinkSync(filePath);

    res.json({ transcript: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
