import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  const value = {
    toast: addToast,
    success,
    error,
    warning,
    info,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastStyles = () => {
    const base = 'flex items-center gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 min-w-[300px] max-w-md';
    
    if (!isVisible) {
      return `${base} opacity-0 translate-x-full`;
    }
    if (isLeaving) {
      return `${base} opacity-0 translate-x-full`;
    }
    
    return `${base} opacity-100 translate-x-0`;
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBackgroundClass = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-900 border-green-700';
      case 'error':
        return 'bg-red-900 border-red-700';
      case 'warning':
        return 'bg-yellow-900 border-yellow-700';
      default:
        return 'bg-blue-900 border-blue-700';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className={`${getBackgroundClass()} flex-1`}>
        {getIcon()}
        <p className="text-white flex-1">{toast.message}</p>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
