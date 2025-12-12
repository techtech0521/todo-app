// ========================================
// COMPONENT - フィルターバー
// ========================================

import React from 'react';
import type { ChangeEvent } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';
import type { Priority, Category, FilterOptions, SortOption } from '../../types/task';
import { PRIORITIES, CATEGORIES } from '../../constants';

interface FilterBarProps {
    filters: FilterOptions;
    sortBy: SortOption;
    onFilterChange: (filters: FilterOptions) => void;
    onSortChange: (sortBy: SortOption) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
    filters,
    sortBy,
    onFilterChange,
    onSortChange
}) => {
    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            ...filters,
            category: e.target.value as Category | 'all'
        });
    };

    const handlePriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            ...filters,
            priority: e.target.value as Priority | 'all'
            });
    };

    const handleCompletedChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            ...filters,
            completed: e.target.value as 'all' | 'active' | 'completed'
        });
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        onFilterChange({
            ...filters,
            searchQuery: e.target.value
        });
    };

    const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onSortChange(e.target.value as SortOption);
    };

    //フィルターが適用されているかチェック
    const isFilterActive = 
        filters.category !== 'all' || 
        filters.priority !== 'all' || 
        filters.completed !== 'all' || 
        filters.searchQuery !== '';

    return (
        <div className={`rounded-lg shadow-md p-4 mb-6 transition-colors ${
            isFilterActive 
                ? 'bg-blue-50 border-2 border-blue-300' 
                : 'bg-white'
        }`}>
            {/* アクティブフィルターバッジ */}
            {isFilterActive && (
                <div className="mb-3 flex items-center gap-2">
                    <Filter className="text-blue-600" size={16} />
                    <span className="text-sm font-medium text-blue-700">フィルター適用中</span>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* 検索 */}
                <div className="lg:col-span-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={filters.searchQuery}
                            onChange={handleSearchChange}
                            placeholder="タスクを検索..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* カテゴリー */}
                <div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            value={filters.category}
                            onChange={handleCategoryChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="all">全カテゴリー</option>
                            {CATEGORIES.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 優先度 */}
                <div>
                    <select
                        value={filters.priority}
                        onChange={handlePriorityChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                        <option value="all">全優先度</option>
                        {PRIORITIES.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.emoji} {p.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 完了状態 */}
                <div>
                    <select
                        value={filters.completed}
                        onChange={handleCompletedChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                        <option value="all">すべて</option>
                        <option value="active">未完了</option>
                        <option value="completed">完了</option>
                    </select>
                </div>
            </div>

            {/* ソート */}
            <div className="mt-3 flex items-center gap-2">
                <SortAsc size={18} className="text-gray-400" />
                <span className="text-sm text-gray-600">並び順:</span>
                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                    <option value="custom">カスタム順</option>
                    <option value="priority">優先度順</option>
                    <option value="dueDate">期限が近い順</option>
                    <option value="createdAt">作成日が新しい順</option>
                </select>
            </div>

            {/* アクティブフィルター表示 */}
            {(filters.category !== 'all' || 
                filters.priority !== 'all' || 
                filters.completed !== 'all' || 
                filters.searchQuery) && (
                <div className="mt-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-gray-600">フィルター中:</span>
                        {filters.category !== 'all' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                {CATEGORIES.find(c => c.id === filters.category)?.label}
                            </span>
                        )}
                        {filters.priority !== 'all' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
                                {PRIORITIES.find(p => p.id === filters.priority)?.label}優先度
                            </span>
                        )}
                        {filters.completed === 'active' && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                未完了
                            </span>
                        )}
                        {filters.completed === 'completed' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                                完了
                            </span>
                        )}
                        {filters.searchQuery && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                                "{filters.searchQuery}"
                            </span>
                        )}
                        <button
                            onClick={() => onFilterChange({
                                category: 'all',
                                priority: 'all',
                                completed: 'all',
                                searchQuery: '',
                                tags: []
                            })}
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            すべてクリア
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterBar;
