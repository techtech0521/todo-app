// ========================================
// COMMON COMPONENT - 確認ダイアログ
// ========================================

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    warningMessage?: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    warningMessage,
    confirmText = '実行',
    cancelText = 'キャンセル'
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* オーバーレイ */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* ダイアログ */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
                
                <p className="text-gray-600 mb-4">{message}</p>

                {warningMessage && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <div className="flex items-start">
                            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                            <p className="ml-3 text-sm text-yellow-800">{warningMessage}</p>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button onClick={onClose} variant="secondary" className="flex-1">
                        {cancelText}
                    </Button>
                    <Button onClick={handleConfirm} variant="primary" className="flex-1">
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;