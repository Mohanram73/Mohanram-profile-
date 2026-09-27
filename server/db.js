const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'data', 'portfolio.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDatabase() {
  // 1. Users table (Admin auth)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Profile table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      full_name TEXT NOT NULL,
      title TEXT NOT NULL,
      tagline TEXT NOT NULL,
      bio_intro TEXT NOT NULL,
      bio_engineering TEXT NOT NULL,
      bio_software TEXT NOT NULL,
      bio_philosophy TEXT NOT NULL,
      location TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      linkedin TEXT,
      github TEXT,
      profile_image TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Hero table
  db.exec(`
    CREATE TABLE IF NOT EXISTS hero (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      greeting TEXT NOT NULL,
      headline TEXT NOT NULL,
      subheadline TEXT NOT NULL,
      statement TEXT NOT NULL,
      cta_primary_text TEXT NOT NULL,
      cta_primary_link TEXT NOT NULL,
      cta_secondary_text TEXT NOT NULL,
      cta_secondary_link TEXT NOT NULL,
      background_style TEXT DEFAULT 'circuit',
      overlay_opacity INTEGER DEFAULT 85,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Experience table
  db.exec(`
    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      employment_type TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      is_current INTEGER DEFAULT 0,
      location TEXT NOT NULL,
      responsibilities TEXT NOT NULL, -- JSON array of strings
      technologies TEXT NOT NULL,     -- JSON array of strings
      achievements TEXT,              -- JSON array of strings
      order_idx INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Skills table
  db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      proficiency_level TEXT NOT NULL, -- 'Professional', 'Strong', 'Working Knowledge', 'Fundamental'
      icon TEXT,
      order_idx INTEGER DEFAULT 0
    );
  `);

  // 6. Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      summary TEXT NOT NULL,
      category TEXT NOT NULL,
      problem TEXT,
      approach TEXT,
      architecture TEXT,
      tech_stack TEXT NOT NULL, -- JSON array of strings
      features TEXT,           -- JSON array of strings
      challenges TEXT,
      solution TEXT,
      result TEXT,
      github_url TEXT,
      live_url TEXT,
      image_url TEXT,
      is_featured INTEGER DEFAULT 0,
      order_idx INTEGER DEFAULT 0,
      views_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Education table
  db.exec(`
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      field_of_study TEXT NOT NULL,
      start_year TEXT NOT NULL,
      end_year TEXT,
      grade TEXT,
      details TEXT,
      order_idx INTEGER DEFAULT 0
    );
  `);

  // 8. Certifications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      issuer TEXT NOT NULL,
      issue_date TEXT,
      credential_url TEXT,
      credential_id TEXT,
      order_idx INTEGER DEFAULT 0
    );
  `);

  // 9. Presentations & Achievements table
  db.exec(`
    CREATE TABLE IF NOT EXISTS presentations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      venue TEXT NOT NULL,
      type TEXT DEFAULT 'Paper Presentation',
      details TEXT,
      order_idx INTEGER DEFAULT 0
    );
  `);

  // 10. Resume Files table
  db.exec(`
    CREATE TABLE IF NOT EXISTS resume_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      version TEXT NOT NULL,
      file_size INTEGER DEFAULT 0,
      is_current INTEGER DEFAULT 0,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 11. Contact Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      subject TEXT NOT NULL,
      opportunity_type TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      reply_notes TEXT,
      ip_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 12. Analytics Visits table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      ip_hash TEXT NOT NULL,
      page TEXT NOT NULL,
      referrer TEXT,
      browser TEXT,
      os TEXT,
      device TEXT,
      country TEXT DEFAULT 'Unknown',
      city TEXT DEFAULT 'Unknown',
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 13. Analytics Events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      event_name TEXT,
      event_target TEXT,
      metadata TEXT,
      ip_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec(`ALTER TABLE analytics_events ADD COLUMN event_name TEXT;`);
  } catch (e) {}

  // 14. Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // Check if admin user exists
  const userCheck = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCheck.count === 0) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('Admin@123#', salt);
    db.prepare(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `).run('admin@mohanram.dev', passwordHash, 'Mohanram R', 'admin');
    console.log('Seeded default admin: admin@mohanram.dev / Admin@123#');
  }

  // Profile data
  const profileCheck = db.prepare('SELECT COUNT(*) as count FROM profile').get();
  if (profileCheck.count === 0) {
    db.prepare(`
      INSERT INTO profile (
        id, full_name, title, tagline,
        bio_intro, bio_engineering, bio_software, bio_philosophy,
        location, email, phone, linkedin, github, profile_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      1,
      'MOHANRAM R',
      'Associate Web Developer | Full Stack Developer | Electronics & Embedded Systems',
      'Building reliable digital experiences with modern web technologies and full stack frameworks, while bringing an engineering mindset rooted in Electronics and Embedded Systems.',
      'I am an Associate Web Developer and Software Engineer with an engineering degree in Electronics and Communication from K Ramakrishnan College of Engineering. I specialize in building responsive, accessible, high-performance web applications, managing enterprise CMS platforms, and engineering full-stack solutions.',
      'With an academic foundation in Electronics & Communication Engineering (CGPA: 7.56), I bring rigorous systems thinking, hardware-software integration knowledge, microcontroller familiarity (Embedded C), and industrial automation concepts (PLC ladder logic) to complex technical challenges.',
      'Professionally, I manage enterprise web properties at VDart, delivering custom WordPress frontend solutions, responsive web layouts (HTML5/CSS3/JavaScript), technical SEO and AIEO optimizations, GA4 analytics instrumentation, and AI chatbot integrations using Node.js and the Gemini API.',
      'My technical versatility spans React.js, Node.js, Core Java, Spring Boot, RESTful APIs, MySQL, and MongoDB. I focus on clean code, web accessibility standards, cross-browser compatibility, and measurable business impact.',
      'Mayiladuthurai, Tamil Nadu, India',
      'mohitmohanram2001@gmail.com',
      '+91-6382549825',
      'https://www.linkedin.com/in/mohanram05',
      'https://github.com/Mohanram73',
      '/uploads/profile-photo.jpg'
    );
  }

  // Hero section
  const heroCheck = db.prepare('SELECT COUNT(*) as count FROM hero').get();
  if (heroCheck.count === 0) {
    db.prepare(`
      INSERT INTO hero (
        id, greeting, headline, subheadline, statement,
        cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link,
        background_style, overlay_opacity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      1,
      'Hello, I am',
      'MOHANRAM R',
      'Associate Web Developer | Full Stack Developer | Electronics & Embedded Systems',
      'Building responsive, high-performance digital experiences with modern web technologies, backed by an engineering mindset rooted in Electronics and Embedded Systems.',
      'View Projects',
      '#projects',
      'Download Resume',
      '#resume',
      'circuit',
      85
    );
  }

  // Experience: 4 genuine records
  const expCheck = db.prepare('SELECT COUNT(*) as count FROM experience').get();
  if (expCheck.count === 0) {
    // 1. VDart
    db.prepare(`
      INSERT INTO experience (
        company, position, employment_type, start_date, end_date,
        is_current, location, responsibilities, technologies, achievements, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'VDart',
      'Associate Web Developer',
      'Full-time',
      '03/2026',
      '08/2026',
      0,
      'Tiruchirappalli, Tamil Nadu-India',
      JSON.stringify([
        'Managed and maintained WordPress websites and web content, implementing business-driven content updates, landing pages, forms, page modifications, and UI enhancements.',
        'Developed and maintained responsive and adaptive web pages using HTML5, CSS3, and JavaScript across desktop, tablet, and mobile devices.',
        'Executed web content publishing and updates while following web standards, SEO best practices, content quality requirements, and business guidelines.',
        'Diagnosed and resolved website issues including broken links, content errors, formatting inconsistencies, responsive issues, UI defects, and form-related problems.',
        'Performed cross-browser and cross-device testing to validate website functionality, layout, responsiveness, compatibility, and user experience.',
        'Utilized Google Analytics and Google Search Console to monitor website traffic, search performance, indexing, and website visibility.',
        'Implemented SEO and AIEO improvements including metadata, heading structure, image optimization, internal linking, content optimization, and search performance improvements.',
        'Managed HubSpot forms, WPForms, SMTP, domains, DNS, SSL, hosting, and website availability as part of ongoing web maintenance and support.',
        'Used Chrome DevTools to inspect, debug, and troubleshoot HTML, CSS, JavaScript, and browser-specific UI issues.',
        'Collaborated with business stakeholders and internal teams to understand requirements, prioritize multiple content requests, troubleshoot issues, and deliver website updates within expected timelines.'
      ]),
      JSON.stringify([
        'WordPress', 'HTML5', 'CSS3', 'JavaScript', 'SEO', 'AIEO',
        'Google Analytics', 'Google Search Console', 'HubSpot Forms', 'WPForms', 'SMTP', 'DNS', 'SSL', 'Chrome DevTools'
      ]),
      JSON.stringify([
        'Deployed custom AI chatbot powered by Node.js and Gemini API to elevate visitor support on corporate web portal.',
        'Delivered continuous on-time website updates and resolved high-priority responsive UI and broken link defects.'
      ]),
      1
    );

    // 2. Cognifyz Technologies
    db.prepare(`
      INSERT INTO experience (
        company, position, employment_type, start_date, end_date,
        is_current, location, responsibilities, technologies, achievements, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Cognifyz Technologies',
      'Full Stack Developer Intern',
      'Internship',
      '01/2026',
      '02/2026',
      0,
      'Remote - India',
      JSON.stringify([
        'Developed reusable, modular UI components using React.js for enhanced frontend scalability.',
        'Built secure RESTful APIs and handled end-to-end data integration across client and server.',
        'Improved application performance, rendering efficiency, and state management.'
      ]),
      JSON.stringify(['React.js', 'JavaScript', 'RESTful APIs', 'Node.js', 'Frontend Optimization']),
      JSON.stringify([
        'Successfully authored modular component libraries adopted across the internal web dashboard.'
      ]),
      2
    );

    // 3. NoviTech R&D Pvt Ltd
    db.prepare(`
      INSERT INTO experience (
        company, position, employment_type, start_date, end_date,
        is_current, location, responsibilities, technologies, achievements, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'NoviTech R&D Pvt Ltd',
      'Intern – MERN Stack Development',
      'Internship',
      '07/2025',
      '10/2025',
      0,
      'Coimbatore, India',
      JSON.stringify([
        'Developed a full-stack e-commerce web application using MongoDB, Express.js, React.js, and Node.js.',
        'Implemented JWT (JSON Web Token) authentication and secured REST APIs for user management and order workflows.',
        'Improved responsive UI layouts and optimized database queries to enhance application throughput and user experience.'
      ]),
      JSON.stringify(['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'REST APIs', 'E-Commerce']),
      JSON.stringify([
        'Built full CRUD product and cart architecture with tokenized session management.'
      ]),
      3
    );

    // 4. Besant Technologies
    db.prepare(`
      INSERT INTO experience (
        company, position, employment_type, start_date, end_date,
        is_current, location, responsibilities, technologies, achievements, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Besant Technologies',
      'Full Stack Developer Training',
      'Training',
      '11/2023',
      '11/2024',
      0,
      'Chennai, India',
      JSON.stringify([
        'Trained comprehensively in frontend architectures: React.js, Angular, JavaScript (ES6+), HTML5, and CSS3.',
        'Mastered backend services and data persistence: Node.js, Core Java, Spring Boot, MySQL, and RESTful APIs.',
        'Built scalable, responsive, and user-friendly web applications following real-world software design patterns.',
        'Practiced Git/GitHub version control, Agile development methodologies, and continuous problem-solving.'
      ]),
      JSON.stringify(['React.js', 'Angular', 'Node.js', 'Core Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Git', 'Agile']),
      JSON.stringify([
        'Completed comprehensive hands-on full stack curriculum and built multiple real-time web applications.'
      ]),
      4
    );
  }

  // Skills
  const skillsCheck = db.prepare('SELECT COUNT(*) as count FROM skills').get();
  if (skillsCheck.count === 0) {
    const skillsData = [
      // Web Development
      { name: 'HTML5', category: 'Frontend', level: 'Professional', icon: 'Code', order: 1 },
      { name: 'CSS3', category: 'Frontend', level: 'Professional', icon: 'Palette', order: 2 },
      { name: 'JavaScript (ES6+)', category: 'Frontend', level: 'Professional', icon: 'FileCode', order: 3 },
      { name: 'Responsive Web Design', category: 'Frontend', level: 'Professional', icon: 'Layout', order: 4 },
      { name: 'Adaptive Web Design', category: 'Frontend', level: 'Professional', icon: 'Sliders', order: 5 },
      { name: 'React.js', category: 'Frontend', level: 'Strong', icon: 'Atom', order: 6 },
      { name: 'Angular Fundamentals', category: 'Frontend', level: 'Working Knowledge', icon: 'Layers', order: 7 },

      // Backend & APIs
      { name: 'Core Java', category: 'Backend', level: 'Strong', icon: 'Coffee', order: 8 },
      { name: 'Spring Boot', category: 'Backend', level: 'Strong', icon: 'Cpu', order: 9 },
      { name: 'Node.js & Express.js', category: 'Backend', level: 'Strong', icon: 'Server', order: 10 },
      { name: 'REST APIs', category: 'Backend', level: 'Professional', icon: 'Network', order: 11 },
      { name: 'PHP', category: 'Backend', level: 'Strong', icon: 'Server', order: 12 },

      // Database
      { name: 'MySQL', category: 'Database', level: 'Strong', icon: 'Database', order: 13 },
      { name: 'MongoDB', category: 'Database', level: 'Strong', icon: 'Database', order: 14 },

      // CMS & Content Management
      { name: 'WordPress CMS', category: 'CMS / Web Platforms', level: 'Professional', icon: 'Globe', order: 15 },
      { name: 'Web Content Management (WCM)', category: 'CMS / Web Platforms', level: 'Professional', icon: 'FolderKanban', order: 16 },
      { name: 'Landing Pages & Forms', category: 'CMS / Web Platforms', level: 'Professional', icon: 'Layout', order: 17 },
      { name: 'HubSpot Forms & WPForms', category: 'CMS / Web Platforms', level: 'Professional', icon: 'CheckSquare', order: 18 },

      // SEO & Analytics
      { name: 'Technical & On-Page SEO', category: 'Web / Marketing Technology', level: 'Professional', icon: 'Search', order: 19 },
      { name: 'AIEO (AI Engine Optimization)', category: 'Web / Marketing Technology', level: 'Strong', icon: 'Sparkles', order: 20 },
      { name: 'Google Analytics 4', category: 'Web / Marketing Technology', level: 'Professional', icon: 'BarChart2', order: 21 },
      { name: 'Google Search Console', category: 'Web / Marketing Technology', level: 'Professional', icon: 'TrendingUp', order: 22 },
      { name: 'UTM Tracking & Attribution', category: 'Web / Marketing Technology', level: 'Professional', icon: 'Tag', order: 23 },

      // UI/UX & Web Standards
      { name: 'UI/UX Principles', category: 'UI/UX & Web Standards', level: 'Strong', icon: 'Eye', order: 24 },
      { name: 'Cross-Browser & Device Testing', category: 'UI/UX & Web Standards', level: 'Professional', icon: 'Monitor', order: 25 },
      { name: 'W3C Web Standards & Accessibility', category: 'UI/UX & Web Standards', level: 'Strong', icon: 'Shield', order: 26 },

      // Testing & Troubleshooting
      { name: 'Website QA & Manual Testing', category: 'Testing', level: 'Professional', icon: 'CheckCircle', order: 27 },
      { name: 'Chrome DevTools Debugging', category: 'Testing', level: 'Professional', icon: 'Wrench', order: 28 },
      { name: 'Basic Selenium', category: 'Testing', level: 'Working Knowledge', icon: 'Sliders', order: 29 },
      { name: 'Bug & Broken Link Identification', category: 'Testing', level: 'Professional', icon: 'AlertCircle', order: 30 },

      // Electronics & Embedded
      { name: 'Embedded Systems', category: 'Electronics & Embedded', level: 'Strong', icon: 'CircuitBoard', order: 31 },
      { name: 'Microcontrollers & Sensors', category: 'Electronics & Embedded', level: 'Strong', icon: 'Cpu', order: 32 },
      { name: 'Embedded C', category: 'Electronics & Embedded', level: 'Strong', icon: 'Terminal', order: 33 },
      { name: 'PLC & Ladder Logic', category: 'Electronics & Embedded', level: 'Working Knowledge', icon: 'Activity', order: 34 },
      { name: 'Digital & Analog Electronics', category: 'Electronics & Embedded', level: 'Strong', icon: 'Binary', order: 35 },
      { name: 'Hardware Troubleshooting', category: 'Electronics & Embedded', level: 'Strong', icon: 'Hammer', order: 36 },

      // Tools & Infrastructure
      { name: 'Git & GitHub', category: 'Tools', level: 'Professional', icon: 'Github', order: 37 },
      { name: 'Postman', category: 'Tools', level: 'Professional', icon: 'Send', order: 38 },
      { name: 'cPanel / GoDaddy / Hosting', category: 'Tools', level: 'Strong', icon: 'Server', order: 39 },
      { name: 'DNS & SSL Management', category: 'Tools', level: 'Strong', icon: 'Lock', order: 40 },
      { name: 'PowerApps & Power Automate', category: 'Tools', level: 'Working Knowledge', icon: 'Workflow', order: 41 }
    ];

    const insertSkill = db.prepare(`
      INSERT INTO skills (name, category, proficiency_level, icon, order_idx)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const skill of skillsData) {
      insertSkill.run(skill.name, skill.category, skill.level, skill.icon, skill.order);
    }
  }

  // Projects: 7 real projects
  const projCheck = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  if (projCheck.count === 0) {
    // 1. VDart Corporate Website
    db.prepare(`
      INSERT INTO projects (
        title, slug, summary, category,
        problem, approach, architecture, tech_stack, features,
        challenges, solution, result, github_url, live_url, image_url,
        is_featured, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'VDart Corporate Website & AI Chatbot Integration',
      'vdart-corporate-website',
      'Enterprise WordPress platform featuring responsive web design, technical SEO audits, Google Analytics instrumentation, and an AI-powered conversational chatbot built with Node.js and Gemini API.',
      'Web',
      'Corporate website required continuous UI enhancements, high-availability maintenance, search visibility improvements, and an automated visitor engagement mechanism to resolve user inquiries around the clock.',
      'Managed end-to-end WordPress frontend development, conducted rigorous SEO and accessibility audits, configured UTM tracking campaigns, and integrated a custom Gemini AI chatbot service.',
      'Frontend: Responsive HTML5, CSS3, ES6+ JavaScript, WordPress Theme\nAI Chatbot: Node.js, Express, Google Gemini API\nAnalytics & Telemetry: Google Analytics 4, Google Search Console, UTM Tracking\nInfrastructure: WPForms, HubSpot Forms, SMTP, DNS, SSL',
      JSON.stringify(['WordPress', 'HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Gemini API', 'SEO', 'AIEO', 'Google Analytics', 'Search Console', 'HubSpot']),
      JSON.stringify([
        'AI-powered conversational chatbot using Node.js and Gemini API integrated into WordPress for automated visitor support',
        'Responsive and adaptive layouts across desktop, tablet, and mobile with cross-browser fidelity',
        'Comprehensive technical SEO & AIEO improvements (structured metadata, heading hierarchy, image optimization, internal linking)',
        'Google Analytics 4 & Search Console telemetry for indexing and visibility tracking',
        'HubSpot forms, WPForms, and SMTP relay integration with robust validation'
      ]),
      'Integrating a real-time Gemini AI conversational agent seamlessly within existing WordPress architecture without affecting page performance or load times.',
      'Constructed a lightweight asynchronous Node.js microservice communicating with Gemini API via streaming REST endpoints, embedded via a performant non-blocking frontend widget.',
      'Elevated website accessibility and search visibility, delivered on-time business updates, and established 24/7 automated AI visitor support.',
      'https://github.com/Mohanram73',
      'https://vdart.dimiour.io/',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      1,
      1
    );

    // 2. CT Lung Image Enhancement & Segmentation
    db.prepare(`
      INSERT INTO projects (
        title, slug, summary, category,
        problem, approach, architecture, tech_stack, features,
        challenges, solution, result, github_url, live_url, image_url,
        is_featured, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'CT Lung Image Enhancement & Segmentation Using Pythagorean Fuzzy Set',
      'ct-lung-image-segmentation',
      'Medical digital image processing algorithm that enhances contrast and segments lung CT scans using mathematical Pythagorean fuzzy set theory for superior clinical accuracy.',
      'Electronics & Embedded',
      'Low contrast, ambient noise, and ambiguous boundaries in CT lung scans hinder precise segmentation of pulmonary regions and pathological nodules.',
      'Designed and implemented a mathematical image enhancement framework applying Pythagorean fuzzy set membership and non-membership functions to enhance subtle textural boundaries and segment tissue regions with high fidelity.',
      'Mathematical Model: Pythagorean Fuzzy Set (PFS) Theory\nProcessing: Digital Signal & Image Processing Algorithms\nAnalysis: Matrix Image Operations & Boundary Thresholding',
      JSON.stringify(['Digital Image Processing', 'Pythagorean Fuzzy Sets', 'Signal Processing', 'Data Interpretation', 'Technical Problem Solving']),
      JSON.stringify([
        'Mathematical contrast enhancement tailored for pulmonary CT scan radiograms',
        'Pythagorean fuzzy membership modeling handling boundary vagueness and grayscale uncertainty',
        'Accurate automated lung parenchyma segmentation',
        'Handling digital signals and high-resolution medical image datasets'
      ]),
      'Overcoming ambiguous voxel boundaries between healthy lung tissue and lesion artifacts in low-contrast scans.',
      'Formulated membership, non-membership, and hesitancy degrees under Pythagorean fuzzy constraints, effectively expanding the contrast spectrum across edge gradients.',
      'Delivered sharper boundary delineation, improved segmentation accuracy, and demonstrated advanced mathematical signal-processing capabilities.',
      'https://github.com/Mohanram73',
      '',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      1,
      2
    );

    // 3. Easy Transfer Application
    db.prepare(`
      INSERT INTO projects (
        title, slug, summary, category,
        problem, approach, architecture, tech_stack, features,
        challenges, solution, result, github_url, live_url, image_url,
        is_featured, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Easy Transfer Application — Secure Banking & Funds Transfer Engine',
      'easy-transfer-application',
      'Robust financial funds transfer system built with Core Java and JDBC, delivering atomic transaction validation, structured exception handling, and MySQL relational integrity.',
      'Backend',
      'Financial transfer workflows require absolute consistency, preventing balance anomalies or partial debit/credit executions during network interruptions.',
      'Engineered an Object-Oriented Java application leveraging JDBC with explicit transaction management (`commit`/`rollback`), parameterized queries to eliminate SQL injection, and structured exception propagation.',
      'Application Layer: Core Java (OOP, Multi-tier structure)\nPersistence: JDBC (Java Database Connectivity)\nDatabase: MySQL with ACID Transaction Support\nVersion Control: Git / GitHub',
      JSON.stringify(['Core Java', 'JDBC', 'MySQL', 'OOP', 'SQL Optimization', 'Git']),
      JSON.stringify([
        'Secure account-to-account funds transfer with atomic debit and credit operations',
        'Comprehensive transaction input validation and balance checks prior to execution',
        'Structured exception handling preventing system crashes during database disconnections',
        'Optimized SQL queries guaranteeing referential and financial integrity'
      ]),
      'Guaranteeing that neither the sender nor receiver balances could be desynchronized if a database failure occurs mid-transaction.',
      'Implemented explicit JDBC transaction boundaries (`connection.setAutoCommit(false)`) with rollback routines in `catch` blocks.',
      'Zero balance discrepancy across extensive test execution cycles and sub-20ms transaction execution times.',
      'https://github.com/Mohanram73',
      '',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      1,
      3
    );

    // 4. Sensor-Based Water Level Monitoring System
    db.prepare(`
      INSERT INTO projects (
        title, slug, summary, category,
        problem, approach, architecture, tech_stack, features,
        challenges, solution, result, github_url, live_url, image_url,
        is_featured, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Sensor-Based Water Level Monitoring & Automated Pump Control',
      'sensor-water-level-monitoring',
      'Automated hardware monitoring system utilizing microcontrollers and water level sensors programmed in Embedded C to achieve autonomous pump control.',
      'Electronics & Embedded',
      'Water overflow in storage tanks and dry-run damage to electric pumps cause substantial resource waste and mechanical motor failure in residential and agricultural setups.',
      'Designed an embedded electronic circuit pairing multi-level conductivity sensors with a microcontroller programmed in Embedded C to automate relay switching based on real-time liquid threshold levels.',
      'Hardware: Microcontroller Unit (MCU), Level Sensors, Relay Driver Circuit\nProgramming: Embedded C\nPower & Actuation: 12V/230V Relay Module, Water Pump Interlock',
      JSON.stringify(['Sensors', 'Microcontrollers', 'Embedded C', 'Digital Electronics', 'Hardware Troubleshooting']),
      JSON.stringify([
        'Real-time continuous water level telemetry across discrete thresholds',
        'Automatic pump ON when level falls below minimum reserve threshold',
        'Automatic pump OFF with dry-run protection and overflow cut-off',
        'Rigorous hardware troubleshooting ensuring anti-corrosion sensor longevity'
      ]),
      'Preventing relay chatter and erratic motor switching caused by surface water ripples and electrical sensor noise.',
      'Implemented software debounce algorithms and hysteresis threshold windows in Embedded C, stabilizing relay triggers.',
      '100% reliable pump automation with zero water overflow across extended operating tests.',
      'https://github.com/Mohanram73',
      '',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      1,
      4
    );

    // 5. PLC-Based Motor Control System
    db.prepare(`
      INSERT INTO projects (
        title, slug, summary, category,
        problem, approach, architecture, tech_stack, features,
        challenges, solution, result, github_url, live_url, image_url,
        is_featured, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'PLC-Based Industrial Motor Control & Interlock System',
      'plc-based-motor-control',
      'Industrial automation control system designed using Programmable Logic Controller (PLC) ladder logic with sensor-based safety interlocks and fault detection.',
      'Electronics & Embedded',
      'Industrial electric motors require robust automated start/stop cycling with thermal overload safeguards and immediate emergency shutoff interlocks to ensure workplace safety.',
      'Developed and simulated a complete PLC ladder logic program incorporating sensor inputs, push-button commands, emergency stops, and sequential interlocks for automated industrial operations.',
      'Controller: Programmable Logic Controller (PLC)\nLogic Language: Ladder Logic (LD)\nSensors: Proximity, Thermal Overload, Emergency Stop Interlocks',
      JSON.stringify(['PLC', 'Ladder Logic', 'Sensors', 'Industrial Automation', 'Troubleshooting Logic']),
      JSON.stringify([
        'Automated motor start/stop sequencing with holding contact latching logic',
        'Sensor-based input signals for safety interlock and real-time fault detection',
        'Emergency stop override logic taking precedence over all operating states',
        'Simulated automation logic mimicking industrial factory workflows'
      ]),
      'Ensuring fail-safe operation where any sensor fault or wiring severance instantly de-energizes the motor.',
      'Structured the ladder rungs with normally-closed (NC) safety loops, guaranteeing immediate emergency shutdown upon signal loss.',
      'Verified zero-defect operation across multi-cycle industrial simulation scenarios.',
      'https://github.com/Mohanram73',
      '',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      0,
      5
    );

    // 6. Restaurant Website
    db.prepare(`
      INSERT INTO projects (
        title, slug, summary, category,
        problem, approach, architecture, tech_stack, features,
        challenges, solution, result, github_url, live_url, image_url,
        is_featured, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Modern Interactive Restaurant Web Application',
      'restaurant-website',
      'Responsive culinary web platform featuring intuitive menu navigation, interactive reservation sections, and mobile-optimized layouts built with HTML5, CSS3, and JavaScript.',
      'Web',
      'Local restaurants lose mobile diners when web pages are slow to load, non-responsive, or have confusing digital menus.',
      'Crafted a lightweight, accessible restaurant website emphasizing high-contrast food imagery, fluid typography, interactive category filters, and fast first paint.',
      'Frontend: Semantic HTML5, Modular CSS3 Grid/Flexbox, Vanilla JavaScript ES6+',
      JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design', 'UI/UX']),
      JSON.stringify([
        'Responsive layout engineered seamlessly across mobile, tablet, and wide screens',
        'Interactive menu filtering by category (Appetizers, Mains, Desserts, Beverages)',
        'Table reservation inquiry form with real-time field validation',
        'Clean typography and optimized asset loading for rapid page paint'
      ]),
      'Delivering rich visual imagery while maintaining high performance on low-bandwidth mobile connections.',
      'Applied CSS modern image compression and native browser lazy-loading attributes.',
      'Smooth 60fps animations, intuitive user experience, and mobile-friendly usability.',
      'https://github.com/Mohanram73',
      '',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      0,
      6
    );

    // 7. Business Process Automation App
    db.prepare(`
      INSERT INTO projects (
        title, slug, summary, category,
        problem, approach, architecture, tech_stack, features,
        challenges, solution, result, github_url, live_url, image_url,
        is_featured, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Business Process Automation App — Leave Management System',
      'business-process-automation-app',
      'Enterprise workflow automation solution built with Microsoft PowerApps (Canvas), Power Automate, and SharePoint List, streamlining leave requests and managerial email approvals.',
      'Web',
      'Manual, paper-based, or unstructured email leave requests cause approval delays, lack of audit trails, and human recordkeeping errors.',
      'Developed a custom PowerApps Canvas application interfacing with a structured SharePoint List repository, coupled with automated multi-stage Power Automate approval flows.',
      'Frontend: Microsoft PowerApps (Canvas App)\nWorkflow Engine: Microsoft Power Automate\nBackend Data Source: Microsoft SharePoint Online List',
      JSON.stringify(['PowerApps', 'Power Automate', 'SharePoint', 'Process Automation', 'Business Workflows']),
      JSON.stringify([
        'Intuitive leave request submission with date picker validation and balance checks',
        'SharePoint List integrated as a secure, structured backend data store',
        'Automated Power Automate approval workflow triggering notifications to managers',
        'Real-time status tracking dashboard displaying Pending, Approved, and Rejected requests'
      ]),
      'Handling multi-tier managerial approval routing and preventing duplicate requests during pending periods.',
      'Engineered conditional branching rules in Power Automate and dynamic disabled states on the PowerApps canvas.',
      'Reduced leave turnaround processing time by 80% while establishing a 100% digital audit trail.',
      'https://github.com/Mohanram73',
      '',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      0,
      7
    );
  }

  // Education
  const eduCheck = db.prepare('SELECT COUNT(*) as count FROM education').get();
  if (eduCheck.count === 0) {
    db.prepare(`
      INSERT INTO education (
        degree, institution, field_of_study, start_year, end_year, grade, details, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Bachelor of Engineering (B.E.)',
      'K Ramakrishnan College of Engineering',
      'Electronics and Communication Engineering',
      '2019',
      '2023',
      'CGPA: 7.56 (First Class)',
      'Coursework: Digital Electronics, Microprocessors & Microcontrollers, Analog Circuits, Communication Systems, Signal Processing, Computer Networks, and Object-Oriented Programming. Capstone project in Medical Digital Image Processing.',
      1
    );

    db.prepare(`
      INSERT INTO education (
        degree, institution, field_of_study, start_year, end_year, grade, details, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Higher Secondary Education (HSC)',
      'Best Matriculation Higher Secondary School',
      'Computer Science & Mathematics',
      '2017',
      '2019',
      'Completed',
      'Foundational education in Physics, Chemistry, Mathematics, and Computer Science fundamentals.',
      2
    );
  }

  // Certifications & Courses
  const certCheck = db.prepare('SELECT COUNT(*) as count FROM certifications').get();
  if (certCheck.count === 0) {
    db.prepare(`
      INSERT INTO certifications (
        title, issuer, issue_date, credential_url, credential_id, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'TCS NQT (National Qualifier Test) — Score: 70%',
      'Tata Consultancy Services (TCS)',
      '2023',
      '',
      'TCS-NQT-70PCT',
      1
    );

    db.prepare(`
      INSERT INTO certifications (
        title, issuer, issue_date, credential_url, credential_id, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'Java Full Stack Developer',
      'Besant Technologies',
      '11/2023 – 11/2024',
      '',
      'BESANT-JAVA-FS',
      2
    );

    db.prepare(`
      INSERT INTO certifications (
        title, issuer, issue_date, credential_url, credential_id, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'Embedded Systems Training',
      'National Institute of Electronics & Information Technology (NIELIT)',
      '2023',
      '',
      'NIELIT-EMB-SYS',
      3
    );

    db.prepare(`
      INSERT INTO certifications (
        title, issuer, issue_date, credential_url, credential_id, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'Build a Free Website with WordPress Project',
      'Coursera',
      '2024',
      '',
      'COURSERA-WP-PROJ',
      4
    );

    db.prepare(`
      INSERT INTO certifications (
        title, issuer, issue_date, credential_url, credential_id, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'CSS (Basic) Certificate',
      'HackerRank',
      '2024',
      '',
      'HACKERRANK-CSS-BASIC',
      5
    );

    db.prepare(`
      INSERT INTO certifications (
        title, issuer, issue_date, credential_url, credential_id, order_idx
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'Computer Vision App (Azure)',
      'Microsoft',
      '2023',
      '',
      'MSFT-AZURE-CV',
      6
    );
  }

  // Presentations
  const presCheck = db.prepare('SELECT COUNT(*) as count FROM presentations').get();
  if (presCheck.count === 0) {
    db.prepare(`
      INSERT INTO presentations (title, venue, type, details, order_idx)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'Blockchain Technology',
      'K Ramakrishnan College of Engineering (KRCE)',
      'Paper Presentation',
      'Delivered presentation analyzing decentralized ledger architecture, cryptographic hashing, and smart contract consensus mechanisms.',
      1
    );

    db.prepare(`
      INSERT INTO presentations (title, venue, type, details, order_idx)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'Biological Amplifiers',
      'K Ramakrishnan College of Engineering (KRCE)',
      'Paper Presentation',
      'Presented technical research on bio-potential amplification circuits (ECG/EEG instrumentation amplifiers) and signal-to-noise optimization.',
      2
    );

    db.prepare(`
      INSERT INTO presentations (title, venue, type, details, order_idx)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'Machine Learning for Remote Sensing Applications',
      'National Seminar',
      'Seminar Participation',
      'Attended national seminar on satellite image classification, spectral analysis, and ML feature extraction.',
      3
    );

    db.prepare(`
      INSERT INTO presentations (title, venue, type, details, order_idx)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'SUITS IT Program',
      'Bharathidasan University, Trichy',
      'Co-Curricular IT Program',
      'Participated in university-level IT skill development and computer applications program.',
      4
    );
  }

  // Settings
  const settingsCheck = db.prepare('SELECT COUNT(*) as count FROM settings').get();
  if (settingsCheck.count === 0) {
    const defaultSettings = [
      ['theme_mode', 'dark'],
      ['primary_color', '#0ea5e9'],
      ['accent_color', '#14b8a6'],
      ['hero_background', 'circuit'],
      ['overlay_opacity', '85'],
      ['visitor_notifications_enabled', 'false'],
      ['notification_frequency', 'instant'],
      ['admin_notification_email', 'mohitmohanram2001@gmail.com'],
      ['smtp_host', 'smtp.gmail.com'],
      ['smtp_port', '587'],
      ['smtp_user', ''],
      ['smtp_pass', ''],
      ['smtp_secure', 'false'],
      ['seo_meta_title', 'MOHANRAM R | Associate Web Developer & Full Stack Engineer'],
      ['seo_meta_description', 'Official portfolio of Mohanram R - Associate Web Developer at VDart, Full Stack Developer, and Electronics & Embedded Systems Engineer. Specializing in WordPress, React, Core Java, SEO, and Hardware-Software integration.'],
      ['seo_keywords', 'Mohanram R, Associate Web Developer, VDart, Full Stack Developer, React.js, WordPress Developer, Core Java, Embedded Systems, Mayiladuthurai, Trichy, Portfolio'],
      ['seo_og_image', '/uploads/og-banner.jpg'],
      ['seo_canonical_url', 'https://mohanram.dev']
    ];

    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    for (const [k, v] of defaultSettings) {
      insertSetting.run(k, v);
    }
  }

  // Resume file record
  const resumeCheck = db.prepare('SELECT COUNT(*) as count FROM resume_files').get();
  if (resumeCheck.count === 0) {
    db.prepare(`
      INSERT INTO resume_files (
        filename, original_name, version, file_size, is_current
      ) VALUES (?, ?, ?, ?, ?)
    `).run(
      'Mohanram_R_Full_Stack_Engineer_Resume.pdf',
      'Mohanram_R_Resume.pdf',
      'v1.2.0',
      124800,
      1
    );
  }
}

initDatabase();

module.exports = db;
