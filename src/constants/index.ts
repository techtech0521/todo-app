// ========================================
// CONSTANTS - 定数定義
// ========================================

export const APP_NAME = 'GamiTask';
export const APP_DESCRIPTION = 'あなたのタスクを楽しく管理';

// カテゴリーの型定義(スプリント2で使用)
export interface Category {
    id: string;
    label: string;
    color: string;
}

// 優先度の型定義(スプリント2で使用)
export interface Priority {
    id: 'high' | 'medium' | 'low';
    label: string;
    color: string;
    emoji: string;
}

// 今後追加予定の変数
export const CATEGORIES: Category[] = [
    {id: 'work', label: '仕事', color: 'blue'},
    {id: 'personal', label: '個人', color: 'green'},
    {id: 'study', label: '勉強', color: 'purple'}
]

export const PRIORITIES: Priority[] = [
    {id: 'high', label: '高', color: 'red', emoji: '🔴'},
    {id: 'medium', label: '中', color: 'yellow', emoji: '🟡'},
    {id: 'low', label: '低', color: 'green', emoji: '🟢'}
]
