import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/reports`;

const axiosInstance = axios.create({
  withCredentials: true,
});

export const createReport = async (reportData) => {
  const response = await axiosInstance.post(API_URL, reportData);
  return response.data;
};

export const getReports = async () => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await axiosInstance.delete(`${API_URL}/${id}`);
  return response.data;
};

export const deleteJobByAdmin = async (jobId) => {
  const response = await axiosInstance.delete(`${API_URL}/job/${jobId}`);
  return response.data;
};
