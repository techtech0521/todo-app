// ========================================
// UTILS - フィルター・ソート関連のユーティリティ関数
// ========================================

import type { Task, FilterOptions, SortOption } from '../types/task';
import { 
  sortByPriority, 
  sortByDueDate, 
  sortByCreatedAt, 
  sortByCustomOrder 
} from './taskUtils';

/**
 * タスクをフィルタリング
 * @param tasks - タスクの配列
 * @param filters - フィルター条件
 * @returns フィルタリングされたタスクの配列
 */
export const filterTasks = (tasks: Task[], filters: FilterOptions): Task[] => {
    return tasks.filter(task => {
        // カテゴリーフィルター
        if (filters.category !== 'all' && task.category !== filters.category) {
            return false;
        }

        // 優先度フィルター
        if (filters.priority !== 'all' && task.priority !== filters.priority) {
            return false;
        }

        // 完了状態フィルター
        if (filters.completed === 'active' && task.completed) {
            return false;
        }
        if (filters.completed === 'completed' && !task.completed) {
            return false;
        }

        // 検索クエリフィルター
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const titleMatch = task.title.toLowerCase().includes(query);
            const descriptionMatch = task.description?.toLowerCase().includes(query);
            const tagsMatch = task.tags.some(tag => tag.toLowerCase().includes(query));

            if (!titleMatch && !descriptionMatch && !tagsMatch) {
                return false;
            }
        }

        // タグフィルター
        if (filters.tags.length > 0) {
            const hasAllTags = filters.tags.every(filterTag => 
                task.tags.includes(filterTag)
            );
            if (!hasAllTags) {
                return false;
            }
        }

        return true;
    });
};

/**
 * タスクをソート
 * @param tasks - タスクの配列
 * @param sortBy - ソートオプション
 * @returns ソートされたタスクの配列
 */
export const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
    switch (sortBy) {
        case 'priority':
            return sortByPriority(tasks);
        case 'dueDate':
            return sortByDueDate(tasks);
        case 'createdAt':
            return sortByCreatedAt(tasks);
        case 'custom':
            return sortByCustomOrder(tasks);
        default:
            return tasks;
    }
};

/**
 * タスクをフィルタリングしてソート
 * @param tasks - タスクの配列
 * @param filters - フィルター条件
 * @param sortBy - ソートオプション
 * @returns フィルタリング・ソートされたタスクの配列
 */
export const filterAndSortTasks = (
    tasks: Task[],
    filters: FilterOptions,
    sortBy: SortOption
): Task[] => {
    const filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, sortBy);
};

/**
 * 完了タスクを下に移動
 * @param task - タスクの配列
 * @returns 並び替えられたタスクの配列
 */
export const moveCompletedToBottom = (tasks: Task[]): Task[] => {
    const activeTasks = tasks.filter(t => !t.completed);
    const completedTasks  = tasks.filter(t => t.completed);
    return [...activeTasks, ...completedTasks];
}