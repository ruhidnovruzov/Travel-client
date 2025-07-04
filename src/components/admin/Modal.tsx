import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

 return (
  <div className="fixed inset-0 z-50 overflow-y-auto ">
    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      {/* Background overlay */}
      <div
        className="fixed inset-0  bg-[#0000002d] bg-opacity-30 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal panel */}
      <div
        className={`
          relative inline-block w-full ${sizeClasses[size]} p-6 my-8 overflow-hidden text-left align-middle 
          transition-all transform bg-white shadow-xl rounded-2xl
        `}
        onClick={e => e.stopPropagation()} // Prevent overlay click from closing modal when clicking inside modal
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  </div>
);
};

export default Modal;