import { createContext, useContext } from 'react';

// Define the ToastType
export type ToastType = {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
  duration?: number;
};

// Define the context type to match what you're providing
export type ToastContextType = {
  toasts: ToastType[];
  showToast: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
  removeToast: (id: number) => void;
};

// Create the context with the correct type
export const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Export the useToast hook separately
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};