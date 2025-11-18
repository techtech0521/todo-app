// ========================================
// COMPONENT - ユーザー情報カード
// ========================================

import React from 'react';
import type { User } from '../../types/task';
import { calculateLevel, calculateProgress } from '../../utils/gamificationUtils';
import { Trophy, Flame, Target } from 'lucide-react';

interface UserInfoCardProps {
    user: User;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
    const { level, expForNext, currentLevelExp } = calculateLevel(user.exp);
    const progress = calculateProgress(currentLevelExp, expForNext);

    return (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                        {level}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Level {level}</h2>
                        <p className="text-purple-100 text-sm">タスクマスター</p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    {/* 連続達成日数 */}
                    <div className="text-center">
                        <div className="flex items-center gap-1 justify-center mb-1">
                            <Flame className="text-orange-300" size={20} />
                            <span className="text-2xl font-bold">{user.streak}</span>
                        </div>
                        <p className="text-xs text-purple-100">連続達成</p>
                    </div>

                    {/* 最高記録 */}
                    <div className="text-center">
                        <div className="flex items-center gap-1 justify-center mb-1">
                            <Trophy className="text-yellow-300" size={20} />
                            <span className="text-2xl font-bold">{user.maxStreak}</span>
                        </div>
                        <p className="text-xs text-purple-100">最高記録</p>
                    </div>

                    {/* 累計完了 */}
                    <div className="text-center">
                        <div className="flex items-center gap-1 justify-center mb-1">
                            <Target className="text-green-300" size={20} />
                            <span className="text-2xl font-bold">{user.totalCompleted}</span>
                        </div>
                        <p className="text-xs text-purple-100">累計完了</p>
                    </div>
                </div>
            </div>

            {/* 経験値バー */}
            <div>
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium">EXP: {currentLevelExp} / {expForNext}</span>
                    <span className="font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                    <div
                        className="bg-gradient-to-r from-yellow-300 to-orange-400 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end px-2"
                        style={{ width: `${progress}%` }}
                    >
                        {progress > 10 && (
                            <span className="text-xs font-bold text-purple-900">⭐</span>
                        )}
                    </div>
                </div>
                <p className="text-xs text-purple-100 mt-2 text-center">
                    次のレベルまで あと {expForNext - currentLevelExp} EXP
                </p>
            </div>
        </div>
    );
};

export default UserInfoCard;