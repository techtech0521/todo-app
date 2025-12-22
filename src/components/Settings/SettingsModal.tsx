// ========================================
// COMPONENT - 設定モーダル
// ========================================

import React from 'react';
import Modal from '../common/Modal';
import { Trash2 } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onResetData: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    onResetData
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="⚙️ 設定">
            <div className="space-y-6">
                {/* データ管理セクション */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        データ管理
                    </h3>
                
                    <div className="bg-gray-50 rounded-lg p-4">
                        <button
                            onClick={onResetData}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                            <Trash2 size={20} />
                            全データをリセット
                        </button>
                        
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                            <p className="font-medium mb-1">⚠️ 警告</p>
                            <p>全てのタスクとユーザー情報（レベル、経験値、ストリークなど）が削除されます。</p>
                            <p className="mt-1">この操作は取り消せません。</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SettingsModal;