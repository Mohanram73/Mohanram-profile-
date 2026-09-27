const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/content/all - Public complete bundle for fast single-roundtrip load
router.get('/all', (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get() || {};
    const hero = db.prepare('SELECT * FROM hero WHERE id = 1').get() || {};
    
    const experienceRaw = db.prepare('SELECT * FROM experience ORDER BY order_idx ASC, id DESC').all();
    const experience = experienceRaw.map(exp => ({
      ...exp,
      responsibilities: JSON.parse(exp.responsibilities || '[]'),
      technologies: JSON.parse(exp.technologies || '[]'),
      achievements: JSON.parse(exp.achievements || '[]')
    }));

    const skills = db.prepare('SELECT * FROM skills ORDER BY order_idx ASC, id ASC').all();

    const projectsRaw = db.prepare('SELECT * FROM projects ORDER BY is_featured DESC, order_idx ASC, id DESC').all();
    const projects = projectsRaw.map(p => ({
      ...p,
      tech_stack: JSON.parse(p.tech_stack || '[]'),
      features: JSON.parse(p.features || '[]')
    }));

    const education = db.prepare('SELECT * FROM education ORDER BY order_idx ASC, id ASC').all();
    const certifications = db.prepare('SELECT * FROM certifications ORDER BY order_idx ASC, id ASC').all();
    const presentations = db.prepare('SELECT * FROM presentations ORDER BY order_idx ASC, id ASC').all();
    const currentResume = db.prepare('SELECT filename, original_name, version, uploaded_at, file_size FROM resume_files WHERE is_current = 1').get() || null;

    // Public settings (appearance & SEO)
    const settingsRows = db.prepare("SELECT key, value FROM settings WHERE key NOT LIKE 'smtp_pass%'").all();
    const settings = {};
    for (const r of settingsRows) {
      settings[r.key] = r.value;
    }

    return res.json({
      success: true,
      data: {
        profile,
        hero,
        experience,
        skills,
        projects,
        education,
        certifications,
        presentations,
        currentResume,
        settings
      }
    });
  } catch (err) {
    console.error('Error fetching all content:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve website content' });
  }
});

// GET /api/content/projects/:slug - Specific project details
router.get('/projects/:slug', (req, res) => {
  try {
    const project = db.prepare('SELECT * FROM projects WHERE slug = ?').get(req.params.slug);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    // Increment view count
    db.prepare('UPDATE projects SET views_count = views_count + 1 WHERE id = ?').run(project.id);
    
    return res.json({
      success: true,
      data: {
        ...project,
        tech_stack: JSON.parse(project.tech_stack || '[]'),
        features: JSON.parse(project.features || '[]'),
        views_count: project.views_count + 1
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------- ADMIN PROTECTED ROUTES -----------------

// PUT /api/content/profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const {
      full_name, title, tagline, bio_intro, bio_engineering, bio_software,
      bio_philosophy, location, email, phone, linkedin, github, profile_image
    } = req.body;

    db.prepare(`
      UPDATE profile SET
        full_name = ?, title = ?, tagline = ?, bio_intro = ?,
        bio_engineering = ?, bio_software = ?, bio_philosophy = ?,
        location = ?, email = ?, phone = ?, linkedin = ?, github = ?,
        profile_image = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      full_name, title, tagline, bio_intro, bio_engineering, bio_software,
      bio_philosophy, location, email, phone, linkedin, github, profile_image
    );

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/content/hero
router.put('/hero', authenticateToken, (req, res) => {
  try {
    const {
      greeting, headline, subheadline, statement,
      cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link,
      background_style, overlay_opacity
    } = req.body;

    db.prepare(`
      UPDATE hero SET
        greeting = ?, headline = ?, subheadline = ?, statement = ?,
        cta_primary_text = ?, cta_primary_link = ?, cta_secondary_text = ?, cta_secondary_link = ?,
        background_style = ?, overlay_opacity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      greeting, headline, subheadline, statement,
      cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link,
      background_style, overlay_opacity
    );

    return res.json({ success: true, message: 'Hero section updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Experience CRUD
router.post('/experience', authenticateToken, (req, res) => {
  try {
    const {
      company, position, employment_type, start_date, end_date,
      is_current, location, responsibilities, technologies, achievements, order_idx
    } = req.body;

    const info = db.prepare(`
      INSERT INTO experience (
        company, position, employment_type, start_date, end_date,
        is_current, location, responsibilities, technologies, achievements, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      company, position, employment_type || 'Full-time', start_date, end_date || null,
      is_current ? 1 : 0, location,
      JSON.stringify(Array.isArray(responsibilities) ? responsibilities : []),
      JSON.stringify(Array.isArray(technologies) ? technologies : []),
      JSON.stringify(Array.isArray(achievements) ? achievements : []),
      order_idx || 0
    );

    return res.json({ success: true, message: 'Experience added', id: info.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/experience/:id', authenticateToken, (req, res) => {
  try {
    const {
      company, position, employment_type, start_date, end_date,
      is_current, location, responsibilities, technologies, achievements, order_idx
    } = req.body;

    db.prepare(`
      UPDATE experience SET
        company = ?, position = ?, employment_type = ?, start_date = ?, end_date = ?,
        is_current = ?, location = ?, responsibilities = ?, technologies = ?,
        achievements = ?, order_idx = ?
      WHERE id = ?
    `).run(
      company, position, employment_type, start_date, end_date || null,
      is_current ? 1 : 0, location,
      JSON.stringify(Array.isArray(responsibilities) ? responsibilities : []),
      JSON.stringify(Array.isArray(technologies) ? technologies : []),
      JSON.stringify(Array.isArray(achievements) ? achievements : []),
      order_idx || 0,
      req.params.id
    );

    return res.json({ success: true, message: 'Experience updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/experience/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM experience WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Experience deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Skills CRUD
router.post('/skills', authenticateToken, (req, res) => {
  try {
    const { name, category, proficiency_level, icon, order_idx } = req.body;
    const info = db.prepare(`
      INSERT INTO skills (name, category, proficiency_level, icon, order_idx)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, category, proficiency_level || 'Working Knowledge', icon || 'Code', order_idx || 0);

    return res.json({ success: true, message: 'Skill created', id: info.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/skills/:id', authenticateToken, (req, res) => {
  try {
    const { name, category, proficiency_level, icon, order_idx } = req.body;
    db.prepare(`
      UPDATE skills SET
        name = ?, category = ?, proficiency_level = ?, icon = ?, order_idx = ?
      WHERE id = ?
    `).run(name, category, proficiency_level, icon || 'Code', order_idx || 0, req.params.id);

    return res.json({ success: true, message: 'Skill updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/skills/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Skill deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Projects CRUD
router.post('/projects', authenticateToken, (req, res) => {
  try {
    const {
      title, slug, summary, category, problem, approach, architecture,
      tech_stack, features, challenges, solution, result,
      github_url, live_url, image_url, is_featured, order_idx
    } = req.body;

    const safeSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const info = db.prepare(`
      INSERT INTO projects (
        title, slug, summary, category, problem, approach, architecture,
        tech_stack, features, challenges, solution, result,
        github_url, live_url, image_url, is_featured, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, safeSlug, summary, category || 'Full Stack',
      problem, approach, architecture,
      JSON.stringify(Array.isArray(tech_stack) ? tech_stack : []),
      JSON.stringify(Array.isArray(features) ? features : []),
      challenges, solution, result,
      github_url, live_url, image_url,
      is_featured ? 1 : 0, order_idx || 0
    );

    return res.json({ success: true, message: 'Project created', id: info.lastInsertRowid, slug: safeSlug });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/projects/:id', authenticateToken, (req, res) => {
  try {
    const {
      title, slug, summary, category, problem, approach, architecture,
      tech_stack, features, challenges, solution, result,
      github_url, live_url, image_url, is_featured, order_idx
    } = req.body;

    const safeSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    db.prepare(`
      UPDATE projects SET
        title = ?, slug = ?, summary = ?, category = ?, problem = ?, approach = ?,
        architecture = ?, tech_stack = ?, features = ?, challenges = ?,
        solution = ?, result = ?, github_url = ?, live_url = ?, image_url = ?,
        is_featured = ?, order_idx = ?
      WHERE id = ?
    `).run(
      title, safeSlug, summary, category, problem, approach,
      architecture,
      JSON.stringify(Array.isArray(tech_stack) ? tech_stack : []),
      JSON.stringify(Array.isArray(features) ? features : []),
      challenges, solution, result,
      github_url, live_url, image_url,
      is_featured ? 1 : 0, order_idx || 0,
      req.params.id
    );

    return res.json({ success: true, message: 'Project updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/projects/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Education & Certifications
router.post('/education', authenticateToken, (req, res) => {
  try {
    const { degree, institution, field_of_study, start_year, end_year, grade, details, order_idx } = req.body;
    const info = db.prepare(`
      INSERT INTO education (degree, institution, field_of_study, start_year, end_year, grade, details, order_idx)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(degree, institution, field_of_study, start_year, end_year || null, grade, details, order_idx || 0);

    return res.json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/education/:id', authenticateToken, (req, res) => {
  try {
    const { degree, institution, field_of_study, start_year, end_year, grade, details, order_idx } = req.body;
    db.prepare(`
      UPDATE education SET
        degree = ?, institution = ?, field_of_study = ?, start_year = ?,
        end_year = ?, grade = ?, details = ?, order_idx = ?
      WHERE id = ?
    `).run(degree, institution, field_of_study, start_year, end_year || null, grade, details, order_idx || 0, req.params.id);

    return res.json({ success: true, message: 'Education updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/education/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM education WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Education deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/certifications', authenticateToken, (req, res) => {
  try {
    const { title, issuer, issue_date, credential_url, credential_id, order_idx } = req.body;
    const info = db.prepare(`
      INSERT INTO certifications (title, issuer, issue_date, credential_url, credential_id, order_idx)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, issuer, issue_date, credential_url, credential_id, order_idx || 0);

    return res.json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/certifications/:id', authenticateToken, (req, res) => {
  try {
    const { title, issuer, issue_date, credential_url, credential_id, order_idx } = req.body;
    db.prepare(`
      UPDATE certifications SET
        title = ?, issuer = ?, issue_date = ?, credential_url = ?, credential_id = ?, order_idx = ?
      WHERE id = ?
    `).run(title, issuer, issue_date, credential_url, credential_id, order_idx || 0, req.params.id);

    return res.json({ success: true, message: 'Certification updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/certifications/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM certifications WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Certification deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
