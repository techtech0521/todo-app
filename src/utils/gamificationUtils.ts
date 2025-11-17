// ========================================
// UTILS - ゲーミフィケーション関連のユーティリティ関数
// ========================================

import type { Task, User, TaskReward } from '../types/task';

/**
 * タスク完了時の獲得経験値を計算
 * @param task - 完了したタスク
 * @returns 報酬情報 
 */
export const calculateReward = (task: Task): TaskReward => {
    let baseExp = 50;
    let bonusExp = 0;
    const bonusReasons: string[] = [];

    // 優先度ボーナス
    if (task.priority === 'high') {
        bonusExp += 30;
        bonusReasons.push('高優先度 +30');
    } else if (task.priority === 'medium') {
        bonusExp += 15;
        bonusReasons.push('中優先度 +15');
    }

    // 期間限定ボーナス
    if (task.dueDate) {
        const now = new Date();
        const dueDate = new Date(task.dueDate);
        if (now <= dueDate) {
            bonusExp += 20;
            bonusReasons.push('期限内完了 +20');
        }
    }

    // 予想時間ボーナス（2時間以上）
    if (task.estimatedTime && task.estimatedTime >= 120) {
        bonusExp += 25;
        bonusReasons.push('大タスク完了 +25');
    }

    const totalExp = baseExp + bonusExp;

    return {
        baseExp,
        bonusExp,
        totalExp,
        bonusReasons,
        leveledUp: false,
        streakIncreased: false
    };
};

/**
 * レベルアップに必要な経験値を計算
 * @param level - 現在のレベル
 * @returns 次のレベルに必要な経験値
 */
export const expForNextLevel = (level: number): number => {
    return level * 500;
};

/**
 * 経験値からレベルを計算
 * @param exp - 現在の経験値
 * @returns レベルと次のレベルまでの必要経験値
 */
export const calculateLevel = (exp: number): {level: number; expForNext: number; currentLevelExp: number } => {
    let level = 1;
    let totalExpNeeded = 0;
    let expForNext = expForNextLevel(level);

    while (exp >= totalExpNeeded + expForNext) {
        totalExpNeeded += expForNext;
        level++;
        expForNext = expForNextLevel(level);
    }

    const currentLevelExp = exp - totalExpNeeded;

    return { level, expForNext, currentLevelExp };
};

/**
 * ユーザーに経験値を追加してレベルアップを処理
 * @param user - ユーザー情報
 * @param expGained - 獲得経験値
 * @returns 更新されたユーザー情報とレベルアップしたか
 */
export const addExp = (user: User, expGained: number): { user: User; leveledUp: boolean; newLevel?: number} => {
    const oldLevel = calculateLevel(user.exp).level;
    const newExp = user.exp + expGained;
    const newLevel = calculateLevel(newExp).level;
    const leveledUp = newLevel > oldLevel;

    return {
        user: {
            ...user,
            exp: newExp,
            level: newLevel
        },
        leveledUp,
        newLevel: leveledUp ? newLevel : undefined
    };
};

/**
 * ストリーク（連続達成日数）を更新
 * @param user - ユーザー情報
 * @returns 更新されたユーザー情報とストリークが増えたか
 */
export const updateStreak = (user: User): { user: User; streakIncreased: boolean; newStreak: number} => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastDate = user.lastCompletedDate;

    // 今日既にタスクを完了している場合
    if (lastDate === today) {
        return {
            user,
            streakIncreased: false,
            newStreak: user.streak
        };
    }

    // 昨日タスクを完了していた場合（連続）
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak: number;
    let streakIncreased: boolean;

    if (lastDate === yesterdayStr) {
        // 連続達成
        newStreak = user.streak += 1;
        streakIncreased = true;
    } else if (lastDate === null) {
        // 初めてのタスク完了
        newStreak = 1;
        streakIncreased = true;
    } else {
        // ストリーク途切れ
        newStreak = 1;
        streakIncreased = true;
    }

    const newMaxStreak = Math.max(newStreak, user.maxStreak);
    
    return {
        user: {
            ...user,
            streak: newStreak,
            maxStreak: newMaxStreak,
            lastCompletedDate: today,
            totalCompleted: user.totalCompleted + 1
        },
        streakIncreased,
        newStreak
    };
}

/**
 * タスク完了時の処理（経験値とストリーク）
 * @param user - ユーザー情報
 * @param task - 完了したタスク
 * @returns 更新されたユーザー情報と報酬情報
 */
export const completeTask = (user: User, task: Task): { user: User; reward: TaskReward } => {
    // 経験値計算
    const reward = calculateReward(task);
    const { user: userWithExp, leveledUp, newLevel  } = addExp(user, reward.totalExp);

    // ストリーク更新
    const { user: updatedUser, streakIncreased, newStreak } = updateStreak(userWithExp);

    // 報酬情報を更新
    const finalReward: TaskReward = {
        ...reward,
        leveledUp,
        newLevel,
        streakIncreased,
        newStreak
    };

    return {
        user: updatedUser,
        reward: finalReward
    };
};

/**
 * 進捗パーセンテージを計算
 * @param currentExp - 現在のレベル内での経験値
 * @param expForNot - 次のレベルに必要な経験値
 * @returns パーセンテージ（0-100）
 */
export const calculateProgress = (currentExp: number, expForNext: number): number => {
    return Math.round((currentExp / expForNext) * 100);
};
