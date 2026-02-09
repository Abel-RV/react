import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.show && (
        <div className={`
          fixed bottom-8 right-8 px-6 py-4 rounded shadow-2xl z-50 text-white font-bold animate-bounce
          border-l-4 transition-all duration-300
          ${toast.type === 'error' ? 'bg-neutral-800 border-accent-red' : 'bg-neutral-800 border-accent-green'}
        `}>
          {toast.type === 'error' ? '❌ ' : '✅ '}
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}