import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.get(`${API_URL}/logout`);
  return response.data;
};

export const refreshTokens = async () => {
  const response = await axios.post(`${API_URL}/refresh`);
  return response.data;
};

// Axios interceptor to handle silent refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and it's not a retry AND it's not the refresh request itself
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes('/refresh')
    ) {
      originalRequest._retry = true;

      try {
        await refreshTokens();
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, the user must log in again
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
