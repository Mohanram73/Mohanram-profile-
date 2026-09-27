const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Initialize database
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Optimization Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible modern SPA script and font loading
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' }
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many messages submitted. Please try again later.' }
});

// Serve Uploads Directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/contact', contactLimiter, require('./routes/contactRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Dynamic Sitemap & Robots.txt
app.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://mohanram.dev/sitemap.xml`;
  res.type('text/plain');
  res.send(robots);
});

app.get('/sitemap.xml', (req, res) => {
  const projects = db.prepare('SELECT slug, created_at FROM projects').all();
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mohanram.dev/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mohanram.dev/#about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mohanram.dev/#experience</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mohanram.dev/#skills</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mohanram.dev/#projects</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://mohanram.dev/#resume</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mohanram.dev/#contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

  for (const p of projects) {
    xml += `
  <url>
    <loc>https://mohanram.dev/projects/${p.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`;
  }

  xml += '\n</urlset>';
  res.type('application/xml');
  res.send(xml);
});

// Serve frontend build if available
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Mohanram Portfolio Server listening on port ${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});
