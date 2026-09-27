const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { sendContactFormNotification } = require('../utils/emailService');

function hashIp(ip) {
  const salt = 'portfolio-privacy-salt-mohanram';
  return crypto.createHash('sha256').update((ip || '127.0.0.1') + salt).digest('hex').substring(0, 16);
}

// POST /api/contact - Public contact submission with honeypot anti-spam
router.post('/', async (req, res) => {
  try {
    const { name, email, company, subject, opportunity_type, message, website_hp } = req.body;

    // Honeypot spam check - bots fill out hidden fields
    if (website_hp) {
      // Fake success for bots to prevent retries
      return res.json({ success: true, message: 'Message sent successfully' });
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const ipHash = hashIp(clientIp);

    const info = db.prepare(`
      INSERT INTO contact_messages (
        name, email, company, subject, opportunity_type, message, status, ip_hash
      ) VALUES (?, ?, ?, ?, ?, ?, 'unread', ?)
    `).run(
      name.trim(),
      email.trim(),
      company ? company.trim() : null,
      subject.trim(),
      opportunity_type || 'Full Stack',
      message.trim(),
      ipHash
    );

    // Record analytics event
    db.prepare(`
      INSERT INTO analytics_events (event_type, event_name, metadata, ip_hash)
      VALUES ('contact_submit', 'form_submission', ?, ?)
    `).run(JSON.stringify({ messageId: info.lastInsertRowid, opportunity_type }), ipHash);

    // Send async emails
    sendContactFormNotification({
      id: info.lastInsertRowid,
      name,
      email,
      company,
      subject,
      opportunity_type: opportunity_type || 'General Inquiry',
      message
    });

    return res.json({
      success: true,
      message: 'Thank you! Your message has been received. I will respond to you promptly.'
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit message. Please try again later.' });
  }
});

// GET /api/contact/messages - Admin inbox
router.get('/messages', authenticateToken, (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM contact_messages';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY id DESC';

    const messages = db.prepare(query).all(...params);
    return res.json({ success: true, messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/contact/messages/:id/status - Update message status
router.put('/messages/:id/status', authenticateToken, (req, res) => {
  try {
    const { status, reply_notes } = req.body;
    const allowed = ['unread', 'read', 'replied', 'archived'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    db.prepare(`
      UPDATE contact_messages
      SET status = COALESCE(?, status),
          reply_notes = COALESCE(?, reply_notes)
      WHERE id = ?
    `).run(status || null, reply_notes || null, req.params.id);

    return res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/contact/messages/:id
router.delete('/messages/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
