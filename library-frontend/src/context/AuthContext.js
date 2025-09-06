 import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "https://mini-library-backend.onrender.com/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  // ❌ removed withCredentials, since we use JWT not cookies
});

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
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
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
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await api.get("/auth/me");
      setAuth({
        token,
        isAuthenticated: true,
        user: res.data,
        loading: false,
      });
    } catch (err) {
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
    const res = await api.post("/auth/login", { email, password });
    setAuthData(res.data); // ✅ saves token automatically
  };

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);
    setAuthData(res.data); // ✅ saves token automatically
  };

  const logout = () => {
    setAuthData(null);
  };

  const updateProfile = async (formData) => {
    const res = await api.put("/auth/me", formData);
    setAuth({
      ...auth,
      user: res.data,
    });
    return res.data;
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
