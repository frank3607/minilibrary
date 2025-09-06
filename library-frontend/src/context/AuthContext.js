 // src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// 🔑 Use deployed backend URL
// 🔑 Detect environment and set API base URL
const API_BASE_URL =
  process.env.REACT_APP_API_URL || // ✅ use Vercel/Render env variable if set
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api" // local backend
    : "https://mini-library-backend.onrender.com/api"); // deployed backend


const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    user: null,
    loading: true,
  });

  // Axios instance with base URL
  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // ensures cookies are sent if using them
  });

  // Set or clear auth data
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
      isAuthenticated: !!data,
      user: data?.user || null,
      loading: false,
    });
  };

  // Load user on mount
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
    // eslint-disable-next-line
  }, []);

  // Auth actions
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setAuthData(res.data);
  };

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);
    setAuthData(res.data);
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
