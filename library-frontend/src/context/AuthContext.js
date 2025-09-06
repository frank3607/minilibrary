 import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// ✅ Base URL from .env or fallback
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// 🔑 Axios instance
const api = axios.create({ baseURL: API_BASE_URL });

// ✅ Interceptor: attach token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    user: null,
    loading: true,
  });

  // 🔑 Helper to set auth state + token
  const setAuthData = (data) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
    } else {
      localStorage.removeItem("token");
    }

    setAuth({
      token: data?.token || null,
      isAuthenticated: !!data?.token,
      user: data?.user || null,
      loading: false,
    });
  };

  // 🔑 Load user from token
  const loadUser = async () => {
    const storedToken = localStorage.getItem("token");
    console.log("🔑 Using token:", storedToken); // debug token

    if (!storedToken) {
      setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
      return;
    }

    try {
      const res = await api.get("/api/auth/me"); // ✅ correct route
      setAuth({
        token: storedToken,
        isAuthenticated: true,
        user: res.data,
        loading: false,
      });
    } catch (err) {
      console.error("Auth load error:", err.response?.data || err.message);
      localStorage.removeItem("token");
      setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // 🔑 Auth actions
  const login = async (email, password) => {
    setAuth((prev) => ({ ...prev, loading: true }));
    try {
      const res = await api.post("/api/auth/login", { email, password });
      setAuthData(res.data);
      return res.data;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setAuth((prev) => ({ ...prev, loading: false }));
      throw err;
    }
  };

  const register = async (formData) => {
    setAuth((prev) => ({ ...prev, loading: true }));
    try {
      const res = await api.post("/api/auth/register", formData);
      setAuthData(res.data);
      return res.data;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setAuth((prev) => ({ ...prev, loading: false }));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
  };

  const updateProfile = async (formData) => {
    try {
      const res = await api.put("/api/auth/me", formData);
      setAuth((prev) => ({ ...prev, user: res.data, loading: false }));
      return res.data;
    } catch (err) {
      console.error("Update profile error:", err.response?.data || err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        register,
        logout,
        updateProfile,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
