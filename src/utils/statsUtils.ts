// ========================================
// UTILS - 統計計算のユーティリティ関数
// ========================================

import type { Task } from '../types/task';

/**
 * カテゴリー別のタスク数を集計
 */
export const getCategoryStats = (tasks: Task[]) => {
    const stats = {
        work: 0,
        personal: 0,
        study: 0
    };

    tasks.forEach(task => {
        stats[task.category]++;
    })

    return [
        { name: '仕事', value: stats.work, color: '#3B82F6' },
        { name: '個人', value: stats.personal, color: '#10B981' },
        { name: '学習', value: stats.study, color: '#8B5CF6' }
    ];
};

/**
 * 優先度別のタスク数を集計
 */
export const getPriorityStats = (tasks: Task[]) => {
    const stats = {
        high: 0,
        medium: 0,
        low: 0
    };

    tasks.forEach(task => {
        stats[task.priority]++;
    });

    return [
        { name: '高', value: stats.high, color: '#EF4444' },
        { name: '中', value: stats.medium, color: '#F59E0B' },
        { name: '低', value: stats.low, color: '#10B981' }
    ];
};

/**
 * 感情記録を集計
 */
export const getEmotionStats = (tasks: Task[]) => {
    const emotionCounts: Record<string, number> = {};
    
    tasks.forEach(task => {
        if (task.completed && task.emotion) {
            emotionCounts[task.emotion] = (emotionCounts[task.emotion] || 0) + 1;
        }
    });

    return Object.entries(emotionCounts)
        .map(([emotion, count]) => ({ emotion, count }))
        .sort((a, b) => b.count - a.count);
};

/**
 * 週次の完了タスク数を計算（過去7週間）
 */
export const getWeeklyCompletionData = (tasks: Task[]) => {
    const weeks = 7;
    const now = new Date();
    const data = [];

    for (let i = weeks - 1; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7));
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        const completedInWeek = tasks.filter(task => {
            if (!task.completed || !task.completedAt) return false;
            const completedDate = new Date(task.completedAt);
            return completedDate >= weekStart && completedDate < weekEnd;
        }).length;

        const weekLabel = i === 0 ? '今週' : `${i}週前`;
        data.push({
            week: weekLabel,
            completed: completedInWeek
        });
    }

    return data;
};
