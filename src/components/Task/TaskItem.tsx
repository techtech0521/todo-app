// ========================================
// COMPONENT - タスクアイテム
// ========================================

import React, { useState } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import type { Task, UpdateTaskParams } from '../../types/task';

interface TaskItemProps {
    task: Task;
    onToggleComplete: (id: string) => void;
    onUpdate: (id: string, update: UpdateTaskParams) => void;
    onDelete: (id: string) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({
    task,
    onToggleComplete,
    onUpdate,
    onDelete
}) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editTitle, setEditTitle] = useState<string>(task.title);

    const handleSave = (): void => {
        if (editTitle.trim() === '') return;
        onUpdate(task.id, { title: editTitle });
        setIsEditing(false);
    };

    const handleCancel = (): void => {
        setEditTitle(task.title);
        setIsEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setEditTitle(e.target.value);
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-4 transition-all ${
                task.completed ? 'opacity-60' : ''
            }`}
        >
            <div className='flex items-center gap-3'>
                {/* チェックボックス */}
                <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                    aria-label={task.completed ? 'タスクを未完了にする' : 'タスクを完了にする'}
                >
                    {task.completed && <Check size={16} className="text-white" />}
                </button>

                {/* タスクタイトル */}
                {isEditing ? (
                    <input
                        type="text"
                        value={editTitle}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                    ) : (
                    <span
                        className={`flex-1 text-gray-800 ${
                        task.completed ? 'line-through text-gray-500' : ''
                        }`}
                    >
                        {task.title}
                    </span>
                    )}

                {/* アクションボタン */}
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                        <button
                            onClick={handleSave}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="保存"
                            aria-label="保存"
                        >
                            <Check size={18} />
                        </button>
                        <button
                            onClick={handleCancel}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="キャンセル"
                            aria-label="キャンセル"
                        >
                            <X size={18} />
                        </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="編集"
                                aria-label="編集"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => onDelete(task.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="削除"
                                aria-label="削除"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskItem;