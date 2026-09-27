const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('mohanram_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Session ID for anonymous privacy visit logging
function getSessionId() {
  let sid = sessionStorage.getItem('portfolio_sess_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
    sessionStorage.setItem('portfolio_sess_id', sid);
  }
  return sid;
}

export const api = {
  // Public Content
  async getContent() {
    const res = await fetch(`${API_BASE}/content/all`);
    if (!res.ok) throw new Error('Failed to load portfolio content');
    return res.json();
  },

  async getProjectBySlug(slug) {
    const res = await fetch(`${API_BASE}/content/projects/${slug}`);
    if (!res.ok) throw new Error('Failed to load project details');
    return res.json();
  },

  // Contact Form
  async submitContact(data) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Privacy Analytics Telemetry
  async trackVisit(page) {
    try {
      const sessionId = getSessionId();
      await fetch(`${API_BASE}/analytics/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          page: page || window.location.pathname + window.location.hash,
          referrer: document.referrer || 'Direct'
        })
      });
    } catch (e) {
      // Non-blocking telemetry
    }
  },

  async trackEvent(eventType, eventName, metadata = {}) {
    try {
      await fetch(`${API_BASE}/analytics/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          event_name: eventName,
          metadata
        })
      });
    } catch (e) {}
  },

  // Authentication
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async changePassword(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return res.json();
  },

  // Admin CMS - Content Updates
  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/content/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  async updateHero(heroData) {
    const res = await fetch(`${API_BASE}/content/hero`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(heroData)
    });
    return res.json();
  },

  // Experience
  async createExperience(data) {
    const res = await fetch(`${API_BASE}/content/experience`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateExperience(id, data) {
    const res = await fetch(`${API_BASE}/content/experience/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteExperience(id) {
    const res = await fetch(`${API_BASE}/content/experience/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Skills
  async createSkill(data) {
    const res = await fetch(`${API_BASE}/content/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateSkill(id, data) {
    const res = await fetch(`${API_BASE}/content/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteSkill(id) {
    const res = await fetch(`${API_BASE}/content/skills/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Projects
  async createProject(data) {
    const res = await fetch(`${API_BASE}/content/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateProject(id, data) {
    const res = await fetch(`${API_BASE}/content/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/content/projects/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Education
  async createEducation(data) {
    const res = await fetch(`${API_BASE}/content/education`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateEducation(id, data) {
    const res = await fetch(`${API_BASE}/content/education/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteEducation(id) {
    const res = await fetch(`${API_BASE}/content/education/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Certifications
  async createCertification(data) {
    const res = await fetch(`${API_BASE}/content/certifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateCertification(id, data) {
    const res = await fetch(`${API_BASE}/content/certifications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteCertification(id) {
    const res = await fetch(`${API_BASE}/content/certifications/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Resume Management
  async getResumeHistory() {
    const res = await fetch(`${API_BASE}/resume/history`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async uploadResume(formData) {
    const res = await fetch(`${API_BASE}/resume/upload`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData
    });
    return res.json();
  },

  // File Upload
  async uploadPhoto(formData, setProfile = false) {
    const res = await fetch(`${API_BASE}/upload/photo?set_profile=${setProfile ? 'true' : 'false'}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData
    });
    return res.json();
  },

  // Contact Messages Admin
  async getMessages(status = 'all') {
    const res = await fetch(`${API_BASE}/contact/messages?status=${status}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async updateMessageStatus(id, status, replyNotes) {
    const res = await fetch(`${API_BASE}/contact/messages/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, reply_notes: replyNotes })
    });
    return res.json();
  },

  async deleteMessage(id) {
    const res = await fetch(`${API_BASE}/contact/messages/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Analytics Dashboard
  async getAnalyticsDashboard() {
    const res = await fetch(`${API_BASE}/analytics/dashboard`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Settings
  async getAdminSettings() {
    const res = await fetch(`${API_BASE}/settings/admin`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async saveSettings(settingsObject) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(settingsObject)
    });
    return res.json();
  }
};
