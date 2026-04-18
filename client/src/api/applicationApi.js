import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/applications`;

// Configure axios for credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const applyToJob = async (jobId, coverLetter) => {
  const response = await api.post('/apply', { jobId, coverLetter });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get('/my');
  return response.data;
};

export const getJobApplications = async (jobId) => {
  const response = await api.get(`/job/${jobId}`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.put(`/${applicationId}/status`, { status });
  return response.data;
};
