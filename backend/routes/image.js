const express = require("express");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

const router = express.Router();

const ensureImagesDir = async () => {
  const imagesDir = path.join(__dirname, '..', 'images');
  try {
    await fs.access(imagesDir);
  } catch {
    await fs.mkdir(imagesDir, { recursive: true });
  }
};

const cleanupOldImages = async () => {
  const imagesDir = path.join(__dirname, '..', 'images');
  try {
    const files = await fs.readdir(imagesDir);
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.mtime.getTime() < oneDayAgo) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old images:', error);
  }
};

ensureImagesDir();
cleanupOldImages();
setInterval(cleanupOldImages, 60 * 60 * 1000);

router.post("/generate/image", [
  body('prompt').notEmpty().withMessage('Prompt is required').trim().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Validation failed", details: errors.array() });
  }

  const { prompt, width, height } = req.body;

  try {
    const payload = {
        inputs: prompt,
        parameters: {
            ...(width && { width: parseInt(width) }),
            ...(height && { height: parseInt(height) }),
        }
    };

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "image/png",
        },
        responseType: "arraybuffer",
        timeout: 120000,
        maxContentLength: 50 * 1024 * 1024,
      }
    );

    const filename = `generated-${uuidv4()}.png`;
    const imagesDir = path.join(__dirname, '..', 'images');
    const filepath = path.join(imagesDir, filename);
    
    await fs.writeFile(filepath, response.data);
    
    const base64Image = Buffer.from(response.data).toString('base64');
    
    res.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
      imageUrl: `/images/${filename}`,
      message: "Image generated and saved successfully"
    });

  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

module.exports = router;