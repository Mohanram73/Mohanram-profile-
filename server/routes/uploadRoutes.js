const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `asset_${Date.now()}_${Math.round(Math.random() * 1E6)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (allowed.includes(file.mimetype) || /\.(jpg|jpeg|png|webp|svg)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, SVG) are allowed'));
    }
  }
});

// POST /api/upload/photo - Upload profile picture or general asset
router.post('/photo', authenticateToken, upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // If query flag ?set_profile=true, update profile table directly
    if (req.query.set_profile === 'true') {
      db.prepare('UPDATE profile SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1').run(fileUrl);
    }

    return res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
