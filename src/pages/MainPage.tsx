// ========================================
// PAGE - メインページ
// ========================================

import React, { useState } from 'react';
import Header from '../components/Header/Header';
import TaskInput from '../components/Task/TaskInput';
import TaskList from '../components/Task/TaskList';
import TaskModal from '../components/Task/TaskModal';
import type { Task, CreateTaskParams, UpdateTaskParams } from '../types/task';
import {
  createTask,
  toggleTaskComplete,
  updateTask,
  deleteTask,
  calculateTaskStats
} from '../utils/taskUtils';

const MainPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    // タスク追加
    const handleAddTask = (params: CreateTaskParams): void => {
        const newTask = createTask(params);
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    // 完了切り替え
    const handleToggleComplete = (id: string): void => {
        setTasks(prevTasks => toggleTaskComplete(prevTasks, id));
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

    // 統計情報
    const stats = calculateTaskStats(tasks);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto p-6">
                <Header />

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

                <TaskList
                    tasks={tasks}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteTask}
                />

                {/* タスクモーダル */}
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleModalSave}
                    task={editingTask}
                    mode={modalMode}
                />
            </div>
        </div>
    );
};

export default MainPage;
