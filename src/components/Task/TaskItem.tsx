// ========================================
// COMPONENT - タスクアイテム（カード型）
// ========================================

import React from 'react';
import { Trash2, Edit2, Check, Calendar, Clock } from 'lucide-react';
import type { Task } from '../../types/task';
import { PRIORITIES, CATEGORIES } from '../../constants';
import { formatDate, formatEstimatedTime, isOverdue } from '../../utils/taskUtils';

interface TaskItemProps {
    task: Task;
    onToggleComplete: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
    task, 
    onToggleComplete, 
    onEdit,
    onDelete
}) => {
    const priorityInfo = PRIORITIES.find(p => p.id === task.priority);
    const categoryInfo = CATEGORIES.find(c => c.id === task.category);
    const overdue = isOverdue(task.dueDate);

    return (
        <div
            className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 h-full flex flex-col ${
                task.completed ? 'opacity-60' : ''
            } ${overdue && !task.completed ? 'border-l-4 border-red-500' : ''}`}
        >
            {/* ヘッダー（チェックボックスとアクション） */}
            <div className="flex items-start justify-between mb-3">
                <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-green-400'
                    }`}
                    aria-label={task.completed ? 'タスクを未完了にする' : 'タスクを完了にする'}
                >
                    {task.completed && <Check size={14} className="text-white" />}
                </button>

                <div className="flex gap-1">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="編集"
                        aria-label="編集"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="削除"
                        aria-label="削除"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* タイトルと感情 */}
            <div className="flex-1 mb-3">
                <h3
                    className={`text-base font-medium mb-2 line-clamp-2 ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                    title={task.title}
                >
                    {task.title}
                    {task.completed && task.emotion && (
                        <span className="ml-2 text-xl">{task.emotion}</span>
                    )}
                </h3>

                {/* 説明（1行のみ） */}
                {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-1" title={task.description}>
                        {task.description}
                    </p>
                )}
            </div>

            {/* メタ情報 */}
            <div className="space-y-2">
                {/* 優先度とカテゴリー */}
                <div className="flex gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        priorityInfo?.id === 'high' ? 'bg-red-100 text-red-700' :
                        priorityInfo?.id === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                        {priorityInfo?.emoji} {priorityInfo?.label}
                    </span>

                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                        categoryInfo?.id === 'work' ? 'bg-blue-100 text-blue-700' :
                        categoryInfo?.id === 'study' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                        {categoryInfo?.label}
                    </span>
                </div>

                {/* 期限と時間 */}
                {(task.dueDate || task.estimatedTime) && (
                    <div className='flex flex-wrap gap-2 text-xs text-gray-600'>
                        {task.dueDate && (
                            <span className={`inline-flex items-center gap-1 ${overdue ? 'text-red-600 font-medium' : ''}`}>
                                <Calendar size={10} />
                                {formatDate(task.dueDate)}
                            </span>
                        )}
                        {task.estimatedTime && (
                            <span className="inline-flex items-center gap-1">
                                <Clock size={10} />
                                {formatEstimatedTime(task.estimatedTime)}
                            </span>
                        )}
                    </div>
                )}

                {/* タグ */}
                {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {task.tags.slice(0, 3).map(tag => (
                            <span
                                key={tag}
                                className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                        {task.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{task.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskItem;