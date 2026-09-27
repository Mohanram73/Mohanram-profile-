const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

function hashIp(ip) {
  const salt = 'portfolio-privacy-salt-mohanram';
  return crypto.createHash('sha256').update((ip || '127.0.0.1') + salt).digest('hex').substring(0, 16);
}

// Multer storage for Resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4);
    const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `Resume_${uniqueSuffix}_${sanitizedOriginal}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are allowed'));
    }
  }
});

// GET /api/resume/download - Download current resume and track metrics
router.get('/download', (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM resume_files WHERE is_current = 1 ORDER BY id DESC LIMIT 1').get();
    if (!current) {
      return res.status(404).json({ success: false, message: 'Resume file not found' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', current.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File missing on server' });
    }

    // Log analytics event
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const ipHash = hashIp(clientIp);
    db.prepare(`
      INSERT INTO analytics_events (event_type, event_name, metadata, ip_hash)
      VALUES ('resume_download', 'download_pdf', ?, ?)
    `).run(JSON.stringify({ version: current.version, filename: current.filename }), ipHash);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${current.original_name || 'Mohanram_R_Resume.pdf'}"`);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error('Resume download error:', err);
    return res.status(500).json({ success: false, message: 'Failed to download resume' });
  }
});

// GET /api/resume/preview - View resume in browser/iframe
router.get('/preview', (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM resume_files WHERE is_current = 1 ORDER BY id DESC LIMIT 1').get();
    if (!current) {
      return res.status(404).json({ success: false, message: 'Resume file not found' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', current.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File missing on server' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/resume/history - Admin resume version history
router.get('/history', authenticateToken, (req, res) => {
  try {
    const history = db.prepare('SELECT * FROM resume_files ORDER BY id DESC').all();
    const totalDownloads = db.prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'resume_download'`).get().count;
    return res.json({ success: true, history, totalDownloads });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/resume/upload - Admin upload new resume
router.post('/upload', authenticateToken, upload.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a PDF file to upload' });
    }

    const { version } = req.body;
    const versionTag = version ? version.trim() : `v${Date.now().toString().slice(-4)}`;

    // Set all previous resumes as not current
    db.prepare('UPDATE resume_files SET is_current = 0').run();

    // Insert new record as current
    const info = db.prepare(`
      INSERT INTO resume_files (filename, original_name, version, file_size, is_current)
      VALUES (?, ?, ?, ?, 1)
    `).run(
      req.file.filename,
      req.file.originalname,
      versionTag,
      req.file.size
    );

    return res.json({
      success: true,
      message: 'New resume successfully uploaded and set as active',
      resume: {
        id: info.lastInsertRowid,
        filename: req.file.filename,
        original_name: req.file.originalname,
        version: versionTag,
        file_size: req.file.size,
        is_current: 1
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
