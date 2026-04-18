import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin`;

const axiosInstance = axios.create({
  withCredentials: true,
});

export const getDashboardStats = async () => {
  const response = await axiosInstance.get(`${API_URL}/stats`);
  return response.data;
};

export const getUsers = async () => {
  const response = await axiosInstance.get(`${API_URL}/users`);
  return response.data;
};

export const toggleBlockUser = async (id) => {
  const response = await axiosInstance.put(`${API_URL}/users/${id}/block`);
  return response.data;
};
