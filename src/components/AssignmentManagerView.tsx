import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  FileText,
  Sparkles,
  CheckCircle2,
  Trash2,
  Paperclip,
  X,
  Filter,
} from 'lucide-react';
import { Assignment } from '../types';

interface AssignmentManagerViewProps {
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

export const AssignmentManagerView: React.FC<AssignmentManagerViewProps> = ({
  assignments,
  setAssignments,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Assignment>>({
    title: '',
    subject: 'Database Management Systems',
    description: '',
    deadline: '2026-08-05T23:59',
    priority: 'High',
    status: 'Pending',
    estimatedHours: 3,
  });

  const filtered = assignments
    .filter((a) => (filterStatus === 'All' ? true : a.status === filterStatus))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const handleStatusChange = (id: string, status: Assignment['status']) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleDelete = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) return;

    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      title: formData.title,
      subject: formData.subject || 'Academic Course',
      description: formData.description || '',
      deadline: formData.deadline,
      priority: (formData.priority as Assignment['priority']) || 'Medium',
      status: (formData.status as Assignment['status']) || 'Pending',
      estimatedHours: Number(formData.estimatedHours) || 2.5,
      attachedDocs: formData.description?.includes('.pdf') ? ['Attached_Document.pdf'] : undefined,
    };

    setAssignments((prev) => [...prev, newAssignment]);
    setIsModalOpen(false);
    setFormData({
      title: '',
      subject: 'Database Management Systems',
      description: '',
      deadline: '2026-08-05T23:59',
      priority: 'High',
      status: 'Pending',
      estimatedHours: 3,
    });
  };

  // Calculate hours remaining to deadline
  const getTimeRemaining = (deadlineStr: string) => {
    const diffMs = new Date(deadlineStr).getTime() - Date.now();
    if (diffMs <= 0) return { text: 'Overdue!', urgent: true };

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 24) return { text: `Due in ${hours} hrs`, urgent: true };

    const days = Math.floor(hours / 24);
    return { text: `Due in ${days} days (${hours % 24} hrs)`, urgent: days <= 2 };
  };

  return (
    <div id="assignments-view" className="space-y-6 pb-12">
      {/* Header Bento Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white">Assignment & Task Manager</h1>
            <span className="text-xs px-3 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 shadow-sm">
              AI Time Allocated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Automatically prioritized by urgency and remaining time. StudyPilot AI schedules preparation blocks into your study plan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 border border-white/10 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Filter Tabs - Bento Pills */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex space-x-2">
          {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterStatus(tab)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                filterStatus === tab
                  ? 'bg-slate-800 text-white border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Showing {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Assignment List - Bento Cards */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const remaining = getTimeRemaining(item.deadline);

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xl ${
                item.status === 'Completed'
                  ? 'border-white/5 opacity-70'
                  : remaining.urgent
                  ? 'border-rose-500/40 shadow-lg shadow-rose-500/10'
                  : 'border-white/10 hover:border-indigo-500/40'
              }`}
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-indigo-400">{item.subject}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.priority === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.priority === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                      remaining.urgent
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                        : 'bg-slate-800/80 border border-white/5 text-slate-400'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{remaining.text}</span>
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white leading-snug">{item.title}</h3>
                {item.description && <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>}

                <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1 font-medium">
                  <span className="flex items-center space-x-1 text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>AI Estimated Work: <strong>{item.estimatedHours} hrs</strong></span>
                  </span>
                  {item.attachedDocs && item.attachedDocs.length > 0 && (
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.attachedDocs.length} attachment</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Status Select & Actions */}
              <div className="flex items-center space-x-3 self-end md:self-center shrink-0">
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value as Assignment['status'])}
                  className={`p-2.5 rounded-2xl text-xs font-bold border focus:outline-none transition-colors ${
                    item.status === 'Completed'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : item.status === 'In Progress'
                      ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                      : 'bg-slate-800/80 border-white/10 text-slate-300'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2.5 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Assignment Modal - Bento Style */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-slate-900/90 border border-white/10 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-white">Add Assignment</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. DBMS Normalization Problem Set"
                  className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Database Management Systems"
                  className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Deadline Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Assignment['priority'] })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Assignment['status'] })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description / Instructions</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Instructions, problem set link, or required format..."
                  className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 border border-white/10 active:scale-95"
              >
                Save Assignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
