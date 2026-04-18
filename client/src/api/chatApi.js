import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/chat`;

const axiosInstance = axios.create({
  withCredentials: true,
});

export const getConversations = async () => {
  const response = await axiosInstance.get(`${API_URL}/conversations`);
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await axiosInstance.get(`${API_URL}/messages/${conversationId}`);
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await axiosInstance.post(`${API_URL}/message`, messageData);
  return response.data;
};
