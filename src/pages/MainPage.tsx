// ========================================
// PAGE - メインページ
// ========================================

import React, { useState } from 'react';
import Header from '../components/Header/Header';
import TaskInput from '../components/Task/TaskInput';
import TaskList from '../components/Task/TaskList';
import type { Task, UpdateTaskParams } from '../types/task';
import {
  createTask,
  toggleTaskComplete,
  updateTask,
  deleteTask,
  calculateTaskStats
} from '../utils/taskUtils';

const MainPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    // タスク追加
    const handleAddTask = (title: string): void => {
        const newTask = createTask({ title });
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    // 完了切り替え
    const handleToggleComplete = (id: string): void => {
        setTasks(prevTasks => toggleTaskComplete(prevTasks, id));
    };

    // タスク更新
    const handleUpdateTask = (id: string, updates: UpdateTaskParams): void => {
        setTasks(prevTasks => updateTask(prevTasks, id, updates));
    };

    // タスク削除
    const handleDeleteTask = (id: string): void => {
        setTasks(prevTasks => deleteTask(prevTasks, id));
    };

    // 統計情報
    const stats = calculateTaskStats(tasks);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto p-6">
                <Header />

                <TaskInput onAddTask={handleAddTask} />

                {/* 統計情報 */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                        全タスク: <span className="font-bold text-gray-800">{stats.totalTasks}</span>
                        </span>
                        <span className="text-gray-600">
                        完了: <span className="font-bold text-green-600">{stats.completedTasks}</span>
                        </span>
                        <span className="text-gray-600">
                        達成率: <span className="font-bold text-blue-600">{stats.completionRate}%</span>
                        </span>
                    </div>
                </div>

                <TaskList 
                    tasks={tasks}
                    onToggleComplete={handleToggleComplete}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                />
            </div>
        </div>
    );
};

export default MainPage;
