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

function getUploadDir() {
  const dir = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION)
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, '..', 'uploads');
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (e) {}
  return dir;
}

function findUploadFile(filename) {
  if (!filename) return null;
  const candidates = [
    path.join(__dirname, '..', 'uploads', filename),
    path.join(process.cwd(), 'server', 'uploads', filename),
    path.join(process.cwd(), 'client', 'public', 'uploads', filename),
    path.join(process.cwd(), 'client', 'dist', 'uploads', filename),
    path.join('/tmp', 'uploads', filename)
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

// Multer storage for Resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadDir());
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
    const filename = current ? current.filename : 'Mohanram_R_Full_Stack_Engineer_Resume.pdf';
    const filePath = findUploadFile(filename) || findUploadFile('Mohanram_R_Full_Stack_Engineer_Resume.pdf');

    // Log analytics event
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const ipHash = hashIp(clientIp);
    try {
      db.prepare(`
        INSERT INTO analytics_events (event_type, event_name, metadata, ip_hash)
        VALUES ('resume_download', 'download_pdf', ?, ?)
      `).run(JSON.stringify({ version: current ? current.version : 'v1.0', filename }), ipHash);
    } catch (e) {}

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(current && current.original_name) || 'Mohanram_R_Resume.pdf'}"`);

    if (filePath && fs.existsSync(filePath)) {
      return fs.createReadStream(filePath).pipe(res);
    }

    // Fallback minimal valid PDF stream if file not yet uploaded
    const fallbackPdf = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000118 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n193\n%%EOF\n'
    );
    res.send(fallbackPdf);
  } catch (err) {
    console.error('Resume download error:', err);
    return res.status(500).json({ success: false, message: 'Failed to download resume' });
  }
});

// GET /api/resume/preview - View resume in browser/iframe
router.get('/preview', (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM resume_files WHERE is_current = 1 ORDER BY id DESC LIMIT 1').get();
    const filename = current ? current.filename : 'Mohanram_R_Full_Stack_Engineer_Resume.pdf';
    const filePath = findUploadFile(filename) || findUploadFile('Mohanram_R_Full_Stack_Engineer_Resume.pdf');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');

    if (filePath && fs.existsSync(filePath)) {
      return fs.createReadStream(filePath).pipe(res);
    }

    const fallbackPdf = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000118 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n193\n%%EOF\n'
    );
    res.send(fallbackPdf);
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
