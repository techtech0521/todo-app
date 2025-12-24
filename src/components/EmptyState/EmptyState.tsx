import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
    onCreateTask: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateTask }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[40vh] py-12 px-4">
            <div className="mb-6">
                {/* シンプルなSVGアニメーション */}
                <svg
                    width="160"
                    height="160"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="animate-bounce"
                >
                    <rect x="2" y="3" width="20" height="14" rx="2" fill="#E0F2FE" />
                    <path d="M7 9h10M7 12h6" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="18" cy="6" r="2" fill="#C7F9D6" />
                </svg>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">タスクがありません</h2>
            <p className="text-gray-600 text-center mb-6 max-w-md">
                最初のタスクを作成して、生産的な一日を始めましょう。サンプルタスクやテンプレートも用意しています。
            </p>

            <div className="flex gap-3">
                <button
                    onClick={onCreateTask}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
                >
                    <Plus size={18} />
                    新しいタスクを追加
                </button>
            </div>

            <div className="mt-8 w-full max-w-sm bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-medium mb-2">こんなタスクから始めてみては？</p>
                <ul className="space-y-1">
                    <li>・ 朝のルーティンを30分</li>
                    <li>・ メールチェック</li>
                    <li>・ 30分の学習時間</li>
                </ul>
            </div>
        </div>
    );
};

export default EmptyState;