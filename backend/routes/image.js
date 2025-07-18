const express = require("express");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

const router = express.Router();

// Ensure images directory exists
const ensureImagesDir = async () => {
  const imagesDir = path.join(__dirname, '..', 'images');
  try {
    await fs.access(imagesDir);
  } catch {
    await fs.mkdir(imagesDir, { recursive: true });
    console.log('📁 Images directory created');
  }
};

// Clean up old images (files older than 24 hours)
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
        console.log(`🗑️ Cleaned up old image: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old images:', error);
  }
};

// Initialize images directory and start cleanup
ensureImagesDir();
cleanupOldImages();

// Run cleanup every hour
setInterval(cleanupOldImages, 60 * 60 * 1000);

router.post("/generate/image", [
  body('prompt')
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Prompt must be between 1 and 1000 characters')
    .trim()
    .escape() // Sanitize HTML entities
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: "Validation failed", 
      details: errors.array() 
    });
  }

  const { prompt } = req.body;

  try {
    console.log(`🎨 Generating image for: "${prompt}"`);

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "image/png", // Critical: This was missing!
        },
        responseType: "arraybuffer",
        timeout: 120000, // 2 minutes
        maxContentLength: 50 * 1024 * 1024, // 50MB limit
      }
    );

    // Generate unique filename
    const filename = `generated-${uuidv4()}.png`;
    const imagesDir = path.join(__dirname, '..', 'images');
    const filepath = path.join(imagesDir, filename);
    
    // Save to disk
    await fs.writeFile(filepath, response.data);
    console.log(`💾 Image saved to: ${filepath}`);

    // Convert to base64 for JSON response
    const base64Image = Buffer.from(response.data).toString('base64');
    
    res.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
      savedAs: filename,
      savedPath: filepath,
      imageUrl: `/images/${filename}`, // URL to access the image
      message: "Image generated and saved successfully"
    });

  } catch (error) {
    console.error("❌ Image generation error:", error);
    
    // Log detailed error information
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    }

    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        return res.status(401).json({ error: "Invalid API key" });
      } else if (status === 429) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      } else if (status === 503) {
        return res.status(503).json({ error: "Model is currently loading, please try again in a few minutes" });
      } else if (status === 404) {
        return res.status(404).json({ error: "Model not found" });
      } else if (status === 400) {
        return res.status(400).json({ error: "Invalid prompt or parameters" });
      }
      
      // Generic API error
      return res.status(status).json({ 
        error: "API request failed", 
        details: error.response.data 
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: "Request timeout - please try again" });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: "Unable to connect to AI service" });
    }

    // Generic error
    res.status(500).json({ 
      error: "Image generation failed", 
      details: error.message 
    });
  }
});

// Optional: Add endpoint to get list of generated images
router.get("/images", async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, '..', 'images');
    const files = await fs.readdir(imagesDir);
    
    const imageFiles = files
      .filter(file => file.endsWith('.png'))
      .map(file => ({
        filename: file,
        url: `/images/${file}`,
        createdAt: file.includes('generated-') ? 
          new Date(parseInt(file.split('-')[1].split('.')[0])).toISOString() : 
          null
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      images: imageFiles,
      total: imageFiles.length
    });
  } catch (error) {
    console.error("Error listing images:", error);
    res.status(500).json({ error: "Failed to list images" });
  }
});

module.exports = router;
