import { createContext, useState, useContext, useCallback, useEffect } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    const handleGlobalToast = (e) => {
      const { message, type } = e.detail;
      showToast(message, type);
    };

    window.addEventListener('app-toast', handleGlobalToast);
    return () => window.removeEventListener('app-toast', handleGlobalToast);
  }, [showToast]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// Internal Toast Component
const Toast = ({ message, type, onClose }) => {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-600',
    warning: 'bg-yellow-500'
  }[type] || 'bg-gray-800';

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
      <div className={`${bgColor} text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 min-w-[320px] max-w-md`}>
        <div className="flex-shrink-0">
          {type === 'success' && '🌟'}
          {type === 'error' && '🚫'}
          {type === 'info' && '💎'}
          {type === 'warning' && '⚠️'}
        </div>
        <div className="flex-grow">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">{type}</p>
          <p className="text-xs font-bold leading-relaxed">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
