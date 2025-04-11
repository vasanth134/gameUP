import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const loginParent = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/parent`, credentials);
  return response.data;
};

export const loginChild = async (credentials: { childId: string; password: string }) => {
  const response = await axios.post(`${API_URL}/child`, credentials);
  return response.data;
};
