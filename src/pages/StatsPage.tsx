// ========================================
// PAGE - 統計ページ
// ========================================

import React, { useMemo } from 'react';
import { ArrowLeft, Trophy, TrendingUp, Target, Heart } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Task, User } from '../types/task';
import {
    getCategoryStats,
    getPriorityStats,
    getEmotionStats,
    getWeeklyCompletionData,
} from '../utils/statsUtils';
import { calculateTaskStats } from '../utils/taskUtils';

interface StatsPageProps {
    tasks: Task[];
    user: User;
    onNavigateToMain: () => void;
}

const StatsPage: React.FC<StatsPageProps> = ({ tasks, user, onNavigateToMain }) => {
    // 統計データを計算
    const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);
    const categoryData = useMemo(() => getCategoryStats(tasks), [tasks]);
    const priorityData = useMemo(() => getPriorityStats(tasks), [tasks]);
    const emotionData = useMemo(() => getEmotionStats(tasks), [tasks]);
    const weeklyData = useMemo(() => getWeeklyCompletionData(tasks), [tasks]);

    // 実績バッジの判定
    const achievements = [
        { 
            id: 'first_complete', 
            name: '初めての完了', 
            icon: '🎉', 
            unlocked: user.totalCompleted >= 1 
        },
        { 
            id: 'complete_10', 
            name: '10タスク達成', 
            icon: '⭐', 
            unlocked: user.totalCompleted >= 10 
        },
        { 
            id: 'complete_50', 
            name: '50タスク達成', 
            icon: '🌟', 
            unlocked: user.totalCompleted >= 50 
        },
        { 
            id: 'complete_100', 
            name: '100タスク達成', 
            icon: '💯', 
            unlocked: user.totalCompleted >= 100 
        },
        { 
            id: 'streak_3', 
            name: '3日連続', 
            icon: '🔥', 
            unlocked: user.maxStreak >= 3 
        },
        { 
            id: 'streak_7', 
            name: '1週間連続', 
            icon: '🚀', 
            unlocked: user.maxStreak >= 7 
        },
        { 
            id: 'streak_30', 
            name: '1ヶ月連続', 
            icon: '👑', 
            unlocked: user.maxStreak >= 30 
        },
        { 
            id: 'level_5', 
            name: 'レベル5到達', 
            icon: '🎖️', 
            unlocked: user.level >= 5 
        },
        { 
            id: 'level_10', 
            name: 'レベル10到達', 
            icon: '🏆', 
            unlocked: user.level >= 10 
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto p-6">
                {/* ヘッダー */}
                <header className="mb-8">
                    <button
                        onClick={onNavigateToMain}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        戻る
                    </button>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        📊 統計ダッシュボード
                    </h1>
                    <p className="text-gray-600">あなたの進捗を確認しましょう</p>
                </header>

                {/* サマリーカード */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">総タスク数</span>
                            <Target className="text-blue-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-gray-800">{tasks.length}</div>
                        <p className="text-xs text-gray-500 mt-1">完了: {stats.completedTasks}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">完了率</span>
                            <TrendingUp className="text-green-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-green-600">{stats.completionRate}%</div>
                        <p className="text-xs text-gray-500 mt-1">
                            {stats.activeTasks}件 進行中
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">現在のレベル</span>
                            <Trophy className="text-yellow-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-purple-600">{user.level}</div>
                        <p className="text-xs text-gray-500 mt-1">EXP: {user.exp}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">最高連続</span>
                            <Heart className="text-red-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-orange-600">{user.maxStreak}日</div>
                        <p className="text-xs text-gray-500 mt-1">
                            現在: {user.streak}日
                        </p>
                    </div>
                </div>

                {/* 週次完了グラフ */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        📈 週次完了タスク数
                    </h2>
                    {weeklyData.some(d => d.completed > 0) ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={weeklyData}>
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="completed" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            まだデータがありません。タスクを完了して統計を確認しましょう！
                        </div>
                    )}
                </div>

                {/* グラフエリア */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* カテゴリー別円グラフ */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            📁 カテゴリー別タスク
                        </h2>
                        {categoryData.some(d => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => {
                                            if (percent === undefined || percent === 0) return '';
                                            return `${name}: ${(percent * 100).toFixed(0)}%`;
                                        }}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400">
                                データなし
                            </div>
                        )}
                    </div>

                    {/* 優先度別円グラフ */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            ⚡ 優先度別タスク
                        </h2>
                        {priorityData.some(d => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={priorityData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => {
                                            if (percent === undefined || percent === 0) return '';
                                            return `${name}: ${(percent * 100).toFixed(0)}%`;
                                        }}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400">
                                データなし
                            </div>
                        )}
                    </div>
                </div>

                {/* 感情記録エリア */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        😊 感情記録
                    </h2>
                    {emotionData.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {emotionData.map(({ emotion, count }) => (
                                <div key={emotion} className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg">
                                    <span className="text-3xl">{emotion}</span>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-800">{count}</p>
                                        <p className="text-xs text-gray-500">回</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center text-gray-400">
                            タスク完了時に感情を記録すると、ここに表示されます
                        </div>
                    )}
                </div>

                {/* 実績バッジエリア */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        🏆 実績バッジ
                    </h2>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
                        {achievements.map(achievement => (
                            <div
                                key={achievement.id}
                                className={`text-center p-4 rounded-lg transition-all ${
                                    achievement.unlocked
                                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300'
                                        : 'bg-gray-100 opacity-40'
                                }`}
                            >
                                <div className="text-4xl mb-2">{achievement.icon}</div>
                                <p className="text-xs font-medium text-gray-700">{achievement.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsPage;