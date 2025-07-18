const express = require("express");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate", async (req, res) => {
  const { type, prompt } = req.body;

  if (!type || !prompt) {
    return res.status(400).json({ error: "Missing type or prompt" });
  }

  let formattedPrompt = prompt;

  switch (type) {
    case "email":
      formattedPrompt = `Generate a marketing email: ${prompt}`;
      break;
    case "notification":
      formattedPrompt = `Write a marketing notification: ${prompt}`;
      break;
    case "transcript":
      formattedPrompt = `Write a video transcript: ${prompt}`;
      break;
    default:
      formattedPrompt = prompt;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(formattedPrompt);
    const response = result.response;
    const text = await response.text();
    res.json({ text });
  } catch (error) {
    console.error("Text generation error:", error);
    res.status(500).json({ error: "Text generation failed" });
  }
});

module.exports = router;
