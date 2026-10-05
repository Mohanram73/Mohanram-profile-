const fs = require('fs');
const path = require('path');

// Fallback static require ensures Vercel/Webpack NFT bundler bundles portfolio-data.json
let bundledData = null;
try {
  bundledData = require('./data/portfolio-data.json');
} catch (e) {
  bundledData = null;
}

function resolveDataPath() {
  const candidates = [
    path.join(__dirname, 'data', 'portfolio-data.json'),
    path.join(__dirname, '..', 'server', 'data', 'portfolio-data.json'),
    path.join(process.cwd(), 'server', 'data', 'portfolio-data.json'),
    path.join(process.cwd(), 'data', 'portfolio-data.json')
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return path.join(__dirname, 'data', 'portfolio-data.json');
}

const localDataPath = resolveDataPath();
let activeDataPath = localDataPath;

// If /tmp is available and we're in serverless, copy to /tmp for write support
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  try {
    const tmpPath = path.join('/tmp', 'portfolio-data.json');
    if (!fs.existsSync(tmpPath)) {
      if (fs.existsSync(localDataPath)) {
        fs.copyFileSync(localDataPath, tmpPath);
      } else if (bundledData) {
        fs.writeFileSync(tmpPath, JSON.stringify(bundledData, null, 2), 'utf8');
      }
    }
    if (fs.existsSync(tmpPath)) {
      activeDataPath = tmpPath;
    }
  } catch (e) {
    activeDataPath = localDataPath;
  }
}

// In-memory data store
let data = {};

function loadData() {
  try {
    if (fs.existsSync(activeDataPath)) {
      const raw = fs.readFileSync(activeDataPath, 'utf8');
      data = JSON.parse(raw);
    } else if (fs.existsSync(localDataPath)) {
      const raw = fs.readFileSync(localDataPath, 'utf8');
      data = JSON.parse(raw);
    } else if (bundledData) {
      data = JSON.parse(JSON.stringify(bundledData));
    }
  } catch (err) {
    if (bundledData) {
      data = JSON.parse(JSON.stringify(bundledData));
    } else {
      console.error('Failed to load portfolio data:', err.message);
      data = {};
    }
  }

  // Ensure all tables exist as arrays
  const tables = [
    'users', 'profile', 'hero', 'experience', 'skills', 'projects',
    'education', 'certifications', 'presentations', 'resume_files',
    'contact_messages', 'analytics_visits', 'analytics_events', 'settings'
  ];
  for (const t of tables) {
    if (!Array.isArray(data[t])) {
      data[t] = [];
    }
  }
}

function saveData() {
  try {
    fs.writeFileSync(activeDataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    // In read-only serverless environment, ignore write errors
  }
}

// Initial load
loadData();

// Helper to clone objects
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// Pure JS Query Processor
function createStatement(sql) {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');

  return {
    get(...params) {
      loadData();
      
      // 1. SELECT * FROM users WHERE email = ?
      if (/SELECT \* FROM users WHERE email =/i.test(cleanSql)) {
        const email = String(params[0]).toLowerCase().trim();
        const user = data.users.find(u => u.email.toLowerCase() === email);
        return user ? clone(user) : undefined;
      }

      // 2. SELECT id, email, name, role, created_at FROM users WHERE id = ?
      if (/SELECT id, email, name, role.*FROM users WHERE id =/i.test(cleanSql)) {
        const id = Number(params[0]);
        const user = data.users.find(u => Number(u.id) === id);
        return user ? clone(user) : undefined;
      }

      // 3. SELECT password_hash FROM users WHERE id = ?
      if (/SELECT password_hash FROM users WHERE id =/i.test(cleanSql)) {
        const id = Number(params[0]);
        const user = data.users.find(u => Number(u.id) === id);
        return user ? { password_hash: user.password_hash } : undefined;
      }

      // 4. SELECT * FROM profile WHERE id = 1
      if (/SELECT \* FROM profile/i.test(cleanSql)) {
        return data.profile[0] ? clone(data.profile[0]) : undefined;
      }

      // 5. SELECT * FROM hero WHERE id = 1
      if (/SELECT \* FROM hero/i.test(cleanSql)) {
        return data.hero[0] ? clone(data.hero[0]) : undefined;
      }

      // 6. SELECT * FROM projects WHERE slug = ?
      if (/SELECT \* FROM projects WHERE slug =/i.test(cleanSql)) {
        const slug = String(params[0]);
        const p = data.projects.find(proj => proj.slug === slug);
        return p ? clone(p) : undefined;
      }

      // 7. SELECT * FROM resume_files WHERE is_current = 1
      if (/SELECT .* FROM resume_files WHERE is_current = 1/i.test(cleanSql)) {
        const current = data.resume_files.slice().reverse().find(r => r.is_current === 1);
        return current ? clone(current) : (data.resume_files[0] ? clone(data.resume_files[0]) : undefined);
      }

      // 8. SELECT COUNT(*) as count FROM analytics_visits WHERE ...
      if (/SELECT COUNT\(\*\) as count FROM analytics_visits WHERE created_at >= date\('now', 'start of day'\)/i.test(cleanSql)) {
        const todayStr = new Date().toISOString().split('T')[0];
        const count = data.analytics_visits.filter(v => v.created_at && v.created_at.startsWith(todayStr)).length;
        return { count };
      }

      if (/SELECT COUNT\(\*\) as count FROM analytics_visits WHERE created_at >= date\('now', '-7 days'\)/i.test(cleanSql)) {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const count = data.analytics_visits.filter(v => v.created_at && v.created_at >= sevenDaysAgo).length;
        return { count };
      }

      if (/SELECT COUNT\(\*\) as count FROM analytics_visits WHERE created_at >= date\('now', '-30 days'\)/i.test(cleanSql)) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const count = data.analytics_visits.filter(v => v.created_at && v.created_at >= thirtyDaysAgo).length;
        return { count };
      }

      if (/SELECT COUNT\(\*\) as count FROM analytics_visits WHERE created_at >= date\('now', 'start of year'\)/i.test(cleanSql)) {
        const year = String(new Date().getFullYear());
        const count = data.analytics_visits.filter(v => v.created_at && v.created_at.startsWith(year)).length;
        return { count };
      }

      if (/SELECT COUNT\(\*\) as count FROM analytics_visits/i.test(cleanSql)) {
        return { count: data.analytics_visits.length };
      }

      if (/SELECT COUNT\(DISTINCT ip_hash\) as count FROM analytics_visits/i.test(cleanSql)) {
        const unique = new Set(data.analytics_visits.map(v => v.ip_hash)).size;
        return { count: unique };
      }

      // 9. Returning visits count
      if (/SELECT COUNT\(\*\) as count FROM \( SELECT ip_hash/i.test(cleanSql)) {
        const ipCounts = {};
        for (const v of data.analytics_visits) {
          ipCounts[v.ip_hash] = (ipCounts[v.ip_hash] || 0) + 1;
        }
        const returning = Object.values(ipCounts).filter(c => c > 1).length;
        return { count: returning };
      }

      // 10. Resume downloads count
      if (/SELECT COUNT\(\*\) as count FROM analytics_events WHERE event_type = 'resume_download'/i.test(cleanSql)) {
        const count = data.analytics_events.filter(e => e.event_type === 'resume_download').length;
        return { count };
      }

      // 11. Contact messages counts
      if (/SELECT COUNT\(\*\) as count FROM contact_messages WHERE status = 'unread'/i.test(cleanSql)) {
        const count = data.contact_messages.filter(m => m.status === 'unread').length;
        return { count };
      }

      if (/SELECT COUNT\(\*\) as count FROM contact_messages/i.test(cleanSql)) {
        return { count: data.contact_messages.length };
      }

      // Fallback
      return undefined;
    },

    all(...params) {
      loadData();

      // 1. Experience
      if (/SELECT \* FROM experience/i.test(cleanSql)) {
        const sorted = clone(data.experience).sort((a, b) => (a.order_idx || 0) - (b.order_idx || 0) || (b.id || 0) - (a.id || 0));
        return sorted;
      }

      // 2. Skills
      if (/SELECT \* FROM skills/i.test(cleanSql)) {
        const sorted = clone(data.skills).sort((a, b) => (a.order_idx || 0) - (b.order_idx || 0) || (a.id || 0) - (b.id || 0));
        return sorted;
      }

      // 3. Projects
      if (/SELECT \* FROM projects/i.test(cleanSql)) {
        const sorted = clone(data.projects).sort((a, b) => (b.is_featured || 0) - (a.is_featured || 0) || (a.order_idx || 0) - (b.order_idx || 0) || (b.id || 0) - (a.id || 0));
        return sorted;
      }

      if (/SELECT slug, created_at FROM projects/i.test(cleanSql) || /SELECT slug, updated_at FROM projects/i.test(cleanSql)) {
        return data.projects.map(p => ({ slug: p.slug, created_at: p.created_at || '2026-09-27' }));
      }

      if (/SELECT id, title, slug, views_count FROM projects/i.test(cleanSql)) {
        return clone(data.projects)
          .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
          .slice(0, 5)
          .map(p => ({ id: p.id, title: p.title, slug: p.slug, views_count: p.views_count || 0 }));
      }

      // 4. Education
      if (/SELECT \* FROM education/i.test(cleanSql)) {
        return clone(data.education).sort((a, b) => (a.order_idx || 0) - (b.order_idx || 0));
      }

      // 5. Certifications
      if (/SELECT \* FROM certifications/i.test(cleanSql)) {
        return clone(data.certifications).sort((a, b) => (a.order_idx || 0) - (b.order_idx || 0));
      }

      // 6. Presentations
      if (/SELECT \* FROM presentations/i.test(cleanSql)) {
        return clone(data.presentations).sort((a, b) => (a.order_idx || 0) - (b.order_idx || 0));
      }

      // 7. Settings
      if (/SELECT key, value FROM settings/i.test(cleanSql)) {
        if (/NOT LIKE 'smtp_pass%'/i.test(cleanSql)) {
          return clone(data.settings).filter(s => !s.key.startsWith('smtp_pass'));
        }
        if (/key LIKE 'smtp_%' OR key LIKE '%notification%'/i.test(cleanSql)) {
          return clone(data.settings).filter(s => s.key.startsWith('smtp_') || s.key.includes('notification'));
        }
        return clone(data.settings);
      }

      // 8. Contact Messages
      if (/SELECT \* FROM contact_messages/i.test(cleanSql)) {
        let msgs = clone(data.contact_messages);
        if (/WHERE status = \?/i.test(cleanSql)) {
          const status = params[0];
          msgs = msgs.filter(m => m.status === status);
        }
        return msgs.sort((a, b) => (b.id || 0) - (a.id || 0));
      }

      // 9. Resume files history
      if (/SELECT \* FROM resume_files/i.test(cleanSql)) {
        return clone(data.resume_files).sort((a, b) => (b.id || 0) - (a.id || 0));
      }

      // 10. Analytics Dashboard Aggregations
      if (/SELECT page, COUNT\(\*\) as views FROM analytics_visits/i.test(cleanSql)) {
        const pageViews = {};
        for (const v of data.analytics_visits) {
          const p = v.page || '/';
          pageViews[p] = (pageViews[p] || 0) + 1;
        }
        return Object.entries(pageViews)
          .map(([page, views]) => ({ page, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 6);
      }

      if (/SELECT device, COUNT\(\*\) as count FROM analytics_visits/i.test(cleanSql)) {
        const counts = {};
        for (const v of data.analytics_visits) {
          const d = v.device || 'Desktop';
          counts[d] = (counts[d] || 0) + 1;
        }
        return Object.entries(counts).map(([device, count]) => ({ device, count }));
      }

      if (/SELECT referrer, COUNT\(\*\) as count FROM analytics_visits/i.test(cleanSql)) {
        const counts = {};
        for (const v of data.analytics_visits) {
          const r = v.referrer || 'Direct';
          counts[r] = (counts[r] || 0) + 1;
        }
        return Object.entries(counts).map(([referrer, count]) => ({ referrer, count })).sort((a, b) => b.count - a.count);
      }

      if (/SELECT browser, COUNT\(\*\) as count FROM analytics_visits/i.test(cleanSql)) {
        const counts = {};
        for (const v of data.analytics_visits) {
          const b = v.browser || 'Chrome';
          counts[b] = (counts[b] || 0) + 1;
        }
        return Object.entries(counts).map(([browser, count]) => ({ browser, count })).sort((a, b) => b.count - a.count);
      }

      if (/SELECT strftime\('%Y-%m-%d', created_at\) as date/i.test(cleanSql)) {
        const daily = {};
        const dailyIps = {};
        for (const v of data.analytics_visits) {
          const d = (v.created_at || '').substring(0, 10) || new Date().toISOString().substring(0, 10);
          daily[d] = (daily[d] || 0) + 1;
          if (!dailyIps[d]) dailyIps[d] = new Set();
          dailyIps[d].add(v.ip_hash);
        }
        return Object.keys(daily).sort().map(d => ({
          date: d,
          visits: daily[d],
          unique_visits: dailyIps[d].size
        }));
      }

      if (/SELECT id, page, referrer, browser, os, device, created_at FROM analytics_visits/i.test(cleanSql)) {
        return clone(data.analytics_visits)
          .sort((a, b) => (b.id || 0) - (a.id || 0))
          .slice(0, 10);
      }

      return [];
    },

    run(...params) {
      loadData();
      let lastInsertRowid = 0;

      // 1. UPDATE profile
      if (/UPDATE profile SET/i.test(cleanSql)) {
        if (!data.profile[0]) data.profile[0] = { id: 1 };
        const [
          full_name, title, tagline, bio_intro, bio_engineering, bio_software,
          bio_philosophy, location, email, phone, linkedin, github, profile_image
        ] = params;
        Object.assign(data.profile[0], {
          full_name, title, tagline, bio_intro, bio_engineering, bio_software,
          bio_philosophy, location, email, phone, linkedin, github, profile_image,
          updated_at: new Date().toISOString()
        });
        saveData();
        return { changes: 1 };
      }

      // 2. UPDATE hero
      if (/UPDATE hero SET/i.test(cleanSql)) {
        if (!data.hero[0]) data.hero[0] = { id: 1 };
        const [
          greeting, headline, subheadline, statement,
          cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link,
          background_style, overlay_opacity
        ] = params;
        Object.assign(data.hero[0], {
          greeting, headline, subheadline, statement,
          cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link,
          background_style, overlay_opacity,
          updated_at: new Date().toISOString()
        });
        saveData();
        return { changes: 1 };
      }

      // 3. INSERT INTO experience
      if (/INSERT INTO experience/i.test(cleanSql)) {
        const id = (data.experience.reduce((max, e) => Math.max(max, e.id || 0), 0) || 0) + 1;
        const [
          company, position, employment_type, start_date, end_date,
          is_current, location, responsibilities, technologies, achievements, order_idx
        ] = params;
        const newExp = {
          id, company, position, employment_type, start_date, end_date,
          is_current, location, responsibilities, technologies, achievements, order_idx,
          created_at: new Date().toISOString()
        };
        data.experience.push(newExp);
        lastInsertRowid = id;
        saveData();
        return { changes: 1, lastInsertRowid };
      }

      // 4. UPDATE experience
      if (/UPDATE experience SET/i.test(cleanSql)) {
        const id = Number(params[params.length - 1]);
        const exp = data.experience.find(e => Number(e.id) === id);
        if (exp) {
          const [
            company, position, employment_type, start_date, end_date,
            is_current, location, responsibilities, technologies, achievements, order_idx
          ] = params;
          Object.assign(exp, {
            company, position, employment_type, start_date, end_date,
            is_current, location, responsibilities, technologies, achievements, order_idx
          });
          saveData();
        }
        return { changes: 1 };
      }

      // 5. DELETE FROM experience
      if (/DELETE FROM experience WHERE id =/i.test(cleanSql)) {
        const id = Number(params[0]);
        data.experience = data.experience.filter(e => Number(e.id) !== id);
        saveData();
        return { changes: 1 };
      }

      // 6. INSERT INTO skills
      if (/INSERT INTO skills/i.test(cleanSql)) {
        const id = (data.skills.reduce((max, s) => Math.max(max, s.id || 0), 0) || 0) + 1;
        const [name, category, proficiency_level, icon, order_idx] = params;
        data.skills.push({ id, name, category, proficiency_level, icon, order_idx });
        lastInsertRowid = id;
        saveData();
        return { changes: 1, lastInsertRowid };
      }

      // 7. UPDATE skills
      if (/UPDATE skills SET/i.test(cleanSql)) {
        const id = Number(params[params.length - 1]);
        const skill = data.skills.find(s => Number(s.id) === id);
        if (skill) {
          const [name, category, proficiency_level, icon, order_idx] = params;
          Object.assign(skill, { name, category, proficiency_level, icon, order_idx });
          saveData();
        }
        return { changes: 1 };
      }

      // 8. DELETE FROM skills
      if (/DELETE FROM skills WHERE id =/i.test(cleanSql)) {
        const id = Number(params[0]);
        data.skills = data.skills.filter(s => Number(s.id) !== id);
        saveData();
        return { changes: 1 };
      }

      // 9. INSERT INTO projects
      if (/INSERT INTO projects/i.test(cleanSql)) {
        const id = (data.projects.reduce((max, p) => Math.max(max, p.id || 0), 0) || 0) + 1;
        const [
          title, slug, summary, category, problem, approach, architecture,
          tech_stack, features, challenges, solution, result,
          github_url, live_url, image_url, is_featured, order_idx
        ] = params;
        data.projects.push({
          id, title, slug, summary, category, problem, approach, architecture,
          tech_stack, features, challenges, solution, result,
          github_url, live_url, image_url, is_featured, order_idx,
          views_count: 0, created_at: new Date().toISOString()
        });
        lastInsertRowid = id;
        saveData();
        return { changes: 1, lastInsertRowid };
      }

      // 10. UPDATE projects
      if (/UPDATE projects SET views_count = views_count \+ 1 WHERE id =/i.test(cleanSql)) {
        const id = Number(params[0]);
        const proj = data.projects.find(p => Number(p.id) === id);
        if (proj) {
          proj.views_count = (proj.views_count || 0) + 1;
          saveData();
        }
        return { changes: 1 };
      }

      if (/UPDATE projects SET/i.test(cleanSql)) {
        const id = Number(params[params.length - 1]);
        const proj = data.projects.find(p => Number(p.id) === id);
        if (proj) {
          const [
            title, slug, summary, category, problem, approach, architecture,
            tech_stack, features, challenges, solution, result,
            github_url, live_url, image_url, is_featured, order_idx
          ] = params;
          Object.assign(proj, {
            title, slug, summary, category, problem, approach, architecture,
            tech_stack, features, challenges, solution, result,
            github_url, live_url, image_url, is_featured, order_idx
          });
          saveData();
        }
        return { changes: 1 };
      }

      // 11. DELETE FROM projects
      if (/DELETE FROM projects WHERE id =/i.test(cleanSql)) {
        const id = Number(params[0]);
        data.projects = data.projects.filter(p => Number(p.id) !== id);
        saveData();
        return { changes: 1 };
      }

      // 12. Education CRUD
      if (/INSERT INTO education/i.test(cleanSql)) {
        const id = (data.education.reduce((max, e) => Math.max(max, e.id || 0), 0) || 0) + 1;
        const [degree, institution, field_of_study, start_year, end_year, grade, details, order_idx] = params;
        data.education.push({ id, degree, institution, field_of_study, start_year, end_year, grade, details, order_idx });
        lastInsertRowid = id;
        saveData();
        return { changes: 1, lastInsertRowid };
      }

      if (/UPDATE education SET/i.test(cleanSql)) {
        const id = Number(params[params.length - 1]);
        const edu = data.education.find(e => Number(e.id) === id);
        if (edu) {
          const [degree, institution, field_of_study, start_year, end_year, grade, details, order_idx] = params;
          Object.assign(edu, { degree, institution, field_of_study, start_year, end_year, grade, details, order_idx });
          saveData();
        }
        return { changes: 1 };
      }

      if (/DELETE FROM education WHERE id =/i.test(cleanSql)) {
        const id = Number(params[0]);
        data.education = data.education.filter(e => Number(e.id) !== id);
        saveData();
        return { changes: 1 };
      }

      // 13. Certifications CRUD
      if (/INSERT INTO certifications/i.test(cleanSql)) {
        const id = (data.certifications.reduce((max, c) => Math.max(max, c.id || 0), 0) || 0) + 1;
        const [title, issuer, issue_date, credential_url, credential_id, order_idx] = params;
        data.certifications.push({ id, title, issuer, issue_date, credential_url, credential_id, order_idx });
        lastInsertRowid = id;
        saveData();
        return { changes: 1, lastInsertRowid };
      }

      if (/UPDATE certifications SET/i.test(cleanSql)) {
        const id = Number(params[params.length - 1]);
        const cert = data.certifications.find(c => Number(c.id) === id);
        if (cert) {
          const [title, issuer, issue_date, credential_url, credential_id, order_idx] = params;
          Object.assign(cert, { title, issuer, issue_date, credential_url, credential_id, order_idx });
          saveData();
        }
        return { changes: 1 };
      }

      if (/DELETE FROM certifications WHERE id =/i.test(cleanSql)) {
        const id = Number(params[0]);
        data.certifications = data.certifications.filter(c => Number(c.id) !== id);
        saveData();
        return { changes: 1 };
      }

      // 14. Analytics Visits & Events
      if (/INSERT INTO analytics_visits/i.test(cleanSql)) {
        const id = (data.analytics_visits.reduce((max, v) => Math.max(max, v.id || 0), 0) || 0) + 1;
        const [session_id, ip_hash, page, referrer, browser, os, device, user_agent] = params;
        data.analytics_visits.push({
          id, session_id, ip_hash, page, referrer, browser, os, device, user_agent,
          created_at: new Date().toISOString()
        });
        saveData();
        return { changes: 1, lastInsertRowid: id };
      }

      if (/INSERT INTO analytics_events/i.test(cleanSql)) {
        const id = (data.analytics_events.reduce((max, e) => Math.max(max, e.id || 0), 0) || 0) + 1;
        const [event_type, event_name, metadata, ip_hash] = params;
        data.analytics_events.push({
          id, event_type, event_name, metadata, ip_hash,
          created_at: new Date().toISOString()
        });
        saveData();
        return { changes: 1, lastInsertRowid: id };
      }

      // 15. Contact Messages
      if (/INSERT INTO contact_messages/i.test(cleanSql)) {
        const id = (data.contact_messages.reduce((max, m) => Math.max(max, m.id || 0), 0) || 0) + 1;
        const [name, email, company, subject, opportunity_type, message, status, ip_hash] = params;
        data.contact_messages.push({
          id, name, email, company, subject, opportunity_type, message,
          status: status || 'unread', ip_hash,
          created_at: new Date().toISOString()
        });
        saveData();
        return { changes: 1, lastInsertRowid: id };
      }

      if (/UPDATE contact_messages SET status =/i.test(cleanSql)) {
        const id = Number(params[params.length - 1]);
        const msg = data.contact_messages.find(m => Number(m.id) === id);
        if (msg) {
          const [status, reply_notes] = params;
          if (status) msg.status = status;
          if (reply_notes !== null && reply_notes !== undefined) msg.reply_notes = reply_notes;
          saveData();
        }
        return { changes: 1 };
      }

      if (/DELETE FROM contact_messages WHERE id =/i.test(cleanSql)) {
        const id = Number(params[0]);
        data.contact_messages = data.contact_messages.filter(m => Number(m.id) !== id);
        saveData();
        return { changes: 1 };
      }

      // 16. Resume files
      if (/UPDATE resume_files SET is_current = 0/i.test(cleanSql)) {
        for (const r of data.resume_files) {
          r.is_current = 0;
        }
        saveData();
        return { changes: data.resume_files.length };
      }

      if (/INSERT INTO resume_files/i.test(cleanSql)) {
        const id = (data.resume_files.reduce((max, r) => Math.max(max, r.id || 0), 0) || 0) + 1;
        const [filename, original_name, version, file_size] = params;
        data.resume_files.push({
          id, filename, original_name, version, file_size, is_current: 1,
          uploaded_at: new Date().toISOString()
        });
        saveData();
        return { changes: 1, lastInsertRowid: id };
      }

      // 17. Settings Upsert
      if (/INSERT INTO settings/i.test(cleanSql)) {
        const [key, value] = params;
        const existing = data.settings.find(s => s.key === key);
        if (existing) {
          existing.value = String(value);
          existing.updated_at = new Date().toISOString();
        } else {
          data.settings.push({ key, value: String(value), updated_at: new Date().toISOString() });
        }
        saveData();
        return { changes: 1 };
      }

      // 18. Users password update
      if (/UPDATE users SET password_hash =/i.test(cleanSql)) {
        const [newHash, id] = params;
        const user = data.users.find(u => Number(u.id) === Number(id));
        if (user) {
          user.password_hash = newHash;
          user.updated_at = new Date().toISOString();
          saveData();
        }
        return { changes: 1 };
      }

      saveData();
      return { changes: 1 };
    }
  };
}

const db = {
  prepare(sql) {
    return createStatement(sql);
  },
  exec(sql) {
    // Schema creation no-op for JSON store
  },
  pragma(setting) {
    // PRAGMA no-op
  },
  transaction(fn) {
    return (...args) => fn(...args);
  }
};

module.exports = db;
