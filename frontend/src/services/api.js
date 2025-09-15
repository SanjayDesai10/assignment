import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  signin: (userData) => api.post('/auth/signin', userData),
};

// Links API calls
export const linksAPI = {
  getLinks: (params = {}) => api.get('/links', { params }),
  getTags: () => api.get('/links/tags'),
  createLink: (linkData) => api.post('/links', linkData),
  updateLink: (id, linkData) => api.patch(`/links/${id}`, linkData),
  deleteLink: (id) => api.delete(`/links/${id}`),
};

export default api;
