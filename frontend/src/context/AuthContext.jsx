import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { logoutUser } from '../services/api';

const AuthContext = createContext(null);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const isSessionExpired = () => {
  const expiry = localStorage.getItem('jb_session_expiry');
  if (!expiry) return true;
  return Date.now() > parseInt(expiry);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      // Session expire check — client side
      if (isSessionExpired()) {
        localStorage.removeItem('jb_user');
        localStorage.removeItem('jb_session_expiry');
        return null;
      }
      const saved = localStorage.getItem('jb_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Har 5 minute pe expiry check
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        localStorage.removeItem('jb_user');
        localStorage.removeItem('jb_session_expiry');
        setUser(null);
        window.location.href = '/login';
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback((userData) => {
    const expiry = Date.now() + SESSION_DURATION;
    localStorage.setItem('jb_user', JSON.stringify(userData));
    localStorage.setItem('jb_session_expiry', expiry.toString());
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try { await logoutUser(); } catch (_) {}
    localStorage.removeItem('jb_user');
    localStorage.removeItem('jb_session_expiry');
    setUser(null);
  }, []);

  const isAuthenticated = () => !!user;
  const isAdmin         = () => user?.role === 'admin';
  const isCompany       = () => user?.role === 'company' || user?.role === 'admin';
  const isJobSeeker     = () => user?.role === 'user';

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout,
      isAuthenticated, isAdmin, isCompany, isJobSeeker,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};