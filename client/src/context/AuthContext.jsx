import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('evenzo_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(() => !!localStorage.getItem('token'));

  const restoreSession = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/profile');
      const profile = response.data;
      setUser(profile);
      localStorage.setItem('evenzo_user', JSON.stringify(profile));
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('evenzo_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data;
    localStorage.setItem('token', userData.token);
    localStorage.setItem('evenzo_user', JSON.stringify({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    }));
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
    return userData;
  };

  const signup = async (name, email, password, role = 'user') => {
    let response;
    try {
      response = await api.post('/auth/register', { name, email, password, role });
    } catch (error) {
      if (error.response?.status === 404) {
        response = await api.post('/auth/signup', { name, email, password, role });
      } else {
        throw error;
      }
    }

    const userData = response.data;
    localStorage.setItem('token', userData.token);
    localStorage.setItem('evenzo_user', JSON.stringify({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    }));
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('evenzo_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
