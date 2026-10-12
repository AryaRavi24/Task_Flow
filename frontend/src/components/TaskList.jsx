import React, { useState, useMemo } from 'react';
import TaskItem from './TaskItem';
import { Search, Inbox, CheckCircle, Clock } from 'lucide-react';

export default function TaskList({ tasks, onToggle, onEdit, onDelete, isLoading }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (filter === 'pending' && task.is_completed) return false;
      if (filter === 'completed' && !task.is_completed) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query) || false;
        return matchesTitle || matchesDesc;
      }

      return true;
    });
  }, [tasks, filter, searchQuery]);

  const pendingCount = tasks.filter((t) => !t.is_completed).length;
  const completedCount = tasks.filter((t) => t.is_completed).length;

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Task List or Empty State */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
          <p className="text-sm font-medium text-slate-500">Loading your tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
            {searchQuery ? (
              <Search className="w-7 h-7" />
            ) : filter === 'completed' ? (
              <CheckCircle className="w-7 h-7" />
            ) : filter === 'pending' ? (
              <Clock className="w-7 h-7" />
            ) : (
              <Inbox className="w-7 h-7" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {searchQuery ? 'No matching tasks' : 'No tasks found'}
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No tasks matching "${searchQuery}". Try adjusting your keywords or clearing the search.`
              : filter === 'all'
              ? 'You have not added any tasks yet. Use the form above to add your first task!'
              : `You have no ${filter} tasks right now.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
