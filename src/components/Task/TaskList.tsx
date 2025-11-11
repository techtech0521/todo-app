// ========================================
// COMPONENT - タスクリスト
// ========================================

import React , { useState } from 'react';
import TaskItem from './TaskItem';
import type { Task } from '../../types/task';

interface TaskListProps {
    tasks: Task[];
    onToggleComplete: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onReorder: (draggedId: string, targetId: string) => void;
};

const TaskList: React.FC<TaskListProps> = ({
    tasks,
    onToggleComplete,
    onEdit,
    onDelete,
    onReorder
}) => {
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
    
    const handleDragStart = (id: string) => {
        setDraggedTaskId(id);
    };

    const handleDragOver = (id: string) => {
        if (draggedTaskId && draggedTaskId !== id) {
            setDragOverTaskId(id);
        }
    };

    const handleDrop = (targetId: string) => {
        if (draggedTaskId && draggedTaskId !== targetId) {
            onReorder(draggedTaskId, targetId);
        }
        handleDragEnd();
    };

    const handleDragEnd = () => {
        setDraggedTaskId(null);
        setDragOverTaskId(null);
    };

    if (tasks.length === 0) {
        return (
            <div className='bg-white rounded-lg shadow-md p-12 text-center'>
                <p className="text-gray-400 text-lg">タスクがありません</p>
                <p className='text-gray-400 text-sm mt-2'>
                    上の入力欄からタスクを追加してみましょう！
                </p>
            </div>
        );
    }

    return (
        <div className='space-y-3'>
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                    isDragging={task.id === draggedTaskId}
                />
            ))}
        </div>
    );
};

export default TaskList;