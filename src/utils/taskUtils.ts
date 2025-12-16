// ========================================
// UTILS - タスク関連のユーティリティ関数
// ========================================

import type {Task, TaskStats, CreateTaskParams, UpdateTaskParams, Priority } from '../types/task';

/**
 * タスクの統計情報を計算
 * @param tasks - タスクの配列
 * @returns 統計情報
 */
export const calculateTaskStats = (tasks: Task[]): TaskStats => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 優先度別の集計
    const byPriority = {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length,
    };

    // カテゴリー別の集計
    const byCategory = {
        work: tasks.filter(t => t.category === 'work').length,
        personal: tasks.filter(t => t.category === 'personal').length,
        study: tasks.filter(t => t.category === 'study').length,
    };

    return {
        totalTasks,
        completedTasks,
        activeTasks: totalTasks - completedTasks,
        completionRate,
        byPriority,
        byCategory
    };
};

/**
 * 新しいタスクを作成
 * @param params - タスクのタイトル
 * @returns 新しいタスクオブジェクト
 */
export const createTask = (params: CreateTaskParams): Task => {
    const now = new Date().toISOString();

    return {
        id: Date.now().toString(),
        title: params.title.trim(),
        description: params.description?.trim() || '',
        completed: false,
        priority: params.priority || 'medium',
        category: params.category || 'personal',
        dueDate: params.dueDate || null,
        estimatedTime: params.estimatedTime || null,
        tags: params.tags || [],
        createdAt: now,
        order: Date.now(),
        completedAt: null,
        emotion: null
    };
};

/**
 * タスクを更新
 * @param tasks - タスクの配列
 * @param id - 対象タスクのID
 * @param updates - 更新内容
 * @returns 更新されたタスクの配列
 */
export const updateTask = (tasks: Task[], id: string, updates: UpdateTaskParams): Task[] => {
    return tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
    );
};

/**
 * タスクを削除
 * @param tasks - タスクの配列
 * @param id - 対象タスクのID
 * @returns 更新されたタスクの配列
 */
export const deleteTask = (tasks: Task[], id: string): Task[] => {
    return tasks.filter(task => task.id !== id);
};

/**
 * 優先度に基づいてソート（高→中→低）
 */
export const sortByPriority = (tasks: Task[]): Task[] => {
    const priorityOrder: Record<Priority, number> = {
        high: 0,
        medium: 1,
        low: 2
    };
    
    return [...tasks].sort((a, b) => 
        priorityOrder[a.priority] - priorityOrder[b.priority]
    );
};

/**
 * 期限に基づいてソート（近い順）
 */

export const sortByDueDate = (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
};

/**
 * 作成日時に基づいてソート（新しい順）
 */
export const sortByCreatedAt = (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

/**
 * カスタム順序でソート（order プロパティ）
 */
export const sortByCustomOrder = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => a.order - b.order);
};

/**
 * 期限が過ぎているかチェック
 */
export const isOverdue = (dueDate: string | null): boolean => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
};

/**
 * 予想時間を人間が読める形式に変換
 */
export const formatEstimatedTime = (minutes: number |null): string => {
    if (!minutes) return '';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
        return `${hours}時間${mins}分`;
    } else if (hours > 0) {
        return `${hours}時間`;
    } else {
        return `${mins}分`;
    } 
};

/**
 * 日付を人間が読める形式に変換
 */
export const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '明日';
    if (diffDays === -1) return '昨日';
    if (diffDays < 0) return `${Math.abs(diffDays)}日前`;
    if (diffDays < 7) return `${diffDays}日後`;

    return date.toLocaleDateString('ja-JP', { 
        month: 'short', 
        day: 'numeric' 
    });
};