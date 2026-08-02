import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now().toString() + Math.random().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div 
                        key={toast.id} 
                        className={`flex items-start gap-3 p-4 pr-12 rounded-xl shadow-lg border relative min-w-[300px] max-w-md animate-in slide-in-from-right-8 fade-in duration-300 ${
                            toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-700' :
                            toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-700' :
                            'bg-surface-secondary border-border-primary text-text-primary'
                        }`}
                    >
                        {toast.type === 'success' && <CheckCircle className="text-green-600 mt-0.5 shrink-0" size={18} />}
                        {toast.type === 'error' && <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={18} />}
                        {toast.type === 'info' && <Info className="text-accent-primary mt-0.5 shrink-0" size={18} />}
                        
                        <p className="text-sm font-medium">{toast.message}</p>
                        
                        <button 
                            onClick={() => removeToast(toast.id)}
                            className="absolute right-3 top-4 text-text-tertiary hover:text-text-primary transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};
