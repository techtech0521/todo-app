// ========================================
// COMPONENT - ヘッダー
// ========================================

import React from 'react';
import { APP_NAME, APP_DESCRIPTION } from '../../constants';
import { BarChart3 } from 'lucide-react';

interface HeaderProps {
    onNavigateToStats?: () => void;
    showStatsButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    onNavigateToStats,
    showStatsButton = false
}) => {
    return (
        <header className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    🎮 {APP_NAME}
                </h1>
                <p className="text-gray-600">{APP_DESCRIPTION}</p>
            </div>
        
            {showStatsButton && onNavigateToStats && (
                <button
                    onClick={onNavigateToStats}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-purple-600 font-medium"
                >
                    <BarChart3 size={20} />
                    統計
                </button>
            )}
        </header>
    );
};

export default Header;