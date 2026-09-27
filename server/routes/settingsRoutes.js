const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/settings - Public safe settings
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM settings WHERE key NOT LIKE "smtp_pass%"').all();
    const settings = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/settings/admin - Full settings including notification & SMTP config
router.get('/admin', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    for (const r of rows) {
      // Mask password for display
      if (r.key === 'smtp_pass' && r.value) {
        settings[r.key] = '••••••••';
      } else {
        settings[r.key] = r.value;
      }
    }
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings - Update settings (Admin)
router.put('/', authenticateToken, (req, res) => {
  try {
    const updates = req.body; // { key: value, ... }
    const stmt = db.prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `);

    const updateMany = db.transaction((entries) => {
      for (const [key, value] of Object.entries(entries)) {
        // If password is masked string, don't overwrite with dots
        if (key === 'smtp_pass' && value === '••••••••') {
          continue;
        }
        stmt.run(key, String(value));
      }
    });

    updateMany(updates);

    return res.json({ success: true, message: 'Settings saved successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
