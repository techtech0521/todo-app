// ========================================
// COMPONENT - タスク追加/編集モーダル
// ========================================

import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import type { Task, Priority, Category, CreateTaskParams, UpdateTaskParams } from '../../types/task';
import { PRIORITIES, CATEGORIES } from '../../constants';
import { Calendar, Clock, Tag } from 'lucide-react';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (params: CreateTaskParams | UpdateTaskParams) => void;
    task?: Task | null;
    mode: 'create' | 'edit';
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task, mode}) => {
    // フォーム状態
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [category, setCategory] = useState<Category>('personal');
    const [dueDate, setDueDate] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    // 編集モードの場合、既存のタスク情報をセット
    useEffect(() => {
        if (mode === 'edit' && task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setPriority(task.priority);
            setCategory(task.category);
            setDueDate(task.dueDate || '');
            setEstimatedTime(task.estimatedTime ? task.estimatedTime.toString() : '');
            setTags(task.tags);
        } else {
            // 新規作成の場合はリセット
            resetForm()
        }
    }, [mode, task, isOpen]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('personal');
        setDueDate('');
        setEstimatedTime('');
        setTags([]);
        setTagInput('');
    };

    const handleSave = () => {
        if (title.trim() === '') return;

        const params: CreateTaskParams | UpdateTaskParams = {
            title: title.trim(),
            description: description.trim(),
            priority,
            category,
            dueDate: dueDate || null,
            estimatedTime: estimatedTime ? parseInt(estimatedTime, 10) : null,
            tags,
        };

        onSave(params);
        onClose();
        if (mode === 'create') {
            resetForm();
        }
    };

    const handleAddTag = () => {
        const tag = tagInput.trim();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'タスクを追加' : 'タスクを編集'}
    >
      <div className="space-y-6">
        {/* タイトル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="タスクのタイトルを入力..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* 説明 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            説明
          </label>
          <textarea
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="詳細な説明を入力..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* 優先度とカテゴリー */}
        <div className="grid grid-cols-2 gap-4">
          {/* 優先度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              優先度
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPriority(p.id)}
                  className={`flex-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                    priority === p.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-lg">{p.emoji}</span>
                  <div className="text-xs mt-1">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* カテゴリー */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリー
            </label>
            <select
              value={category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 期限と予想時間 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 期限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              期限
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 予想時間 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              予想時間（分）
            </label>
            <input
              type="number"
              value={estimatedTime}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEstimatedTime(e.target.value)}
              placeholder="60"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* タグ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag size={16} className="inline mr-1" />
            タグ
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="タグを入力してEnter"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleAddTag} variant="secondary" size="sm">
              追加
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ボタン */}
        <div className="flex gap-3 pt-4">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            キャンセル
          </Button>
          <Button onClick={handleSave} variant="primary" className="flex-1">
            {mode === 'create' ? '追加' : '保存'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;