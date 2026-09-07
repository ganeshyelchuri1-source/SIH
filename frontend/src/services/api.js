const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('ncrb_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    ...getAuthHeader(),
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('ncrb_auth_token');
      localStorage.removeItem('ncrb_user');
      window.dispatchEvent(new Event('ncrb_auth_change'));
    }
    const err = new Error(data.message || 'API request failed');
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password, mfaCode) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, mfaCode }) }),
  switchDemoRole: (role) =>
    request('/auth/switch-demo', { method: 'POST', body: JSON.stringify({ role }) }),
  getProfile: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Cases
  getCases: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/cases?${q}`);
  },
  getCaseById: (id) => request(`/cases/${id}`),
  createCase: (caseData) =>
    request('/cases', { method: 'POST', body: JSON.stringify(caseData) }),
  updateCaseStatus: (id, status, remarks) =>
    request(`/cases/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, remarks }) }),

  // Documents
  getDocuments: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/documents?${q}`);
  },
  getDocumentById: (id) => request(`/documents/${id}`),
  uploadDocument: (formData) =>
    request('/documents/upload', { method: 'POST', body: formData }),
  uploadVersion: (id, formData) =>
    request(`/documents/${id}/version`, { method: 'POST', body: formData }),
  signDocument: (id, reason, signatureConfirmation) =>
    request(`/documents/${id}/sign`, {
      method: 'POST',
      body: JSON.stringify({ reason, signatureConfirmation }),
    }),
  verifyDocument: (id) => request(`/documents/${id}/verify`, { method: 'POST' }),
  previewDocument: (id) => request(`/documents/${id}/preview`),
  getDownloadUrl: (id) => `${API_BASE}/documents/${id}/download`,

  // Integrity Ledger
  getLedger: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/integrity/ledger?${q}`);
  },
  validateChain: () => request('/integrity/validate-chain', { method: 'POST' }),
  verifyRawHash: (formDataOrHash) => {
    if (formDataOrHash instanceof FormData) {
      return request('/integrity/verify-hash', { method: 'POST', body: formDataOrHash });
    }
    return request('/integrity/verify-hash', {
      method: 'POST',
      body: JSON.stringify({ hash: formDataOrHash }),
    });
  },

  // Access Requests
  requestAccess: (documentId, reason, requestedRole) =>
    request('/access/request', {
      method: 'POST',
      body: JSON.stringify({ documentId, reason, requestedRole }),
    }),
  getAccessRequests: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/access/requests?${q}`);
  },
  reviewAccessRequest: (id, status, reviewRemarks) =>
    request(`/access/requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewRemarks }),
    }),

  // Audit Logs
  getAuditLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/audit?${q}`);
  },
  getAuditStats: () => request('/audit/stats'),
  getExportCsvUrl: () => `${API_BASE}/audit/export`,

  // Security Center
  getSecurityOverview: () => request('/security/overview'),
  getSecurityEvents: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/security/events?${q}`);
  },
  resolveSecurityEvent: (id, remarks) =>
    request(`/security/events/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ remarks }),
    }),

  // AI Intelligence
  aiSmartSearch: (query) =>
    request('/ai/search', { method: 'POST', body: JSON.stringify({ query }) }),
  aiSummarize: (data) =>
    request('/ai/summarize', { method: 'POST', body: JSON.stringify(data) }),
  aiClassify: (text, fileName) =>
    request('/ai/classify', { method: 'POST', body: JSON.stringify({ text, fileName }) }),

  // Administration
  getUsers: () => request('/admin/users'),
  toggleUserStatus: (id, isActive) =>
    request(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  resetLockout: (id) => request(`/admin/users/${id}/reset-lockout`, { method: 'POST' }),
  getDepartments: () => request('/admin/departments'),
  getSystemSettings: () => request('/admin/settings'),
};
