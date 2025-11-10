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
    onReorder: (reorderedTasks: Task[]) => void;
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
      
            // タスクの順序を入れ替え
            const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
            const targetIndex = tasks.findIndex(t => t.id === id);
            
            if (draggedIndex !== -1 && targetIndex !== -1) {
                const newTasks = [...tasks];
                const [draggedTask] = newTasks.splice(draggedIndex, 1);
                newTasks.splice(targetIndex, 0, draggedTask);
                
                // order プロパティを更新
                const reorderedTasks = newTasks.map((task, index) => ({
                    ...task,
                    order: Date.now() + index
                }));
        
                onReorder(reorderedTasks);
            }
        }
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
                    isDragging={task.id === draggedTaskId}
                />
            ))}
        </div>
    );
};

export default TaskList;