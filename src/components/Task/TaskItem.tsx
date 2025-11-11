// ========================================
// COMPONENT - タスクアイテム
// ========================================

import React, { useState } from 'react';
import { Trash2, Edit2, Check, Calendar, Clock, Tag, GripVertical } from 'lucide-react';
import type { Task } from '../../types/task';
import { PRIORITIES, CATEGORIES } from '../../constants';
import { formatDate, formatEstimatedTime, isOverdue } from '../../utils/taskUtils';

interface TaskItemProps {
    task: Task;
    onToggleComplete: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onDragStart?: (id: string) => void;
    onDragOver?: (id: string) => void;
    onDragEnd?: () => void;
    onDrop?: (id: string) => void;
    isDragging?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
    task, 
    onToggleComplete, 
    onEdit,
    onDelete,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDrop,
    isDragging = false 
}) => {
    const [isHovering, setIsHovering] = useState(false);

    const priorityInfo = PRIORITIES.find(p => p.id === task.priority);
    const categoryInfo = CATEGORIES.find(c => c.id === task.category);
    const overdue = isOverdue(task.dueDate);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
        if (onDragStart) {
            onDragStart(task.id);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (onDragOver) {
            onDragOver(task.id);
        }
    };

    const handleDragEnd = () => {
        if (onDragEnd) {
            onDragEnd();
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (onDrop) {
            onDrop(task.id);
        }
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`bg-white rounded-lg shadow-md p-4 transition-all cursor-move ${
                task.completed ? 'opacity-60' : ''
            } ${overdue && !task.completed ? 'border-l-4 border-red-500' : ''} ${
                isDragging ? 'opacity-30 scale-95' : ''
            } hover:shadow-lg`}
        >
            <div className="flex items-start gap-3">
                {/* ドラッグハンドル */}
                <div className={`flex-shrink-0 mt-1 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-30'}`}>
                    <GripVertical size={20} className="text-gray-400" />
                </div>

                {/* チェックボックス */}
                <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors mt-1 ${
                        task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                    aria-label={task.completed ? 'タスクを未完了にする' : 'タスクを完了にする'}
                >
                    {task.completed && <Check size={16} className="text-white" />}
                </button>

                {/* タスク情報 */}
                <div className="flex-1 min-w-0">
                    {/* タイトル */}
                    <h3
                        className={`text-lg font-medium ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}
                    >
                        {task.title}
                    </h3>

                    {/* 説明 */}
                    {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}

                    {/* メタ情報 */}
                    <div className="flex flex-wrap gap-3 mt-2 text-sm">
                        {/* 優先度 */}
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                            priorityInfo?.id === 'high' ? 'bg-red-100 text-red-700' :
                            priorityInfo?.id === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                            {priorityInfo?.emoji} {priorityInfo?.label}
                        </span>

                        {/* カテゴリー */}
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                            categoryInfo?.id === 'work' ? 'bg-blue-100 text-blue-700' :
                            categoryInfo?.id === 'study' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            📁 {categoryInfo?.label}
                        </span>

                        {/* 期限 */}
                        {task.dueDate && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                                overdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                                <Calendar size={14} />
                                {formatDate(task.dueDate)}
                                {overdue && ' (期限切れ)'}
                            </span>
                        )}

                        {/* 予想時間 */}
                        {task.estimatedTime && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                <Clock size={14} />
                                {formatEstimatedTime(task.estimatedTime)}
                            </span>
                        )}
                    </div>

                    {/* タグ */}
                    {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {task.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs"
                                >
                                    <Tag size={12} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* アクションボタン */}
                <div className="flex gap-2 flex-shrink-0">
                    <button
                        onClick={() => onEdit(task)}
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
                </div>
            </div>
        </div>
    );
};

export default TaskItem;