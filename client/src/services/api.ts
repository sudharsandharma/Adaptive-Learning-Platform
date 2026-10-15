import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nomad_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Automatically unwrap the { success, data } envelope from backend
    if (response.data && response.data.success !== undefined) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nomad_token');
      // Only redirect if not already on a public page
      if (!window.location.pathname.match(/^\/(login|register|)?$/)) {
        window.location.href = '/login';
      }
    }
    // Extract error message from backend or platform response
    const backendError = error.response?.data?.error;
    const message =
      (typeof backendError === 'string' ? backendError : backendError?.message) ||
      error.response?.data?.message ||
      error.message ||
      'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
