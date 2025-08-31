# 🎙️ Audio Transcriber Server (Hinglish Transcript)

This project is a Node.js + Express server that accepts audio files, uploads them to **Google Gemini (`@google/genai`)**, and returns a **Hinglish transcript** of the audio.  

## 🚀 Features
- Upload audio files (`.m4a`)

- Converts speech to **Hinglish transcript** (e.g. `"Hello, my name is..." → "Hello, mera naam..."`)
- REST API endpoint for integration with frontend apps

## ⚡ Installation

1. **Clone repo**
   ```bash
   git clone https://github.com/your-username/audio-transcriber-server.git
   cd audio-transcriber-server
2.  **Install dependencies**

npm install

3. **Set environment variable**

Create a .env file in the root:

GEMINI_API_KEY=your_google_genai_api_key_here

4.  **Run the Server**
node index.js


Server runs at:
👉 http://localhost:3000