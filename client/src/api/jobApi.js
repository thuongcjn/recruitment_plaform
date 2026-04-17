import axios from 'axios';

const API_URL = 'http://localhost:5000/api/jobs';

// Set credentials for all requests
axios.defaults.withCredentials = true;

export const createJob = async (jobData) => {
  const response = await axios.post(API_URL, jobData);
  return response.data;
};

export const getJobs = async (params) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const getJob = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getMyJobs = async () => {
  const response = await axios.get(`${API_URL}/my/all`);
  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await axios.put(`${API_URL}/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const getRecruiterStats = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};
