// ========================================
// COMPONENT - ヘッダー
// ========================================

import React from 'react';
import { APP_NAME, APP_DESCRIPTION } from '../../constants';

const Header: React.FC = () => {
    return (
        <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                🎮 {APP_NAME}
            </h1>
            <p className="text-gray-600">{APP_DESCRIPTION}</p>
        </header>
    );
};

export default Header;