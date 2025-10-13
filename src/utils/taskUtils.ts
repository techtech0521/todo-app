// ========================================
// UTILS - タスク関連のユーティリティ関数
// ========================================

import type {Task, TaskStats, CreateTaskParams, UpdateTaskParams } from '../types/task';

/**
 * タスクの統計情報を計算
 * @param tasks - タスクの配列
 * @returns 統計情報
 */
export const calculateTaskStats = (tasks: Task[]): TaskStats => {
    const totalTasks = calculateTaskStats.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
        totalTasks,
        completedTasks,
        activeTasks: totalTasks - completedTasks,
        completionRate
    };
};

/**
 * 新しいタスクを作成
 * @param params - タスクのタイトル
 * @returns 新しいタスクオブジェクト
 */
export const createTask = (params: CreateTaskParams): Task => {
    return {
        id: Date.now().toString(),
        title: params.title.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
};

/**
 * タスクの完了状態をトグル
 * @param tasks - タスクの配列
 * @param id - 対象タスクのID
 * @returns 更新されたタスクの配列
 */
export const toggleTaskComplete = (tasks: Task[], id: string): Task[] => {
    return tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
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