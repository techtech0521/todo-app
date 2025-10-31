// ========================================
// COMPONENT - タスク入力フォーム
// ========================================

import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../common/Button';

interface TaskInputProps {
    onOpenModal: () => void;
};

const TaskInput: React.FC<TaskInputProps> = ({ onOpenModal }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-2">
                <button
                    onClick={onOpenModal}
                    className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-left text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors"
                >
                    新しいタスクを追加...
                </button>
                <Button onClick={onOpenModal} variant="primary">
                    <Plus size={20} />
                    追加
                </Button>
            </div>
        </div>
    );
};

export default TaskInput;