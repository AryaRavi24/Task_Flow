import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { api } from './services/api';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null); // { message, type: 'success' | 'error' | 'info' }

  // Helper to trigger temporary toast banner
  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  // 1. Fetch tasks on initial mount
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAll();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      notify(err.message || 'Could not connect to the backend server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // 2. Add or Update task
  const handleSaveTask = async ({ title, description, due_date }) => {
    try {
      setIsSubmitting(true);

      if (editingTask) {
        // Update existing task
        const updated = await api.update(editingTask.id, {
          title,
          description,
          due_date,
          is_completed: editingTask.is_completed,
        });

        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? updated : t))
        );
        setEditingTask(null);
        notify('Task updated successfully!', 'success');
      } else {
        // Create new task
        const newTask = await api.create({ title, description, due_date });
        setTasks((prev) => [newTask, ...prev]);
        notify('Task created successfully!', 'success');
      }
    } catch (err) {
      console.error('Save error:', err);
      notify(err.message || 'Failed to save task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Toggle task status (Completed <-> Pending)
  const handleToggle = async (id) => {
    try {
      const updated = await api.toggleStatus(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

      const statusText = updated.is_completed ? 'completed' : 'pending';
      notify(`Task marked as ${statusText}!`, 'info');
    } catch (err) {
      console.error('Toggle error:', err);
      notify(err.message || 'Failed to toggle task status.', 'error');
    }
  };

  // 4. Delete task
  const handleDelete = async (id) => {
    try {
      await api.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTask?.id === id) {
        setEditingTask(null);
      }
      notify('Task deleted successfully!', 'info');
    } catch (err) {
      console.error('Delete error:', err);
      notify(err.message || 'Failed to delete task.', 'error');
    }
  };

  // 5. Select task for editing
  const handleStartEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        totalCount={tasks.length}
        completedCount={completedCount}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        {/* Floating Notification Banner */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm font-medium shadow-sm transition-all animate-fade-in ${
              notification.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : notification.type === 'info'
                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {notification.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              ) : notification.type === 'info' ? (
                <Info className="w-5 h-5 text-sky-500 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded-md"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Task Creation / Editing Form */}
          <div className="lg:col-span-5 sticky top-24">
            <TaskForm
              onSubmit={handleSaveTask}
              editingTask={editingTask}
              onCancelEdit={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column: Task List, Search & Filters */}
          <div className="lg:col-span-7">
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onEdit={handleStartEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        Task Manager Application • React (Vite) + Node.js (Express) + MySQL
      </footer>
    </div>
  );
}
