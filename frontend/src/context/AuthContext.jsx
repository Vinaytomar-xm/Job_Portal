import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── CHECK IF USER IS LOGGED IN ────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('job_portal_token');
    const savedUser = localStorage.getItem('job_portal_user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ─── LOGIN ─────────────────────────────────────────────────────
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      localStorage.setItem('job_portal_token', token);
      localStorage.setItem('job_portal_user', JSON.stringify(user));
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // ─── SIGNUP ────────────────────────────────────────────────────
  const signup = async (data) => {
    try {
      const response = await authAPI.signup(data);
      const { token, user } = response.data;

      localStorage.setItem('job_portal_token', token);
      localStorage.setItem('job_portal_user', JSON.stringify(user));
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  };

  // ─── LOGOUT ────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('job_portal_token');
    localStorage.removeItem('job_portal_user');
    setUser(null);
  };

  // ─── CHECK IF USER IS ADMIN ────────────────────────────────────
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // ─── CHECK IF AUTHENTICATED ────────────────────────────────────
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
