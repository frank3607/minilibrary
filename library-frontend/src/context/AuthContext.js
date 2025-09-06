 import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Base URL from .env or fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Axios instance
const api = axios.create({ baseURL: API_BASE_URL });

// Include token if exists
const token = localStorage.getItem("token");
if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: token,
    isAuthenticated: null,
    user: null,
    loading: true,
  });

  const setAuthData = (data) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }

    setAuth({
      token: data?.token || null,
      isAuthenticated: !!data?.token,
      user: data?.user || null,
      loading: false,
    });
  };

  const loadUser = async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

    try {
      const res = await api.get("/api/auth/me");
      setAuth({
        token: storedToken,
        isAuthenticated: true,
        user: res.data,
        loading: false,
      });
    } catch (err) {
      console.error("Auth load error:", err.response?.data || err.message);
      setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
    }
  };

  useEffect(() => { loadUser(); }, []);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    setAuthData(res.data);
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post("/api/auth/register", formData);
    setAuthData(res.data);
    return res.data;
  };

  const logout = () => setAuthData(null);

  const updateProfile = async (formData) => {
    const res = await api.put("/api/auth/me", formData);
    setAuth(prev => ({ ...prev, user: res.data }));
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout, updateProfile, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
