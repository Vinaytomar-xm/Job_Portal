import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logoutUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Refresh pe seedha localStorage se lo — instant, no server call needed
    try {
      const saved = localStorage.getItem('jb_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false); // false — localStorage se turant mil gaya

  useEffect(() => {
    // Sirf background mein verify karo
    // Success → user data fresh karo
    // Fail → kuch mat karo, localStorage wala user rahega
    getMe()
      .then(r => {
        setUser(r.data.user);
        localStorage.setItem('jb_user', JSON.stringify(r.data.user));
      })
      .catch(() => {
        // Cookie cross-origin block — IGNORE, logout mat karo
      });
  }, []);

  const login = useCallback((userData) => {
    localStorage.setItem('jb_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try { await logoutUser(); } catch (_) {}
    localStorage.removeItem('jb_user');
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