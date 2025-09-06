 import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    user: null,
    loading: true,
  });

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

  const loadUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setAuth({
        token: localStorage.getItem("token"),
        isAuthenticated: true,
        user: res.data,
        loading: false,
      });
    } catch (err) {
      console.error("Auth load error:", err.response?.data || err.message);
      setAuth({
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      setAuthData(res.data);
      return res.data;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post("/api/auth/register", formData);
      setAuthData(res.data);
      return res.data;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    setAuthData(null);
  };

  const updateProfile = async (formData) => {
    try {
      const res = await api.put("/api/auth/me", formData);
      setAuth((prev) => ({ ...prev, user: res.data }));
      return res.data;
    } catch (err) {
      console.error("Update profile error:", err.response?.data || err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout, updateProfile, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
