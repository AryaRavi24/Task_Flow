import React, { useState } from 'react';
import { Check, Clock, Trash2, Edit3, Calendar, AlertTriangle } from 'lucide-react';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = !task.is_completed && task.due_date && new Date(task.due_date) < new Date();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  };

  return (
    <div
      className={`group bg-white rounded-2xl p-5 border transition-all duration-200 ${
        task.is_completed
          ? 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
          : isOverdue
          ? 'border-rose-200 bg-rose-50/20 hover:border-rose-300 hover:shadow-md'
          : 'border-slate-200 hover:border-indigo-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Toggle Checkbox Button */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          title={task.is_completed ? 'Mark as pending' : 'Mark as completed'}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
            task.is_completed
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'border-2 border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50'
          }`}
        >
          {task.is_completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3
              className={`text-base font-semibold leading-snug break-words ${
                task.is_completed
                  ? 'line-through text-slate-400'
                  : 'text-slate-800'
              }`}
            >
              {task.title}
            </h3>

            {/* Status Badge */}
            {task.is_completed ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                <Check className="w-3 h-3" /> Completed
              </span>
            ) : isOverdue ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> Overdue
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                <Clock className="w-3 h-3" /> Pending
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={`text-sm mt-1 whitespace-pre-wrap leading-relaxed ${
                task.is_completed ? 'text-slate-400 line-through' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata: Created & Due Date */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs">
            {/* Due Date Indicator */}
            {task.due_date && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium ${
                  task.is_completed
                    ? 'text-slate-400 line-through bg-slate-100'
                    : isOverdue
                    ? 'text-rose-700 bg-rose-100/70 border border-rose-200'
                    : 'text-indigo-700 bg-indigo-50 border border-indigo-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Due: {formatDate(task.due_date)}</span>
              </span>
            )}

            {/* Created Timestamp */}
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created: {formatDate(task.created_at)}</span>
            </span>
          </div>
        </div>

        {/* Actions (Edit / Delete) */}
        <div className="flex items-center gap-1 self-start">
          <button
            type="button"
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete task"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
