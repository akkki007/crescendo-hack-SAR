import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// API service functions
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.post('/auth/change-password', data)
};

export const alertService = {
  getAll: (params) => api.get('/alerts', { params }),
  getById: (id) => api.get(`/alerts/${id}`),
  getSummary: () => api.get('/alerts/summary'),
  getTransactions: (id) => api.get(`/alerts/${id}/transactions`),
  assign: (id, assigneeId) => api.post(`/alerts/${id}/assign`, { assigneeId }),
  updateStatus: (id, status, data) => api.patch(`/alerts/${id}/status`, { status, ...data })
};

// AI Service URL for direct calls to Python backend
const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000';

export const sarService = {
  getAll: (params) => api.get('/sar', { params }),
  getById: (id) => api.get(`/sar/${id}`),
  create: (alertId) => api.post('/sar', { alertId }),
  getAlertData: (alertId) => api.get(`/sar/alert-data/${alertId}`),
  updateNarrative: (id, data) => api.patch(`/sar/${id}/narrative`, data),
  // Create SAR and generate narrative in one call (Python AI service)
  createAndGenerate: (alertId, feedback) => {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return axios.post(`${AI_SERVICE_URL}/alert/${alertId}/generate-sar`, {
      feedback: feedback || '',
      user_id: user.id || null
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  // Generate narrative for existing SAR (Python AI service)
  generate: (id, feedback) => {
    const token = localStorage.getItem('accessToken');
    return axios.post(`${AI_SERVICE_URL}/sar/${id}/generate`, { feedback: feedback || '' }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  regenerate: (id, feedback) => {
    const token = localStorage.getItem('accessToken');
    return axios.post(`${AI_SERVICE_URL}/sar/${id}/regenerate`, { feedback }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  submit: (id) => api.post(`/sar/${id}/submit`),
  approve: (id, comments) => api.post(`/sar/${id}/approve`, { comments }),
  reject: (id, comments) => api.post(`/sar/${id}/reject`, { comments })
};

export const customerService = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  getProfile: (id) => api.get(`/customers/${id}/profile`),
  getAccounts: (id) => api.get(`/customers/${id}/accounts`),
  getTransactions: (id, params) => api.get(`/customers/${id}/transactions`, { params }),
  getAlerts: (id) => api.get(`/customers/${id}/alerts`)
};

export const auditService = {
  getAll: (params) => api.get('/audit', { params }),
  getById: (id) => api.get(`/audit/${id}`),
  getSummary: (params) => api.get('/audit/summary', { params }),
  getEntityTrail: (entityType, entityId) => api.get(`/audit/entity/${entityType}/${entityId}`)
};

export const dashboardService = {
  getOverview: () => api.get('/dashboard/overview'),
  getAlertTrends: (days) => api.get('/dashboard/alert-trends', { params: { days } }),
  getAlertsByType: () => api.get('/dashboard/alerts-by-type'),
  getSarWorkflow: () => api.get('/dashboard/sar-workflow'),
  getRecentActivity: (limit) => api.get('/dashboard/recent-activity', { params: { limit } }),
  getMyStats: () => api.get('/dashboard/my-stats')
};
