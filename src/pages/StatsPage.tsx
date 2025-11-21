// ========================================
// PAGE - 統計ページ
// ========================================

import React from 'react';
import { ArrowLeft, Trophy, TrendingUp, Target, Heart } from 'lucide-react';
import type { Task, User } from '../types/task';

interface StatsPageProps {
    onNavigateToMain: () => void;
}

const StatsPage: React.FC<StatsPageProps> = ({ onNavigateToMain }) => {
    const tasks: Task[] = [];
    const user: User = {
        level: 1,
        exp: 0,
        streak: 0,
        maxStreak: 0,
        lastCompletedDate: null,
        totalCompleted: 0
    };

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
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">完了率</span>
                            <TrendingUp className="text-green-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-green-600">0%</div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">現在のレベル</span>
                            <Trophy className="text-yellow-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-purple-600">{user.level}</div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">最高連続</span>
                            <Heart className="text-red-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-orange-600">{user.maxStreak}日</div>
                    </div>
                </div>

                {/* グラフエリア（次のステップで実装） */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            カテゴリー別タスク
                        </h2>
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            グラフを準備中...
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            優先度別タスク
                        </h2>
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            グラフを準備中...
                        </div>
                    </div>
                </div>

                {/* 感情記録エリア */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        😊 感情記録
                    </h2>
                    <div className="h-32 flex items-center justify-center text-gray-400">
                        データを準備中...
                    </div>
                </div>

                {/* 実績バッジエリア */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        🏆 実績バッジ
                    </h2>
                    <div className="h-32 flex items-center justify-center text-gray-400">
                        実績を準備中...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsPage;