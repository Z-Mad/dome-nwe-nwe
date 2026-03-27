import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error: <AlertCircle size={18} className="text-red-400" />,
  warning: <AlertTriangle size={18} className="text-yellow-400" />,
  info: <AlertCircle size={18} className="text-blue-400" />,
};

const bgColorMap: Record<ToastType, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-yellow-600',
  info: 'bg-blue-600',
};

export const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 ${bgColorMap[type]} text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-[70] animate-in fade-in slide-in-from-top-2`}>
      {iconMap[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};