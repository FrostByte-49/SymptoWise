import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

type ToastProps = {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
};

export const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const toastStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  const toastIcons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className="flex justify-center animate-fade-in">
      <div className={`${toastStyles[type]} border px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 m-2`}>
        {toastIcons[type]}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
};