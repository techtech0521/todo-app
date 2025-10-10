// ========================================
// TYPES - 型定義
// ========================================

/**
 * タスクの型定義
 */
export interface Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string; // ISO 8601形式の日時文字列
}

/**
 * タスクの統計情報の型定義
 */
export interface TaskStats {
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    completionRate: number;
}

/**
 * タスクの作成パラメータ（idとcreatedAtは自動生成）
 */
export type CreateTaskParams = Omit<Task, 'id' | 'createdAt' | 'completed'>;

/**
 * タスクの更新パラメータ
 */
export type UpdateTaskParams = Partial<Omit<Task, 'id' | 'createdAt'>>;
