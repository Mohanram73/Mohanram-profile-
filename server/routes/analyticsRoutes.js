const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { sendVisitorNotification } = require('../utils/emailService');

// Active Server-Sent Event (SSE) clients for real-time visitor alerts in admin
const sseClients = new Set();

function hashIp(ip) {
  const salt = 'portfolio-privacy-salt-mohanram';
  return crypto.createHash('sha256').update((ip || '127.0.0.1') + salt).digest('hex').substring(0, 16);
}

function parseUserAgent(ua = '') {
  let browser = 'Other';
  let os = 'Other';
  let device = 'Desktop';

  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    device = 'Mobile';
  } else if (/Tablet|iPad/.test(ua)) {
    device = 'Tablet';
  }

  if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
  else if (/Windows/.test(ua)) os = 'Windows';
  else if (/Macintosh|Mac OS X/.test(ua)) os = 'macOS';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/Linux/.test(ua)) os = 'Linux';

  if (/Edg/.test(ua)) browser = 'Edge';
  else if (/Chrome/.test(ua) && !/Chromium|Edg/.test(ua)) browser = 'Chrome';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
  else if (/Firefox/.test(ua)) browser = 'Firefox';
  else if (/MSIE|Trident/.test(ua)) browser = 'Internet Explorer';

  return { browser, os, device };
}

function categorizeReferrer(ref = '') {
  if (!ref) return 'Direct';
  const lower = ref.toLowerCase();
  if (lower.includes('linkedin')) return 'LinkedIn';
  if (lower.includes('github')) return 'GitHub';
  if (lower.includes('google')) return 'Google';
  if (lower.includes('twitter') || lower.includes('x.com')) return 'X/Twitter';
  if (lower.includes('facebook') || lower.includes('instagram')) return 'Social';
  return 'Other Website';
}

// POST /api/analytics/visit - Privacy-conscious visit recorder
router.post('/visit', (req, res) => {
  try {
    const { session_id, page, referrer } = req.body;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const ipHash = hashIp(clientIp);
    const userAgent = req.headers['user-agent'] || '';
    const { browser, os, device } = parseUserAgent(userAgent);
    const refCategory = categorizeReferrer(referrer);
    const safePage = page || '/';

    // Insert visit
    db.prepare(`
      INSERT INTO analytics_visits (
        session_id, ip_hash, page, referrer, browser, os, device, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      session_id || 'anonymous-session',
      ipHash,
      safePage,
      refCategory,
      browser,
      os,
      device,
      userAgent.substring(0, 120)
    );

    const visitEvent = {
      type: 'new_visit',
      time: new Date().toISOString(),
      page: safePage,
      device,
      browser,
      os,
      referrer: refCategory
    };

    // Broadcast to connected admin SSE clients
    const payload = `data: ${JSON.stringify(visitEvent)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(payload);
      } catch (e) {
        sseClients.delete(client);
      }
    }

    // Trigger visitor notification email if enabled (asynchronously)
    sendVisitorNotification({
      page: safePage,
      device,
      browser,
      os,
      referrer: refCategory
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('Analytics visit error:', err);
    return res.status(500).json({ success: false });
  }
});

// POST /api/analytics/event - Action telemetry (resume download, project clicks)
router.post('/event', (req, res) => {
  try {
    const { event_type, event_name, metadata } = req.body;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const ipHash = hashIp(clientIp);

    db.prepare(`
      INSERT INTO analytics_events (event_type, event_name, metadata, ip_hash)
      VALUES (?, ?, ?, ?)
    `).run(
      event_type || 'interaction',
      event_name || 'click',
      JSON.stringify(metadata || {}),
      ipHash
    );

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

// GET /api/analytics/live-stream - Server-Sent Events for Admin
router.get('/live-stream', authenticateToken, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);

  // Send initial heartbeat
  res.write(`data: ${JSON.stringify({ type: 'connected', time: new Date().toISOString(), activeViewers: sseClients.size })}\n\n`);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// GET /api/analytics/dashboard - Comprehensive Analytics Dashboard for Admin
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    const totalVisits = db.prepare('SELECT COUNT(*) as count FROM analytics_visits').get().count;
    const uniqueVisitors = db.prepare('SELECT COUNT(DISTINCT ip_hash) as count FROM analytics_visits').get().count;

    // Timeframe counts
    const todayVisits = db.prepare(`SELECT COUNT(*) as count FROM analytics_visits WHERE created_at >= date('now', 'start of day')`).get().count;
    const weekVisits = db.prepare(`SELECT COUNT(*) as count FROM analytics_visits WHERE created_at >= date('now', '-7 days')`).get().count;
    const monthVisits = db.prepare(`SELECT COUNT(*) as count FROM analytics_visits WHERE created_at >= date('now', '-30 days')`).get().count;
    const yearVisits = db.prepare(`SELECT COUNT(*) as count FROM analytics_visits WHERE created_at >= date('now', 'start of year')`).get().count;

    // New vs Returning visitors
    const returningCount = db.prepare(`
      SELECT COUNT(*) as count FROM (
        SELECT ip_hash, COUNT(*) as c FROM analytics_visits GROUP BY ip_hash HAVING c > 1
      )
    `).get().count;
    const newCount = Math.max(0, uniqueVisitors - returningCount);

    // Resume downloads
    const resumeDownloads = db.prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'resume_download'`).get().count;

    // Contact messages count
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM contact_messages').get().count;
    const unreadMessages = db.prepare("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'").get().count;

    // Top Pages
    const topPages = db.prepare(`
      SELECT page, COUNT(*) as views
      FROM analytics_visits
      GROUP BY page
      ORDER BY views DESC
      LIMIT 6
    `).all();

    // Devices Breakdown
    const devices = db.prepare(`
      SELECT device, COUNT(*) as count
      FROM analytics_visits
      GROUP BY device
    `).all();

    // Traffic Sources
    const sources = db.prepare(`
      SELECT referrer, COUNT(*) as count
      FROM analytics_visits
      GROUP BY referrer
      ORDER BY count DESC
    `).all();

    // Browsers
    const browsers = db.prepare(`
      SELECT browser, COUNT(*) as count
      FROM analytics_visits
      GROUP BY browser
      ORDER BY count DESC
    `).all();

    // Top Projects by Views
    const topProjects = db.prepare(`
      SELECT id, title, slug, views_count
      FROM projects
      ORDER BY views_count DESC
      LIMIT 5
    `).all();

    // 14-Day Visitor Trend
    const dailyTrend = db.prepare(`
      SELECT strftime('%Y-%m-%d', created_at) as date,
             COUNT(*) as visits,
             COUNT(DISTINCT ip_hash) as unique_visits
      FROM analytics_visits
      WHERE created_at >= date('now', '-14 days')
      GROUP BY strftime('%Y-%m-%d', created_at)
      ORDER BY date ASC
    `).all();

    // Recent 10 visits log
    const recentVisits = db.prepare(`
      SELECT id, page, referrer, browser, os, device, created_at
      FROM analytics_visits
      ORDER BY id DESC
      LIMIT 10
    `).all();

    return res.json({
      success: true,
      stats: {
        totalVisits,
        uniqueVisitors,
        todayVisits,
        weekVisits,
        monthVisits,
        yearVisits,
        newCount,
        returningCount,
        resumeDownloads,
        totalMessages,
        unreadMessages,
        activeSseAdmins: sseClients.size
      },
      topPages,
      devices,
      sources,
      browsers,
      topProjects,
      dailyTrend,
      recentVisits
    });
  } catch (err) {
    console.error('Dashboard analytics error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve analytics' });
  }
});

module.exports = router;
