 import axios from "axios";

const API_URL = "https://mini-library-backend.onrender.com/api/auth";

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data?.token) {
    localStorage.setItem("token", response.data.token); // ✅ Save token
  }
  return response.data;
};

// Get user profile
const getProfile = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/me`, config);
  return response.data;
};

// Update profile
const updateProfile = async (userData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/me`, userData, config);
  return response.data;
};

export default {
  register,
  login,
  getProfile,
  updateProfile,
};
