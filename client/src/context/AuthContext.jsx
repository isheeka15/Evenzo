import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('evenzo_user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
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
    const response = await api.post('/auth/register', { name, email, password, role });
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
