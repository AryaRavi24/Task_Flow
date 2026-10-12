import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, X, AlignLeft, Type, Calendar } from 'lucide-react';

export default function TaskForm({ onSubmit, editingTask, onCancelEdit, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // Helper to format ISO / DB date string to YYYY-MM-DDTHH:mm for datetime-local input
  const formatForInput = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // Synchronize form fields whenever editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setDueDate(formatForInput(editingTask.due_date));
      setError('');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setError('');
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setError('');
    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    });

    if (!editingTask) {
      setTitle('');
      setDescription('');
      setDueDate('');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          {editingTask ? (
            <>
              <Save className="w-5 h-5 text-indigo-600" />
              Edit Task
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              Add New Task
            </>
          )}
        </h2>

        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Type className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., Complete project report"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all outline-hidden ${
                error
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 focus:bg-white'
              }`}
              disabled={isSubmitting}
            />
          </div>
          {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-3.5 pointer-events-none text-slate-400">
              <AlignLeft className="w-4 h-4" />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add extra context, steps, or notes..."
              rows={3}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 focus:bg-white text-sm transition-all outline-hidden resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Due Date & Time Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Due Date & Time <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate('')}
                className="text-xs text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 focus:bg-white text-sm transition-all outline-hidden text-slate-700"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          {editingTask && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {editingTask ? (
              <>
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
