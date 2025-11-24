// ========================================
// APP - ルートコンポーネント
// ========================================

import React, { useState } from 'react';
import MainPage from './pages/MainPage';
import StatsPage from './pages/StatsPage';
import type { Task, User } from './types/task';

type Page = 'main' | 'stats';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('main');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User>({  
    level: 1,
    exp: 0,
    streak: 0,
    maxStreak: 0,
    lastCompletedDate: null,
    totalCompleted: 0
  });
  
  return (
    <>
      {currentPage === 'main' && (
        <MainPage 
          tasks={tasks}
          setTasks={setTasks}
          user={user}
          setUser={setUser}
          onNavigateToStats={() => setCurrentPage('stats')} />
      )}
      {currentPage === 'stats' && (
        <StatsPage 
          tasks={tasks}
          user={user}
          onNavigateToMain={() => setCurrentPage('main')} />
      )}
    </>
  );
};

export default App;
