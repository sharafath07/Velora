import axios from 'axios';

// Use environment variable (VITE_API_URL) or default Render URL
const BASE_URL = import.meta.env.VITE_API_URL || 'https://velora-dm0l.onrender.com/api';

/**
 * Returns an axios instance configured with provided token.
 * Use this to create a fresh instance per-request to include the latest token.
 *
 * @param {string} token - Bearer token (can be undefined)
 * @returns Axios instance
 */
export const getApi = (token) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // ✅ Centralized error interceptor
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.data?.message) {
        err.message = err.response.data.message;
      }
      return Promise.reject(err);
    }
  );

  return instance;
};
