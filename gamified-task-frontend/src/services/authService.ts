import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const loginParent = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/login/parent`, credentials);
  return response.data;
};

export const loginChild = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/login/child`, credentials);
  return response.data;
};

export const signupParent = async (userData: { email: string; password: string; fullName: string }) => {
  const response = await axios.post(`${API_URL}/signup/parent`, userData);
  return response.data;
};

export const signupChild = async (userData: { email: string; password: string; fullName: string; parentEmail: string }) => {
  const response = await axios.post(`${API_URL}/signup/child`, userData);
  return response.data;
};
