// ========================================
// PAGE - メインページ
// ========================================

import React, { useState, useMemo } from 'react';
import Header from '../components/Header/Header';
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
  deleteTask,
  calculateTaskStats
} from '../utils/taskUtils';
import { filterAndSortTasks } from '../utils/filterUtils';
import { completeTask } from '../utils/gamificationUtils';

const MainPage: React.FC = () => {
    // ユーザー状態（ゲーミフィケーション）
    const [user, setUser] = useState<User>({
        level: 1,
        exp: 0,
        streak: 0,
        maxStreak: 0,
        lastCompletedDate: null,
        totalCompleted: 0
    });

    const [tasks, setTasks] = useState<Task[]>([]);
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

    // タスクの並び替え
    const handleReorderTasks = (draggedId: string, targetId: string): void => {
        // 元の tasks 配列全体から並び替える
        const draggedIndex = tasks.findIndex(t => t.id === draggedId);
        const targetIndex = tasks.findIndex(t => t.id === targetId);
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        const newTasks = [...tasks];
        const [draggedTask] = newTasks.splice(draggedIndex, 1);
        newTasks.splice(targetIndex, 0, draggedTask);
        
        // order プロパティを更新
        const reorderedTasks = newTasks.map((task, index) => ({
            ...task,
            order: Date.now() + index
        }));
        
        setTasks(reorderedTasks);
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

    // 統計情報
    const stats = calculateTaskStats(tasks);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto p-6">
                <Header />

                {/* ユーザー情報カード */}
                <UserInfoCard user={user} />

                <TaskInput onOpenModal={handleOpenCreateModal} />

                {/* 統計情報 */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div className="text-center">
                            <div className="text-gray-600">全タスク</div>
                            <div className="text-2xl font-bold text-gray-800">{stats.totalTasks}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-600">完了</div>
                            <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-600">達成率</div>
                            <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-600">高優先度</div>
                            <div className="text-2xl font-bold text-red-600">{stats.byPriority.high}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-600">仕事</div>
                            <div className="text-2xl font-bold text-blue-600">{stats.byCategory.work}</div>
                        </div>
                    </div>
                </div>

                {/* フィルターバー */}
                <FilterBar
                    filters={filters}
                    sortBy={sortBy}
                    onFilterChange={setFilters}
                    onSortChange={setSortBy}
                />

                {/* フィルター結果の表示 */}
                {filteredAndSortedTasks.length !== tasks.length && (
                    <div className="mb-4 text-sm text-gray-600">
                        {tasks.length}件中 {filteredAndSortedTasks.length}件を表示
                    </div>
                )}

                <TaskList
                    tasks={filteredAndSortedTasks}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteTask}
                    onReorder={handleReorderTasks}
                />

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
