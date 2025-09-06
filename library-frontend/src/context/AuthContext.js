 import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

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
      const user = await authService.getProfile();
      setAuth({
        token: localStorage.getItem("token"),
        isAuthenticated: true,
        user,
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
    if (auth.token) loadUser();
    else setAuth((prev) => ({ ...prev, loading: false }));
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setAuthData(data);
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    setAuthData(data);
    return data;
  };

  const logout = () => setAuthData(null);

  const updateProfile = async (formData) => {
    const data = await authService.updateProfile(formData);
    setAuth((prev) => ({ ...prev, user: data }));
    return data;
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout, updateProfile, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
