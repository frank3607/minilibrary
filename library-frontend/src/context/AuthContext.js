 import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    user: null,
    loading: true
  });

  const setAuthData = (data) => {
    if (data) {
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }

    setAuth({
      token: data?.token || null,
      isAuthenticated: !!data,
      user: data?.user || null,
      loading: false
    });
  };

  const loadUser = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await axios.get('/api/auth/me');
      setAuth({
        token,
        isAuthenticated: true,
        user: res.data,
        loading: false
      });
    } catch (err) {
      setAuth({
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setAuthData(res.data);
  };

  const register = async (formData) => {
    const res = await axios.post('/api/auth/register', formData);
    setAuthData(res.data);
  };

  const logout = () => {
    setAuthData(null);
  };

  const updateProfile = async (formData) => {
    const res = await axios.put('/api/auth/me', formData);
    setAuth({
      ...auth,
      user: res.data
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
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
