import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    info:    (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === 'success' ? '#0d2e1f' : t.type === 'error' ? '#2e0d15' : t.type === 'warning' ? '#2e1d0d' : '#0d1020',
            border: `1px solid ${t.type === 'success' ? '#43d9a2' : t.type === 'error' ? '#ff6584' : t.type === 'warning' ? '#ff9f6b' : '#6c63ff'}44`,
            color: t.type === 'success' ? '#43d9a2' : t.type === 'error' ? '#ff6584' : t.type === 'warning' ? '#ff9f6b' : '#a0a0ff',
            borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 500,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.3s ease',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
