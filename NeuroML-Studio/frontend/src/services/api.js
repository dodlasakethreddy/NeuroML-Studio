import axios from 'axios';

// Empty string = use Vite proxy (/api → http://127.0.0.1:8000/api)
// Works for both localhost AND network IP (192.168.x.x) access
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 60000, // 60s timeout for heavy ML operations
  withCredentials: true, // Send and receive HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT Bearer token if present in localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('neuroml_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // localStorage may fail in restricted iframes
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If 401 Unauthorized, clear stored token
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('neuroml_token');
        localStorage.removeItem('neuroml_user');
      } catch (e) {}
    }

    const customError = {
      message:
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'An unexpected server error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export const checkBackendHealth = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/health`, { timeout: 4000 });
    return { online: true, data: res.data };
  } catch (err) {
    return { online: false, message: 'Backend unreachable. Please verify server is running on port 8000.' };
  }
};

export default api;
