import React, { useState } from 'react';
import { Target, Flame, Award, Plus, CheckCircle2, Trophy, Zap, X } from 'lucide-react';
import { Goal } from '../types';

interface GoalTrackerViewProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  streakDays: number;
}

export const GoalTrackerView: React.FC<GoalTrackerViewProps> = ({
  goals,
  setGoals,
  streakDays,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    category: 'Study Habit',
    targetValue: 4,
    unit: 'hrs/day',
    deadline: '2026-08-31',
  });

  const badges = [
    { id: 'b1', title: '7-Day Streak Master', desc: 'Maintained active daily study for 7 days', unlocked: streakDays >= 7, icon: '🔥' },
    { id: 'b2', title: 'Attendance Defender', desc: 'Kept all courses above 75% attendance threshold', unlocked: true, icon: '🛡️' },
    { id: 'b3', title: 'Mid-Term Conqueror', desc: 'Completed 10+ hours of exam revision', unlocked: true, icon: '🏆' },
    { id: 'b4', title: 'Pomodoro Beast', desc: 'Completed 20 focus sessions without interruption', unlocked: false, icon: '⚡' },
  ];

  const handleToggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title) return;

    const goal: Goal = {
      id: `g-${Date.now()}`,
      title: newGoal.title,
      category: (newGoal.category as Goal['category']) || 'Academic',
      targetValue: Number(newGoal.targetValue) || 10,
      currentValue: 0,
      unit: newGoal.unit || 'units',
      deadline: newGoal.deadline || '2026-08-31',
      streakDays: 1,
      completed: false,
    };

    setGoals((prev) => [...prev, goal]);
    setIsModalOpen(false);
  };

  return (
    <div id="goals-view" className="space-y-6 pb-12">
      {/* Header Bento Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white">Academic Goal & Streak Tracker</h1>
            <span className="text-xs px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center space-x-1 shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streakDays} Day Streak</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Track daily study consistency, syllabus milestones, and unlock achievement badges.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 border border-white/10 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Badges Bento Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
        <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Achievement Badges Unlocked</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border flex items-center space-x-3 transition-all ${
                b.unlocked
                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-200 shadow-md'
                  : 'bg-slate-800/40 border-white/5 text-slate-500 opacity-60'
              }`}
            >
              <div className="text-2xl">{b.icon}</div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">{b.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals List - Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.currentValue / (g.targetValue || 1)) * 100));

          return (
            <div
              key={g.id}
              className={`p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border space-y-4 transition-all duration-300 shadow-xl ${
                g.completed ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-white/10 hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-white/5 text-slate-300">
                    {g.category}
                  </span>
                  <h3 className={`text-base font-extrabold mt-1.5 ${g.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {g.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleGoal(g.id)}
                  className={`p-2 rounded-2xl border transition-all active:scale-95 ${
                    g.completed
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Progress: {g.currentValue} / {g.targetValue} {g.unit}</span>
                  <span className="font-bold text-indigo-400">{pct}%</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/10 font-medium">
                <span>Streak: 🔥 {g.streakDays} days</span>
                <span>Deadline: {g.deadline}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal - Bento Style */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAddGoal}
            className="bg-slate-900/90 border border-white/10 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-white">Create New Academic Goal</h3>
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g. Study 4 Hours Daily"
                  className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Study Habit">Study Habit</option>
                    <option value="Academic">Academic</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Syllabus">Syllabus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Target Value</label>
                  <input
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    placeholder="e.g. hrs/day or %"
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
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
                Save Goal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
