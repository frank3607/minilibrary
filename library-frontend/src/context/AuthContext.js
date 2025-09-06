import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// ✅ Correct base URL (points to /api/auth)
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/auth"
    : "https://mini-library-backend.onrender.com/api/auth");

// 🔑 Axios instance
const api = axios.create({ baseURL: API_BASE_URL });

// ✅ Set token immediately if available
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: token,
    isAuthenticated: null,
    user: null,
    loading: true,
  });

  // 🔑 Helper to set auth state + token
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

  // 🔑 Load user from token
  const loadUser = async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    try {
      const res = await api.get("/me"); // ✅ now hits /api/auth/me
      setAuth({
        token: storedToken,
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

  // 🔑 Auth actions
  const login = async (email, password) => {
    setAuth((prev) => ({ ...prev, loading: true }));
    try {
      const res = await api.post("/login", { email, password }); // ✅ /api/auth/login
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
      const res = await api.post("/register", formData); // ✅ /api/auth/register
      setAuthData(res.data);
      return res.data;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setAuth((prev) => ({ ...prev, loading: false }));
      throw err;
    }
  };

  const logout = () => {
    setAuthData(null);
  };

  const updateProfile = async (formData) => {
    try {
      const res = await api.put("/me", formData); // ✅ /api/auth/me
      setAuth((prev) => ({
        ...prev,
        user: res.data,
        loading: false,
      }));
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
