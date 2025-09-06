 import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    user: null,
    loading: true,
  });

  const setAuthData = (data) => {
    if (data?.token) localStorage.setItem("token", data.token);
    else localStorage.removeItem("token");

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
    const res = await api.post("/api/auth/login", { email, password });
    setAuthData(res.data);
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post("/api/auth/register", formData);
    setAuthData(res.data);
    return res.data;
  };

  const logout = () => {
    setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
