// ========================================
// COMPONENT - タスク入力フォーム
// ========================================

import React from 'react';
import { Plus } from 'lucide-react';

interface TaskInputProps {
    onOpenModal: () => void;
};

const TaskInput: React.FC<TaskInputProps> = ({ onOpenModal }) => {
    return (
        <button
            onClick={onOpenModal}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg'
        >
            <Plus size={20} />
            新しいタスク
        </button>
    );
};

export default TaskInput;