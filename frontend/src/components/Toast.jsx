import { useState, useEffect } from 'react';
import './Toast.css';

let toastTimeout;
let showToastFn;

export const showToast = (message, type = 'info') => {
  if (showToastFn) {
    showToastFn(message, type);
  }
};

const Toast = () => {
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  useEffect(() => {
    showToastFn = (message, type) => {
      // Clear existing timeout
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }

      // Show new toast
      setToast({ message, type, visible: true });

      // Hide after 3 seconds
      toastTimeout = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 3000);
    };

    return () => {
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
    };
  }, []);

  if (!toast.visible) return null;

  return (
    <div className={`toast toast--${toast.type} ${toast.visible ? 'toast--show' : ''}`}>
      {toast.message}
    </div>
  );
};

export default Toast;
