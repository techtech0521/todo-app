// ========================================
// COMPONENT - タスク入力フォーム
// ========================================

import React, { useState } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { Plus } from 'lucide-react';
import Button from '../common/Button';

interface TaskInputProps {
    onAddTask: (title: string) => void;
};

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
    const [title, setTitle] = useState<string>('');

    const hundleSubmit = (): void => {
        if (title.trim() === '') return;
        onAddTask(title);
        setTitle('');
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            hundleSubmit();
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setTitle(e.target.value);
    };

    return (
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <div className='flex gap-2'>
                <input 
                    type="text"
                    value={title}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    placeholder='新しいタスクを追加...'
                    className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <Button onClick={hundleSubmit} variant='primary'>
                    <Plus size={20} />
                    追加
                </Button>
            </div>
        </div>
    );
};

export default TaskInput;