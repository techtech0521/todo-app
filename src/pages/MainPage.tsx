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
  updateTask,
  deleteTask
} from '../utils/taskUtils';
import { filterAndSortTasks, moveCompletedToBottom } from '../utils/filterUtils';
import { completeTask } from '../utils/gamificationUtils';
import { BarChart3, Settings } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SettingsModal from '../components/Settings/SettingsModal';
import EmptyState from '../components/EmptyState/EmptyState';

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

    // 確認ダイアログ用の状態
    const [isUncompleteDialogOpen, setIsUncompleteDialogOpen] = useState(false);
    const [taskToUncomplete, setTaskToUncomplete] = useState<string | null>(null);

    // 削除確認ダイアログ用の状態
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    // 設定モーダル用の状態
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

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
        const filtered =  filterAndSortTasks(tasks, filters, sortBy);
        return moveCompletedToBottom(filtered);
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
        setTaskToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    // タスク削除の実行（確認後）
    const handleConfirmDelete = (): void => {
        if (!taskToDelete) return;
        setTasks(prevTasks => deleteTask(prevTasks, taskToDelete));
        setTaskToDelete(null);
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

        // 完了 → 未完了の場合（確認ダイアログを表示）
        if (task.completed) {
            setTaskToUncomplete(id);
            setIsUncompleteDialogOpen(true);
            return;
        }

        // 未完了 → 完了の場合
        const { user: updatedUser, reward } = completeTask(user, task);

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
    };

    // 未完了に戻す処理（確認後）
    const handleConfirmUncomplete = (): void => {
        if(!taskToUncomplete) return;

        setTasks(prevTasks => prevTasks.map(t => 
            t.id === taskToUncomplete
                ? { ...t, completed: false, completedAt: null, emotion: null }
                : t
        ));

        setTaskToUncomplete(null);
    }

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

    // データリセット処理
    const handleResetData = (): void => {
        setIsSettingsModalOpen(false);
        setIsResetConfirmOpen(true);
    };

    const handleConfirmReset = (): void => {
        // localStorageのデータを削除
        localStorage.removeItem('gamitask-tasks');
        localStorage.removeItem('gamitask-user');

        // ページをリロード
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* ヘッダー */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-1">
                            🎮 GamiTask
                        </h1>
                        <p className="text-sm text-gray-600">あなたのタスクを楽しく管理</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-full sm:w-auto">
                            <TaskInput onOpenModal={handleOpenCreateModal} />
                        </div>
                        <button
                            onClick={onNavigateToStats}
                            className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-purple-600 font-medium flex items-center gap-2"
                        >
                            <BarChart3 size={20} />
                            統計
                        </button>
                        <button
                            onClick={() => setIsSettingsModalOpen(true)}
                            className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-gray-600 font-medium flex items-center gap-2"
                        >
                            <Settings size={20} />
                            設定
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
                {tasks.length === 0 ? (
                    <div className="mt-8">
                        <EmptyState onCreateTask={handleOpenCreateModal} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] md:max-h-[70vh] lg:max-h-[80vh] overflow-y-auto pr-1">
                        <TaskList
                            tasks={filteredAndSortedTasks}
                            onToggleComplete={handleToggleComplete}
                            onEdit={handleOpenEditModal}
                            onDelete={handleDeleteTask}
                        />
                    </div>  
                )}

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

                {/* 未完了確認ダイアログ */}
                <ConfirmDialog
                    isOpen={isUncompleteDialogOpen}
                    onClose={() => {
                        setIsUncompleteDialogOpen(false);
                        setTaskToUncomplete(null);
                    }}
                    onConfirm={handleConfirmUncomplete}
                    title="確認"
                    message="このタスクを未完了に戻しますか？"
                    warningMessage="獲得した経験値は戻りません"
                    confirmText="未完了に戻す"
                    cancelText="キャンセル"
                />

                {/* 削除確認ダイアログ */}
                <ConfirmDialog 
                    isOpen={isDeleteDialogOpen}
                    onClose={() => {
                        setIsDeleteDialogOpen(false);
                        setTaskToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    title="タスクを削除"
                    message="このタスクを削除しますか？"
                    warningMessage="この操作は取り消せません"
                    confirmText="削除"
                    cancelText="キャンセル"
                />

                {/* 設定モーダル */}
                <SettingsModal
                    isOpen={isSettingsModalOpen}
                    onClose={() => setIsSettingsModalOpen(false)}
                    onResetData={handleResetData}
                />

                {/* データリセット確認ダイアログ */}
                <ConfirmDialog
                    isOpen={isResetConfirmOpen}
                    onClose={() => setIsResetConfirmOpen(false)}
                    onConfirm={handleConfirmReset}
                    title="全データをリセット"
                    message="本当に全てのデータを削除しますか？"
                    warningMessage="全てのタスク、レベル、経験値、ストリークが永久に失われます。この操作は取り消せません。"
                    confirmText="リセットする"
                    cancelText="キャンセル"
                />
            </div>
        </div>
    );
};

export default MainPage;
