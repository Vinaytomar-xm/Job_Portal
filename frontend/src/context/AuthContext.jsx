import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logoutUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true until session check done

  useEffect(() => {
    // Session verify karo — cookie automatically send hogi
    // Agar cookie nahi hai ya expired → catch mein jayega, that's fine
    // Public pages tabhi bhi kaam karengi
    getMe()
      .then(r => {
        setUser(r.data.user);
        localStorage.setItem('jb_user', JSON.stringify(r.data.user));
      })
      .catch(() => {
        // Not logged in — normal case for public visitors
        setUser(null);
        localStorage.removeItem('jb_user');
      })
      .finally(() => {
        setLoading(false); // ← yeh hona chahiye chahe success ho ya fail
      });
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('jb_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    try { await logoutUser(); } catch (_) {}
    setUser(null);
    localStorage.removeItem('jb_user');
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
