const express = require("express");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const router = express.Router();

// Ensure audio directory exists
const ensureAudioDir = async () => {
  const audioDir = path.join(__dirname, '..', 'audio');
  try {
    await fs.access(audioDir);
  } catch {
    await fs.mkdir(audioDir, { recursive: true });
  }
};

// Cleanup old audio files
const cleanupOldFiles = async () => {
  const audioDir = path.join(__dirname, '..', 'audio');
  try {
    const files = await fs.readdir(audioDir);
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    for (const file of files) {
      const filePath = path.join(audioDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.mtime.getTime() < oneDayAgo) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old files:', error);
  }
};

// Run cleanup on startup and every hour
ensureAudioDir();
cleanupOldFiles();
setInterval(cleanupOldFiles, 60 * 60 * 1000);

router.post("/generate/audio", [
  body('text')
    .notEmpty()
    .withMessage('Text is required')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Text must be between 1 and 5000 characters')
    .trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: "Validation failed", 
      details: errors.array() 
    });
  }

  const { text } = req.body;

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: { 
          stability: 0.5, 
          similarity_boost: 0.5 
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        responseType: "arraybuffer",
        timeout: 30000,
        maxContentLength: 50 * 1024 * 1024, // 50MB limit
      }
    );

    const filename = `${uuidv4()}.mp3`;
    const audioDir = path.join(__dirname, '..', 'audio');
    const filepath = path.join(audioDir, filename);

    await fs.writeFile(filepath, response.data);

    res.json({ 
      success: true,
      audioPath: `/audio/${filename}`,
      message: "Audio generated successfully"
    });

  } catch (error) {
    console.error("Audio generation error:", error);
    
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        return res.status(401).json({ error: "Invalid API key" });
      } else if (status === 429) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      } else if (status === 422) {
        return res.status(422).json({ error: "Invalid text input" });
      }
    }

    res.status(500).json({ error: "Audio generation failed" });
  }
});

module.exports = router;
