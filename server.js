import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// inisialisasi Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/generate-book", async (req, res) => {
  const { title, outline } = req.body;

  try {
    const prompt = `
Buatkan buku berjudul: "${title}".
Susunan bab/sub-bab:
${outline}

Tuliskan konten lengkap untuk setiap bab, dengan bahasa yang jelas, edukatif, dan terstruktur.
  `;

    const result = await model.generateContent(prompt);
    const bookContent = result.response.text();

    res.json({ content: bookContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan dalam membuat buku." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
