const db = require('./db');

console.log('--- Synchronizing Authentic Resume Details into Database ---');

// 1. Update Profile
db.prepare(`
  UPDATE profile SET
    full_name = ?,
    title = ?,
    tagline = ?,
    bio_intro = ?,
    bio_engineering = ?,
    bio_software = ?,
    bio_philosophy = ?,
    location = ?,
    email = ?,
    phone = ?,
    linkedin = ?,
    github = ?,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = 1
`).run(
  'MOHANRAM R',
  'Associate Web Developer | Full Stack Developer | Electronics & Embedded Systems',
  'Building responsive, high-performance digital experiences with modern web technologies and full stack frameworks, while bringing an engineering mindset rooted in Electronics and Embedded Systems.',
  'I am an Associate Web Developer and Software Engineer with an engineering degree in Electronics and Communication from K Ramakrishnan College of Engineering. I specialize in building responsive, accessible, high-performance web applications, managing enterprise CMS platforms, and engineering full-stack solutions.',
  'With an academic foundation in Electronics & Communication Engineering (CGPA: 7.56), I bring rigorous systems thinking, hardware-software integration knowledge, microcontroller familiarity (Embedded C), and industrial automation concepts (PLC ladder logic) to complex technical challenges.',
  'Professionally, I manage enterprise web properties at VDart, delivering custom WordPress frontend solutions, responsive web layouts (HTML5/CSS3/JavaScript), technical SEO and AIEO optimizations, GA4 analytics instrumentation, and AI chatbot integrations using Node.js and the Gemini API.',
  'My technical versatility spans React.js, Node.js, Core Java, Spring Boot, RESTful APIs, MySQL, and MongoDB. I focus on clean code, web accessibility standards, cross-browser compatibility, and measurable business impact.',
  'Mayiladuthurai, Tamil Nadu, India',
  'mohitmohanram2001@gmail.com',
  '+91-6382549825',
  'https://www.linkedin.com/in/mohanram05',
  'https://github.com/Mohanram73'
);
console.log('✅ Profile updated with authentic contact and bio details');

// 2. Update Hero
db.prepare(`
  UPDATE hero SET
    headline = ?,
    subheadline = ?,
    statement = ?,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = 1
`).run(
  'MOHANRAM R',
  'Associate Web Developer | Full Stack Developer | Electronics & Embedded Systems',
  'Building responsive, high-performance digital experiences with modern web technologies, backed by an engineering mindset rooted in Electronics and Embedded Systems.'
);
console.log('✅ Hero section updated');

// 3. Update Experience: 4 genuine milestones
db.prepare('DELETE FROM experience').run();

const insertExp = db.prepare(`
  INSERT INTO experience (
    company, position, employment_type, start_date, end_date,
    is_current, location, responsibilities, technologies, achievements, order_idx
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// 1. VDart
insertExp.run(
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
    'Implemented an AI-powered chatbot using Node.js and Gemini API integrated with WordPress for live visitor support.',
    'Conducted website audits eliminating broken links, heading structure issues, and optimizing Core Web Vitals.'
  ]),
  1
);

// 2. Cognifyz Technologies
insertExp.run(
  'Cognifyz Technologies',
  'Full Stack Developer Intern',
  'Internship',
  '01/2026',
  '02/2026',
  0,
  'Remote - India',
  JSON.stringify([
    'Developed reusable UI components using React.js.',
    'Built RESTful APIs and handled data integration.',
    'Improved application performance and efficiency.'
  ]),
  JSON.stringify(['React.js', 'JavaScript', 'REST APIs', 'Node.js', 'Performance Optimization']),
  JSON.stringify([
    'Engineered reusable frontend components improving overall dashboard loading speed.'
  ]),
  2
);

// 3. NoviTech R&D Pvt Ltd
insertExp.run(
  'NoviTech R&D Pvt Ltd',
  'Intern – MERN Stack Development',
  'Internship',
  '07/2025',
  '10/2025',
  0,
  'Coimbatore-India',
  JSON.stringify([
    'Developed a full-stack e-commerce application using MongoDB, Express.js, React.js, and Node.js.',
    'Implemented JWT authentication and REST APIs for secure user management and application functionality.',
    'Improved responsive UI and optimized database queries to enhance application performance and user experience.'
  ]),
  JSON.stringify(['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'REST APIs']),
  JSON.stringify([
    'Built complete authentication and e-commerce shopping cart workflow with optimized MongoDB indexing.'
  ]),
  3
);

// 4. Besant Technologies
insertExp.run(
  'Besant Technologies',
  'Full Stack Developer Training',
  'Training',
  '11/2023',
  '11/2024',
  0,
  'Chennai',
  JSON.stringify([
    'Learned frontend technologies: React.js, Angular JavaScript, HTML5, CSS3.',
    'Learned backend technologies: Node.js, Core Java, Spring Boot, MySQL, RESTful APIs.',
    'Built scalable, responsive, and user-friendly web applications.',
    'Practiced Git/GitHub, Agile methodology, and real-time project development.'
  ]),
  JSON.stringify(['React.js', 'Angular', 'Node.js', 'Core Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Git', 'Agile']),
  JSON.stringify([
    'Completed intensive year-long Full Stack Developer certification and delivered multiple web applications.'
  ]),
  4
);
console.log('✅ Experience table updated (4 genuine milestones)');

// 4. Update Projects: 7 real projects
db.prepare('DELETE FROM projects').run();

const insertProj = db.prepare(`
  INSERT INTO projects (
    title, slug, summary, category,
    problem, approach, architecture, tech_stack, features,
    challenges, solution, result, github_url, live_url, image_url,
    is_featured, order_idx
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// 1. VDart Corporate Website
insertProj.run(
  'VDart Corporate Website & Gemini AI Chatbot Integration',
  'vdart-corporate-website',
  'Live enterprise WordPress platform featuring responsive web design, accessibility & technical SEO audits, Google Analytics instrumentation, and an AI-powered conversational chatbot built with Node.js and Gemini API.',
  'Web',
  'Corporate website required continuous UI enhancements, high-availability maintenance, search visibility improvements, and an automated visitor engagement mechanism to resolve user inquiries around the clock.',
  'Managed WordPress website content, page layouts, navigation, forms, landing pages, and responsive UI updates. Conducted audits for SEO, accessibility, broken links, heading structure, metadata, and web performance. Implemented an AI-powered chatbot using Node.js and Gemini API.',
  'Frontend: Responsive HTML5, CSS3, ES6+ JavaScript, WordPress Custom Theme\nAI Chatbot: Node.js, Express, Google Gemini API\nAnalytics & Telemetry: Google Analytics, Google Search Console, UTM Tracking\nInfrastructure: HubSpot Forms, WPForms, SMTP, Domains, DNS, SSL, Hosting',
  JSON.stringify(['WordPress', 'HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Gemini API', 'SEO', 'AIEO', 'Google Analytics', 'Search Console', 'HubSpot Forms']),
  JSON.stringify([
    'Live Website: https://vdart.dimiour.io/',
    'Implemented an AI-powered chatbot using Node.js and Gemini API, integrated with WordPress to improve website visitor support',
    'Conducted website audits to identify SEO, accessibility, broken links, heading structure, metadata, image alt-text, and web performance issues',
    'Utilized Google Search Console, Google Analytics, UTM tracking, and SEO tools to monitor website traffic, search visibility, and indexing',
    'Performed cross-browser, cross-device, and responsive testing and resolved HTML, CSS, and JavaScript issues using Chrome DevTools',
    'Managed HubSpot forms, WPForms, SMTP, domains, DNS, SSL, hosting, and website availability'
  ]),
  'Integrating a real-time Gemini AI conversational agent seamlessly within existing WordPress architecture without affecting page performance or load times.',
  'Constructed a lightweight asynchronous Node.js microservice communicating with Gemini API via streaming REST endpoints, embedded via a performant non-blocking frontend widget.',
  'Live production platform serving enterprise visitors with continuous uptime and automated 24/7 AI-powered support.',
  'https://github.com/Mohanram73',
  'https://vdart.dimiour.io/',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  1,
  1
);

// 2. CT Lung Image Enhancement
insertProj.run(
  'CT Lung Image Enhancement & Segmentation Using Pythagorean Fuzzy Set',
  'ct-lung-image-enhancement',
  'Digital medical image processing model designed to enhance contrast and segment pulmonary CT scans using mathematical Pythagorean fuzzy set theory for accurate diagnostic interpretation.',
  'Electronics & Embedded',
  'Low contrast, ambient noise, and ambiguous edge gradients in pulmonary CT scans hinder accurate segmentation of lung parenchyma and subtle pathological tissues.',
  'Developed an image processing model to enhance and segment CT scan images using Pythagorean fuzzy set membership and non-membership functions to improve diagnostic contrast.',
  'Methodology: Pythagorean Fuzzy Set (PFS) Mathematical Framework\nDomain: Digital Signal & Image Processing\nData: CT Scan Image Datasets & Boundary Matrices',
  JSON.stringify(['Digital Image Processing', 'Pythagorean Fuzzy Sets', 'Signal Processing', 'Data Analysis', 'Problem Solving']),
  JSON.stringify([
    'Developed an image processing model to enhance and segment CT scan images',
    'Applied algorithm-based data analysis for improving accuracy',
    'Worked on handling digital signals and image datasets',
    'Gained experience in data interpretation and technical problem-solving'
  ]),
  'Overcoming ambiguous voxel boundaries and noise artifacts between healthy tissue and lesion boundaries in low-contrast scans.',
  'Formulated membership, non-membership, and hesitancy degrees under Pythagorean fuzzy constraints, effectively expanding the contrast spectrum across edge gradients.',
  'Significantly improved tissue boundary delineation and automated segmentation accuracy for clinical analysis.',
  'https://github.com/Mohanram73',
  '',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  1,
  2
);

// 3. Easy Transfer Application
insertProj.run(
  'Easy Transfer Application — Secure Funds Transfer System',
  'easy-transfer-application',
  'Secure fund transfer system built using Core Java, JDBC, and MySQL with robust transaction validation, structured exception handling, and modular OOP architecture.',
  'Backend',
  'Financial fund transfers require absolute transactional consistency, preventing partial debit/credit executions and ensuring data integrity under unexpected database disconnects.',
  'Developed a secure fund transfer system using Core Java and JDBC. Implemented transaction validation, structured exception handling, modular architecture, and optimized SQL queries.',
  'Language: Core Java (OOP Principles)\nConnectivity: JDBC (Java Database Connectivity)\nDatabase: MySQL with ACID Transaction Management\nVersion Control: Git / GitHub',
  JSON.stringify(['Core Java', 'JDBC', 'MySQL', 'OOP', 'SQL', 'Git']),
  JSON.stringify([
    'Developed a secure fund transfer system using Core Java and JDBC',
    'Implemented transaction validation, structured exception handling, and modular architecture',
    'Optimized SQL queries and ensured data integrity with MySQL',
    'Prevented SQL injection vulnerabilities through parameterized statements'
  ]),
  'Guaranteeing atomic transactions so neither sender nor receiver balances could be desynchronized during mid-operation failure.',
  'Applied explicit JDBC transaction boundaries (`setAutoCommit(false)`) with rollback routines in exception handling blocks.',
  'Verified 100% data consistency across multi-account concurrent transfer simulations.',
  'https://github.com/Mohanram73',
  '',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
  1,
  3
);

// 4. Sensor-Based Water Level Monitoring System
insertProj.run(
  'Sensor-Based Water Level Monitoring System',
  'sensor-water-level-monitoring',
  'Automated embedded monitoring system using microcontrollers and water level sensors programmed in Embedded C for real-time liquid monitoring and automated pump control.',
  'Electronics & Embedded',
  'Water overflow in storage tanks and dry-run damage to electric pumps cause substantial resource waste and mechanical motor failure.',
  'Designed and developed an automated water level monitoring system using a microcontroller and water level sensors. Programmed the controller using Embedded C for real-time monitoring and pump control.',
  'Hardware: Microcontroller Unit (MCU), Water Level Sensors, Relay Module\nProgramming: Embedded C\nTesting: Circuit Simulation & Hardware Troubleshooting',
  JSON.stringify(['Sensors', 'Microcontroller', 'Embedded C', 'Digital Electronics', 'Hardware Troubleshooting']),
  JSON.stringify([
    'Designed and developed an automated water level monitoring system using a microcontroller and water level sensors',
    'Programmed the controller using Embedded C for real-time monitoring and pump control',
    'Implemented automatic pump ON/OFF functionality based on predefined water levels',
    'Performed testing and troubleshooting to ensure reliable operation'
  ]),
  'Preventing sensor corrosion and erratic relay switching caused by surface ripples.',
  'Engineered software hysteresis timing thresholds in Embedded C and selected corrosion-resistant sensing probes.',
  'Achieved autonomous pump automation with zero water overflow and reliable motor protection.',
  'https://github.com/Mohanram73',
  '',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  1,
  4
);

// 5. PLC-Based Motor Control System
insertProj.run(
  'PLC-Based Industrial Motor Control System',
  'plc-based-motor-control',
  'Industrial automation motor start/stop control system designed using PLC ladder logic programming with sensor-based safety interlocks and fault detection.',
  'Electronics & Embedded',
  'Industrial electric motors require automated start/stop cycling with thermal overload safeguards and immediate emergency shutoff interlocks to ensure workplace safety.',
  'Designed PLC ladder logic program for automated motor start/stop control system. Implemented sensor-based input signals for safety interlock and fault detection.',
  'Controller: Programmable Logic Controller (PLC)\nProgramming: Ladder Logic (LD)\nComponents: Industrial Sensors, Safety Interlocks, Pushbuttons, Contactor Relays',
  JSON.stringify(['PLC', 'Ladder Logic', 'Sensors', 'Industrial Automation', 'Troubleshooting Logic']),
  JSON.stringify([
    'Designed PLC ladder logic program for automated motor start/stop control system',
    'Implemented sensor-based input signals for safety interlock and fault detection',
    'Simulated automation logic for industrial motor control operations',
    'Demonstrated understanding of industrial automation workflow and troubleshooting logic'
  ]),
  'Ensuring fail-safe operation where any sensor fault or wiring severance instantly de-energizes the motor.',
  'Structured the ladder rungs with normally-closed (NC) safety loops, guaranteeing immediate emergency shutdown upon signal loss.',
  'Verified zero-defect operation across simulated industrial automation workflows.',
  'https://github.com/Mohanram73',
  '',
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
  0,
  5
);

// 6. Restaurant Website
insertProj.run(
  'Responsive Restaurant Website',
  'restaurant-website',
  'Responsive culinary web platform with user-friendly interactive UI, dynamic menu presentation, and layout optimization built with HTML5, CSS3, and JavaScript.',
  'Web',
  'Culinary establishments require an intuitive, mobile-optimized digital presence to showcase dining menus and facilitate customer inquiries.',
  'Developed a responsive restaurant website with user-friendly UI. Implemented interactive features using JavaScript. Optimized layout for better performance and user experience.',
  'Frontend: HTML5, CSS3, JavaScript (ES6+)\nDesign: Responsive Web Design, Mobile Optimization',
  JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design', 'UI/UX']),
  JSON.stringify([
    'Developed a responsive restaurant website with user-friendly UI',
    'Implemented interactive features using JavaScript',
    'Optimized layout for better performance and user experience',
    'Clean, cross-browser compatible markup following modern web standards'
  ]),
  'Ensuring fluid responsiveness across diverse mobile viewport widths without layout shifting.',
  'Employed modern CSS Flexbox and Grid layouts with media queries and responsive image sizing.',
  'Delivered an interactive, performant web experience with high user satisfaction.',
  'https://github.com/Mohanram73',
  '',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  0,
  6
);

// 7. Business Process Automation App
insertProj.run(
  'Business Process Automation App — Leave Management System',
  'business-process-automation-app',
  'Enterprise workflow automation solution built with Microsoft PowerApps (Canvas), Power Automate, and SharePoint List, streamlining leave requests and managerial email approvals.',
  'Web',
  'Unstructured or manual leave requests cause tracking delays, administrative overhead, and lack of automated notifications.',
  'Designed and developed a Leave Management System using PowerApps Canvas. Connected SharePoint List as backend data source. Created approval workflow using Power Automate for automated email notifications. Implemented validation rules and status tracking dashboard for users.',
  'Platform: Microsoft PowerApps (Canvas App)\nWorkflow Automation: Microsoft Power Automate\nBackend Data Source: Microsoft SharePoint List',
  JSON.stringify(['PowerApps', 'Power Automate', 'SharePoint', 'Process Automation', 'Business Workflows']),
  JSON.stringify([
    'Designed and developed a Leave Management System using PowerApps Canvas',
    'Connected SharePoint List as backend data source',
    'Created approval workflow using Power Automate for automated email notifications',
    'Implemented validation rules and status tracking dashboard for users'
  ]),
  'Configuring conditional managerial approval branching and dynamic status tracking.',
  'Built multi-stage Power Automate cloud flows with instant status updates in SharePoint.',
  'Transformed manual leave requests into an automated, transparent, digital process.',
  'https://github.com/Mohanram73',
  '',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  0,
  7
);
console.log('✅ Projects table updated (7 authentic projects)');

// 5. Update Education: Real college and school
db.prepare('DELETE FROM education').run();
const insertEdu = db.prepare(`
  INSERT INTO education (
    degree, institution, field_of_study, start_year, end_year, grade, details, order_idx
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertEdu.run(
  'B.E. – Electronics and Communication Engineering',
  'K Ramakrishnan College of Engineering',
  'Electronics and Communication Engineering',
  '2019',
  '2023',
  'CGPA: 7.56',
  'Graduated with First Class honors. Comprehensive coursework in Digital Electronics, Microprocessors & Microcontrollers, Analog Circuits, Communication Systems, Digital Signal Processing, and Medical Image Processing.',
  1
);

insertEdu.run(
  'Higher Secondary Education',
  'Best Matriculation Higher Secondary School',
  'Computer Science & Mathematics',
  '2017',
  '2019',
  'Completed',
  'Sirkazhi, Tamil Nadu. Foundation in Mathematics, Physics, Chemistry, and Computer Science.',
  2
);
console.log('✅ Education table updated (K Ramakrishnan College of Engineering & Best Matriculation)');

// 6. Update Certifications: Real 6 certifications
db.prepare('DELETE FROM certifications').run();
const insertCert = db.prepare(`
  INSERT INTO certifications (title, issuer, issue_date, credential_url, credential_id, order_idx)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertCert.run(
  'TCS NQT (National Qualifier Test) — Score: 70%',
  'Tata Consultancy Services',
  '2023',
  '',
  'TCS-NQT-70PCT',
  1
);

insertCert.run(
  'Java Full Stack Developer Course',
  'Besant Technologies',
  '11/2023 – 11/2024',
  '',
  'BESANT-JAVA-FS',
  2
);

insertCert.run(
  'Embedded Systems Training',
  'National Institute of Electronics & Information Technology (NIELIT)',
  '2023',
  '',
  'NIELIT-EMB-SYS',
  3
);

insertCert.run(
  'Build a Free Website with WordPress Project',
  'Coursera',
  '2024',
  '',
  'COURSERA-WP-PROJ',
  4
);

insertCert.run(
  'CSS (Basic) Certificate',
  'HackerRank',
  '2024',
  '',
  'HACKERRANK-CSS-BASIC',
  5
);

insertCert.run(
  'Computer Vision App (Azure)',
  'Microsoft',
  '2023',
  '',
  'MSFT-AZURE-CV',
  6
);
console.log('✅ Certifications updated (6 real certifications)');

// 7. Update Presentations
db.prepare('DELETE FROM presentations').run();
const insertPres = db.prepare(`
  INSERT INTO presentations (title, venue, type, details, order_idx)
  VALUES (?, ?, ?, ?, ?)
`);

insertPres.run(
  'Blockchain Technology',
  'K Ramakrishnan College of Engineering (KRCE)',
  'Paper Presentation',
  'Presented technical paper on decentralized architectures, cryptographic security, and distributed consensus.',
  1
);

insertPres.run(
  'Biological Amplifiers',
  'K Ramakrishnan College of Engineering (KRCE)',
  'Paper Presentation',
  'Presented technical research on bio-potential amplification circuits and noise reduction in medical instrumentation.',
  2
);

insertPres.run(
  'Machine Learning for Remote Sensing Applications',
  'National Seminar',
  'Seminar Participation',
  'Participated in national seminar on satellite image classification and ML feature processing.',
  3
);

insertPres.run(
  'SUITS IT Program',
  'Bharathidasan University, Trichy',
  'Co-Curricular IT Program',
  'Participated in university-level IT skill development and computer applications program.',
  4
);
console.log('✅ Presentations & Co-curricular updated');

// 8. Update Settings
db.prepare(`UPDATE settings SET value = ? WHERE key = 'admin_notification_email'`).run('mohitmohanram2001@gmail.com');
db.prepare(`UPDATE settings SET value = ? WHERE key = 'seo_meta_title'`).run('MOHANRAM R | Associate Web Developer & Full Stack Engineer');
db.prepare(`UPDATE settings SET value = ? WHERE key = 'seo_meta_description'`).run('Official portfolio of Mohanram R - Associate Web Developer at VDart, Full Stack Developer, and Electronics & Embedded Systems Engineer. Specializing in WordPress, React, Core Java, SEO, and Hardware-Software integration.');
console.log('✅ Settings updated');

console.log('--- All authentic resume details successfully synced into database! ---');
