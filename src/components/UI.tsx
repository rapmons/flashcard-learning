import React from 'react';
import { useFlashcard } from '@context/FlashcardContext';
import { X } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  const baseClasses =
    'font-medium rounded-lg transition-colors duration-200 font-semibold';

  const variantClasses: Record<string, string> = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-300',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          placeholder-gray-400 dark:placeholder-gray-500
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {helpText && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{helpText}</p>}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-2 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgClasses: Record<string, string> = {
    success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700',
    error: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700',
    info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
    warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700',
  };

  const textClasses: Record<string, string> = {
    success: 'text-green-800 dark:text-green-100',
    error: 'text-red-800 dark:text-red-100',
    info: 'text-blue-800 dark:text-blue-100',
    warning: 'text-yellow-800 dark:text-yellow-100',
  };

  return (
    <div className={`${bgClasses[type]} border rounded-lg p-4 mb-2 animate-slide-up`}>
      <div className="flex items-center justify-between">
        <p className={`${textClasses[type]} text-sm font-medium`}>{message}</p>
        <button
          onClick={() => onClose(id)}
          className={`${textClasses[type]} hover:opacity-75`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: any[] }> = ({ toasts }) => {
  const { removeToast } = useFlashcard();

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};
