// ========================================
// APP - ルートコンポーネント
// ========================================

import React, { useState } from 'react';
import MainPage from './pages/MainPage';
import StatsPage from './pages/StatsPage';

type Page = 'main' | 'stats';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('main');
  
  return (
    <>
      {currentPage === 'main' && (
        <MainPage onNavigateToStats={() => setCurrentPage('stats')} />
      )}
      {currentPage === 'stats' && (
        <StatsPage onNavigateToMain={() => setCurrentPage('main')} />
      )}
    </>
  );
};

export default App;
