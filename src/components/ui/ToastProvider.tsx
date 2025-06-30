import { useState } from "react";
import { Toast } from "./Toast";
import { ToastContext, ToastType } from "../../contexts/ToastContext";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info", duration = 3000) => {
    const newToast = { message, type, duration, id: Date.now() };
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-remove toast after duration
    setTimeout(() => {
      removeToast(newToast.id);
    }, duration);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Create the context value that matches ToastContextType
  const contextValue = {
    toasts,
    showToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};