// ========================================
// PAGE - メインページ
// ========================================

import React, { useState, useMemo } from 'react';
import TaskInput from '../components/Task/TaskInput';
import TaskList from '../components/Task/TaskList';
import TaskModal from '../components/Task/TaskModal';
import FilterBar from '../components/Filter/FilterBar';
import UserInfoCard from '../components/User/UserInfoCard';
import CompletionModal from '../components/Task/CompletionModal';
import type { Task, CreateTaskParams, UpdateTaskParams, FilterOptions, SortOption, User, TaskReward, Emotion } from '../types/task';
import {
  createTask,
  toggleTaskComplete,
  updateTask,
  deleteTask
} from '../utils/taskUtils';
import { filterAndSortTasks } from '../utils/filterUtils';
import { completeTask } from '../utils/gamificationUtils';
import { BarChart3 } from 'lucide-react';

interface MainPageProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    onNavigateToStats: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ 
    tasks,
    setTasks,
    user,
    setUser,
    onNavigateToStats 
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    // 完了モーダル用の状態
    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    const [currentReward, setCurrentReward] = useState<TaskReward | null>(null);
    const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

    // フィルター・ソート状態
    const [filters, setFilters] = useState<FilterOptions>({
        category: 'all',
        priority: 'all',
        completed: 'all',
        searchQuery: '',
        tags: []
    });
    const [sortBy, setSortBy] = useState<SortOption>('custom');


    // フィルター・ソート適用済みタスク
    const filteredAndSortedTasks = useMemo(() => {
        return filterAndSortTasks(tasks, filters, sortBy);
    }, [tasks, filters, sortBy]);


    // タスク追加
    const handleAddTask = (params: CreateTaskParams): void => {
        const newTask = createTask(params);
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    // タスク更新
    const handleUpdateTask = (params: UpdateTaskParams): void => {
        if (!editingTask) return;
        setTasks(prevTasks => updateTask(prevTasks, editingTask.id, params));
        setEditingTask(null);
    };

    // タスク削除
    const handleDeleteTask = (id: string): void => {
        setTasks(prevTasks => deleteTask(prevTasks, id));
    };

    // モーダルを開く（新規作成）
    const handleOpenCreateModal = (): void => {
        setModalMode('create');
        setEditingTask(null);
        setIsModalOpen(true);
    };

    // モーダルを開く（編集）
    const handleOpenEditModal = (task: Task): void => {
        setModalMode('edit');
        setEditingTask(task);
        setIsModalOpen(true);
    };

    // モーダルを閉じる
    const handleCloseModal = (): void => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    // モーダルから保存
    const handleModalSave = (params: CreateTaskParams | UpdateTaskParams): void => {
        if (modalMode === 'create') {
            handleAddTask(params as CreateTaskParams);
        } else {
            handleUpdateTask(params as UpdateTaskParams);
        }
    };

    // 完了切り替え
    const handleToggleComplete = (id: string): void => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        // 未完了 → 完了の場合
        if (!task.completed) {
            // ゲーミフィケーション処理
            const { user: updatedUser, reward } = completeTask(user, task);

            // タスクを完了状態に更新
            setTasks(prevTasks => prevTasks.map(t => 
                t.id === id
                    ? { ...t, completed: true, completedAt: new Date().toISOString() }
                    : t
            ));

            // ユーザー情報を更新
            setUser(updatedUser);

            // 完了モーダルを表示
            setCurrentReward(reward);
            setCompletingTaskId(id);
            setIsCompletionModalOpen(true);
        } else {
            // 完了 → 未完了の場合（経験値は減らさない）
            setTasks(prevTasks => toggleTaskComplete(prevTasks, id));
        }
    };

    // 感情を記録
    const handleEmotionSelect = (emotion: Emotion): void => {
        if (completingTaskId) {
            setTasks(prevTasks => prevTasks.map(t =>
                t.id === completingTaskId
                ? { ...t, emotion }
                : t
            ));
            setCompletingTaskId(null);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto p-46">
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-1">
                            🎮 GamiTask
                        </h1>
                        <p className="text-sm text-gray-600">あなたのタスクを楽しく管理</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <TaskInput onOpenModal={handleOpenCreateModal} />
                        <button
                            onClick={onNavigateToStats}
                            className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-purple-600 font-medium flex items-center gap-2"
                        >
                            <BarChart3 size={20} />
                            統計
                        </button>
                    </div>
                </div>

                {/* ユーザー情報カード */}
                <UserInfoCard user={user} />

                {/* フィルターバー */}
                <FilterBar
                    filters={filters}
                    sortBy={sortBy}
                    onFilterChange={setFilters}
                    onSortChange={setSortBy}
                />

                {/* フィルター結果の表示 */}
                {filteredAndSortedTasks.length !== tasks.length && (
                    <div className="mb-3 text-sm text-gray-600">
                        {tasks.length}件中 {filteredAndSortedTasks.length}件を表示
                    </div>
                )}

                {/* タスクリスト（グリッド表示） */}
                <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}
                >
                    <TaskList
                        tasks={filteredAndSortedTasks}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteTask}
                    />
                </div>

                {/* タスクモーダル */}
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleModalSave}
                    task={editingTask}
                    mode={modalMode}
                />

                {/* 完了モーダル */}
                {currentReward && (
                    <CompletionModal
                        isOpen={isCompletionModalOpen}
                        onClose={() => setIsCompletionModalOpen(false)}
                        reward={currentReward}
                        onEmotionSelect={handleEmotionSelect}
                    />
                )}
            </div>
        </div>
    );
};

export default MainPage;
