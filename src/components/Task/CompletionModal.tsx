// ========================================
// COMPONENT - タスク完了モーダル
// ========================================

import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import type { TaskReward, Emotion } from '../../types/task';
import { Sparkles, TrendingUp, Flame } from 'lucide-react';

interface CompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    reward: TaskReward;
    onEmotionSelect: (emotion: Emotion) => void;
}

const EMOTIONS: Emotion[] = ['😊', '😎', '💪', '😴', '😤', '🤔', '🎉', '😌'];

const CompletionModal: React.FC<CompletionModalProps> = ({
    isOpen,
    onClose,
    reward,
    onEmotionSelect
}) => {
    const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);

    const handleEmotionClick = (emotion: Emotion) => {
        setSelectedEmotion(emotion);
    };

    const handleContinue = () => {
        if (selectedEmotion) {
            onEmotionSelect(selectedEmotion);
        }
        onClose();
        setSelectedEmotion(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleContinue} title="">
            <div className="text-center py-4">
                {/* お祝いメッセージ */}
                <div className="mb-6">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        タスク完了！
                    </h2>
                    <p className="text-gray-600">おめでとうございます！</p>
                </div>

                {/* 経験値獲得 */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="text-yellow-500" size={24} />
                        <span className="text-4xl font-bold text-orange-600">
                            +{reward.totalExp} EXP
                        </span>
                    </div>
                    
                    {/* ボーナス詳細 */}
                    {reward.bonusReasons.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-sm text-gray-600 mb-2">ボーナス:</p>
                            {reward.bonusReasons.map((reason, index) => (
                                <p key={index} className="text-sm text-orange-600 font-medium">
                                    ✨ {reason}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* レベルアップ */}
                {reward.leveledUp && reward.newLevel && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6 border-2 border-purple-300">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="text-purple-500" size={28} />
                            <span className="text-3xl font-bold text-purple-600">
                                Level UP!
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-indigo-600">
                            Level {reward.newLevel}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            新しいレベルに到達しました！
                        </p>
                    </div>
                )}

                {/* ストリーク */}
                {reward.streakIncreased && reward.newStreak && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center gap-2">
                            <Flame className="text-orange-500" size={24} />
                            <span className="text-xl font-bold text-orange-600">
                                {reward.newStreak}日連続達成！
                            </span>
                            <Flame className="text-orange-500" size={24} />
                        </div>
                        {reward.newStreak > 1 && (
                            <p className="text-sm text-gray-600 mt-2">
                                素晴らしい継続力です！
                            </p>
                        )}
                    </div>
                )}

                {/* 感情選択 */}
                <div className="mb-6">
                    <p className="text-gray-700 font-medium mb-4">
                        今日の気分はどうでしたか？
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap">
                        {EMOTIONS.map(emotion => (
                            <button
                                key={emotion}
                                onClick={() => handleEmotionClick(emotion)}
                                className={`text-4xl p-3 rounded-lg transition-all transform hover:scale-110 ${
                                selectedEmotion === emotion
                                    ? 'bg-blue-100 ring-4 ring-blue-400 scale-110'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {emotion}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ボタン */}
                <Button
                    onClick={handleContinue}
                    variant="primary"
                    className="w-full"
                >
                    続ける
                </Button>
            </div>
        </Modal>
    );
};

export default CompletionModal;