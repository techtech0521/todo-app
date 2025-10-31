// ========================================
// COMPONENT - タスクリスト
// ========================================

import React from 'react';
import TaskItem from './TaskItem';
import type { Task } from '../../types/task';

interface TaskListProps {
    tasks: Task[];
    onToggleComplete: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
};

const TaskList: React.FC<TaskListProps> = ({
    tasks,
    onToggleComplete,
    onEdit,
    onDelete
}) => {
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
                />
            ))}
        </div>
    );
};

export default TaskList;