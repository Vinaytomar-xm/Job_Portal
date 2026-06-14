import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const isAuthenticated = () => !!user && !!localStorage.getItem('token');
  const isAdmin    = () => user?.role === 'admin';
  const isCompany  = () => user?.role === 'company' || user?.role === 'admin';
  const isJobSeeker= () => user?.role === 'user';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isCompany, isJobSeeker }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
