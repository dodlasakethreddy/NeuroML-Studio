import api from './api';

export const authService = {
  // Register a new account
  register: async ({ username, email, password }) => {
    return await api.post('/auth/register', { username, email, password });
  },

  // Login with username/email and password
  login: async ({ username, email, password }) => {
    return await api.post('/auth/login', { username, email, password });
  },

  // Get current user profile (using HTTP-only cookie)
  getMe: async () => {
    return await api.get('/auth/me');
  },

  // Logout (clears HTTP-only cookie on server)
  logout: async () => {
    return await api.post('/auth/logout');
  },
};

export default authService;
