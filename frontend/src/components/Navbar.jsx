import React from 'react';
import { CheckSquare, ListTodo, CheckCircle2, Clock } from 'lucide-react';

export default function Navbar({ totalCount, completedCount, pendingCount }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-sm">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow</h1>
            {/* <p className="text-xs text-slate-500 font-medium">Full-Stack React + Node + MySQL</p> */}
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg">
            <ListTodo className="w-4 h-4 text-slate-500" />
            <span>Total:</span>
            <span className="font-bold text-slate-900">{totalCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200/50">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Pending:</span>
            <span className="font-bold text-amber-800">{pendingCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Done:</span>
            <span className="font-bold text-emerald-800">{completedCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
