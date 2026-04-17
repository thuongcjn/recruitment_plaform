import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile';

// Set credentials for all requests
axios.defaults.withCredentials = true;

export const updateCandidateProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}/candidate`, profileData);
  return response.data;
};

export const updateCompanyProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}/company`, profileData);
  return response.data;
};

export const getPublicProfile = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
