import React from 'react';
import Header from './components/Header/Header';
import TaskInput from './components/Task/TaskInput';
import TaskList from './components/Task/TaskList';
import type { Task } from './types/task';

function App() {
  // テスト用のダミーデータ
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: '1',
      title: 'Reactの勉強',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'TypeScriptの理解を深める',
      completed: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Todoアプリを完成させる',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const handleAddTask = (title: string) => {
    console.log('タスク追加:', title);
    // まだ実装していないので、コンソールに出力するだけ
  };

  const handleToggleComplete = (id: string) => {
    console.log('完了切り替え:', id);
    // まだ実装していないので、コンソールに出力するだけ
  };

  const handleUpdate = (id: string, updates: any) => {
    console.log('タスク更新:', id, updates);
    // まだ実装していないので、コンソールに出力するだけ
  };

  const handleDelete = (id: string) => {
    console.log('タスク削除:', id);
    // まだ実装していないので、コンソールに出力するだけ
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6">
        <Header />
        
        <TaskInput onAddTask={handleAddTask} />
        
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;
