const nodemailer = require('nodemailer');
const db = require('../db');

function getSmtpSettings() {
  const rows = db.prepare("SELECT key, value FROM settings WHERE key LIKE 'smtp_%' OR key LIKE '%notification%'").all();
  const settings = {};
  for (const r of rows) {
    settings[r.key] = r.value;
  }
  return settings;
}

function createTransporter(settings) {
  if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass) {
    return null;
  }
  return nodemailer.createTransport({
    host: settings.smtp_host,
    port: parseInt(settings.smtp_port, 10) || 587,
    secure: settings.smtp_secure === 'true',
    auth: {
      user: settings.smtp_user,
      pass: settings.smtp_pass
    }
  });
}

async function sendVisitorNotification(visitData) {
  try {
    const settings = getSmtpSettings();
    if (settings.visitor_notifications_enabled !== 'true') {
      return;
    }
    const adminEmail = settings.admin_notification_email || 'mohanram.developer@gmail.com';
    const transporter = createTransporter(settings);

    const emailBody = `
New visitor detected on your portfolio website.

Time: ${new Date().toLocaleString()}
Page: ${visitData.page || '/'}
Device: ${visitData.device || 'Desktop'}
Browser: ${visitData.browser || 'Browser'}
OS: ${visitData.os || 'OS'}
Approximate Location: ${visitData.city || 'Unknown'}, ${visitData.country || 'Unknown'}
Referrer: ${visitData.referrer || 'Direct'}

Portfolio: https://mohanram.dev
Admin Dashboard: https://mohanram.dev/admin
    `.trim();

    if (!transporter) {
      console.log('[Notification Simulation] Visitor Email would be sent to:', adminEmail);
      console.log(emailBody);
      return;
    }

    await transporter.sendMail({
      from: `"Mohanram Portfolio" <${settings.smtp_user}>`,
      to: adminEmail,
      subject: 'New Visitor on Your Portfolio Website',
      text: emailBody
    });
  } catch (err) {
    console.error('Failed to send visitor notification email:', err.message);
  }
}

async function sendContactFormNotification(messageData) {
  try {
    const settings = getSmtpSettings();
    const adminEmail = settings.admin_notification_email || 'mohanram.developer@gmail.com';
    const transporter = createTransporter(settings);

    const adminBody = `
New message received from your portfolio contact form:

Name: ${messageData.name}
Email: ${messageData.email}
Company: ${messageData.company || 'N/A'}
Opportunity Type: ${messageData.opportunity_type}
Subject: ${messageData.subject}

Message:
${messageData.message}

Admin Dashboard: https://mohanram.dev/admin
    `.trim();

    if (!transporter) {
      console.log('[Notification Simulation] New Contact Message from:', messageData.name, messageData.email);
      console.log(adminBody);
      return;
    }

    // 1. Notify Admin
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${settings.smtp_user}>`,
      to: adminEmail,
      replyTo: messageData.email,
      subject: `[Contact Form] ${messageData.subject} - from ${messageData.name}`,
      text: adminBody
    });

    // 2. Auto-reply confirmation to Sender
    await transporter.sendMail({
      from: `"Mohanram R" <${settings.smtp_user}>`,
      to: messageData.email,
      subject: `Thank you for reaching out, ${messageData.name}!`,
      text: `Hello ${messageData.name},\n\nThank you for reaching out regarding ${messageData.opportunity_type}. I have received your message regarding "${messageData.subject}" and will review it and get back to you promptly.\n\nBest regards,\nMohanram R\nFull Stack Developer | Software Engineer\nmohanram.developer@gmail.com`
    });
  } catch (err) {
    console.error('Failed to send contact notification emails:', err.message);
  }
}

module.exports = {
  sendVisitorNotification,
  sendContactFormNotification
};
