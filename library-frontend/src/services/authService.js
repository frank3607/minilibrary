 import axios from 'axios';

const API_URL = '/api/auth';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

// Get user profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  // Changed /profile → /me
  const response = await axios.get(`${API_URL}/me`, config);
  return response.data;
};

// Update profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  // This should also match backend — if you don’t have PUT /me, add it in backend
  const response = await axios.put(`${API_URL}/me`, userData, config);
  return response.data;
};

export default {
  register,
  login,
  getProfile,
  updateProfile
};
