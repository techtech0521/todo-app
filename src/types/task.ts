// ========================================
// TYPES - 型定義
// ========================================

/**
 * 優先度の型
 */
export type Priority = 'high' | 'medium' | 'low';

/**
 * カテゴリーの型
 */
export type Category = 'work' | 'personal' | 'study';

/**
 * タスクの型定義
 */
export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: Priority;
    category: Category;
    dueDate: string | null; // 期限（ISO 8601形式）
    estimatedTime: number | null;
    tags: string[];
    createdAt: string; // ISO 8601形式の日時文字列
    order: number;
    completedAt: string | null;
    emotion: Emotion | null;
}

/**
 * タスクの統計情報の型定義
 */
export interface TaskStats {
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    completionRate: number;
    byPriority: {
        high: number;
        medium: number;
        low: number;
    };
    byCategory: {
        work: number;
        personal: number;
        study: number;
    };
}

/**
 * タスクの作成パラメータ（idとcreatedAtは自動生成）
 */
export type CreateTaskParams = {
    title: string;
    description?: string;
    priority?: Priority;
    category?: Category;
    dueDate?: string | null; // 期限（ISO 8601形式）
    estimatedTime?: number | null;
    tags?: string[];
}

/**
 * タスクの更新パラメータ
 */
export type UpdateTaskParams = Partial<Omit<Task, 'id' | 'createdAt'>>;

/**
 * フィルター条件の型
 */
export interface FilterOptions {
    category: Category | 'all';
    priority: Priority | 'all';
    completed: 'all' | 'active' | 'completed';
    searchQuery: string;
    tags: string[];
}

/**
 * ソートオプションの型
 */
export type SortOption = 'priority' | 'dueDate' | 'createdAt' | 'custom';

/**
 * ユーザーの型定義（ゲーミフィケーション用）
 */
export interface User {
    level: number;
    exp: number;
    streak: number;              // 現在の連続達成日数
    maxStreak: number;            // 最高連続達成日数
    lastCompletedDate: string | null;  // 最後にタスクを完了した日（YYYY-MM-DD）
    totalCompleted: number;       // 累計完了タスク数
}

/**
 * タスク完了時の報酬情報
 */
export interface TaskReward {
    baseExp: number;
    bonusExp: number;
    totalExp: number;
    bonusReasons: string[];
    leveledUp: boolean;
    newLevel?: number;
    streakIncreased: boolean;
    newStreak?: number;
}

/**
 * 感情の型
 */
export type Emotion = '😊' | '😎' | '💪' | '😴' | '😤' | '🤔' | '🎉' | '😌';
