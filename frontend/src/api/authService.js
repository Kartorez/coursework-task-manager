import axiosInstance from './axiosInstance';

export const authService = {
  async register(userData) {
    const { data } = await axiosInstance.post('/auth/register', userData);
    if (data.accessToken) localStorage.setItem('token', data.accessToken);
    return data;
  },

  async login(credentials) {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    if (data.accessToken) localStorage.setItem('token', data.accessToken);
    return data;
  },

  async logout() {
    await axiosInstance.post('/auth/logout');
    localStorage.removeItem('token');
  },

  async getProfile() {
    const { data } = await axiosInstance.get('/users/me');
    return data;
  },
};
