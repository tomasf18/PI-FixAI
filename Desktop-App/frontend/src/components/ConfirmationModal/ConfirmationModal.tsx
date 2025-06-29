import React from 'react';
import { useLanguage } from "../../contexts/LanguageContext";
import { createPortal } from 'react-dom';

interface ConfirmationModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}
  
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
    const { traduction } = useLanguage();
    if (!isOpen) return null;
    return createPortal (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">  {/* z-[9999] to make sure the modal is on top of everything */}
        <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
            <p className="mb-4 text-center">{message}</p>
            <div className="flex justify-center space-x-4">
            <button 
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={onConfirm}
            >
                {traduction("yes_button")}
            </button>
            <button 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={onCancel}
            >
                {traduction("no_button")}
            </button>
            </div>

        </div>
        </div>,
        document.body // Render the modal in the body
  );
};

export default ConfirmationModal;