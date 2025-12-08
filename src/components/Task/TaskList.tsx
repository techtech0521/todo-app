// ========================================
// COMPONENT - タスクリスト（グリッド表示）
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
            <div className="col-span-full p-12 text-center">
                <p className="text-gray-400 text-lg">タスクがありません</p>
                <p className="text-gray-400 text-sm mt-2">
                    新しいタスクを追加してみましょう！
                </p>
            </div>
        );
    }

    return (
        <>
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
};

export default TaskList;