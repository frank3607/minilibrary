 import api from "./api";

// Register user
const register = async (userData) => {
  const { data } = await api.post("/api/auth/register", userData);
  if (data?.token) localStorage.setItem("token", data.token);
  return data;
};

// Login user
const login = async (userData) => {
  const { data } = await api.post("/api/auth/login", userData);
  if (data?.token) localStorage.setItem("token", data.token);
  return data;
};

// Get user profile
const getProfile = async () => {
  const { data } = await api.get("/api/auth/me");
  return data;
};

// Update profile
const updateProfile = async (userData) => {
  const { data } = await api.put("/api/auth/me", userData);
  return data;
};

export default { register, login, getProfile, updateProfile };
