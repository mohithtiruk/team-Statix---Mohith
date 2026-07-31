import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldAlert,
  Plus,
  Minus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  X,
  RotateCcw,
} from 'lucide-react';
import { AttendanceSubject } from '../types';

interface AttendanceTrackerViewProps {
  attendance: AttendanceSubject[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceSubject[]>>;
}

export const AttendanceTrackerView: React.FC<AttendanceTrackerViewProps> = ({
  attendance,
  setAttendance,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSub, setNewSub] = useState<Partial<AttendanceSubject>>({
    subjectName: '',
    subjectCode: '',
    classesConducted: 20,
    classesAttended: 18,
    targetPercentage: 75,
    creditHours: 3,
    faculty: '',
  });

  // Calculate Safe Bunk Margin or Recovery Count
  const calculateMargin = (sub: AttendanceSubject) => {
    const C = sub.classesConducted;
    const A = sub.classesAttended;
    const Target = sub.targetPercentage / 100;

    if (C === 0) return { type: 'safe', count: 0, text: 'No classes conducted yet' };

    const currentPct = (A / C) * 100;

    if (currentPct >= sub.targetPercentage) {
      // Safe to skip X classes: (A - Target * C) / Target
      const safeBunks = Math.floor((A - Target * C) / Target);
      return {
        type: 'safe',
        count: Math.max(0, safeBunks),
        text: safeBunks > 0 ? `Can safely skip ${safeBunks} ${safeBunks === 1 ? 'class' : 'classes'}` : 'On track (borderline)',
      };
    } else {
      // Need to attend Y consecutive classes: (Target * C - A) / (1 - Target)
      const reqClasses = Math.ceil((Target * C - A) / (1 - Target));
      return {
        type: 'danger',
        count: reqClasses,
        text: `Must attend next ${reqClasses} consecutive ${reqClasses === 1 ? 'class' : 'classes'} to hit ${sub.targetPercentage}%`,
      };
    }
  };

  const handleLogClass = (id: string, attended: boolean) => {
    setAttendance((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            classesConducted: s.classesConducted + 1,
            classesAttended: attended ? s.classesAttended + 1 : s.classesAttended,
          };
        }
        return s;
      })
    );
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSub.subjectName) return;

    const subject: AttendanceSubject = {
      id: `att-${Date.now()}`,
      subjectName: newSub.subjectName,
      subjectCode: newSub.subjectCode || 'CS101',
      classesConducted: Number(newSub.classesConducted) || 0,
      classesAttended: Number(newSub.classesAttended) || 0,
      targetPercentage: Number(newSub.targetPercentage) || 75,
      creditHours: Number(newSub.creditHours) || 3,
      faculty: newSub.faculty || 'Faculty',
    };

    setAttendance((prev) => [...prev, subject]);
    setIsAddModalOpen(false);
    setNewSub({
      subjectName: '',
      subjectCode: '',
      classesConducted: 20,
      classesAttended: 18,
      targetPercentage: 75,
      creditHours: 3,
      faculty: '',
    });
  };

  const riskySubjects = attendance.filter((s) => {
    const pct = s.classesConducted > 0 ? (s.classesAttended / s.classesConducted) * 100 : 100;
    return pct < s.targetPercentage;
  });

  return (
    <div id="attendance-view" className="space-y-6 pb-12">
      {/* Header Bento Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white">Attendance Monitoring & Bunk Margin Engine</h1>
            <span className="text-xs px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm">
              Real-Time Tracking
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Calculates exact safe skip limits and required recovery classes for every course to prevent exam hall ticket blocks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 border border-white/10 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Warning Alert if Attendance Risky */}
      {riskySubjects.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-950/40 backdrop-blur-xl border border-amber-500/40 space-y-2 shadow-xl">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Attendance Risk Warning ({riskySubjects.length} {riskySubjects.length === 1 ? 'subject' : 'subjects'} below target)</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            StudyPilot AI has detected low attendance in{' '}
            <strong className="text-white">{riskySubjects.map((s) => s.subjectName).join(', ')}</strong>. The AI study planner has automatically prioritized class attendance and flagged these courses in your daily schedule.
          </p>
        </div>
      )}

      {/* Attendance Subject Cards Grid - Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendance.map((sub) => {
          const pct = sub.classesConducted > 0 ? Math.round((sub.classesAttended / sub.classesConducted) * 100) : 100;
          const margin = calculateMargin(sub);
          const isAtRisk = pct < sub.targetPercentage;

          return (
            <div
              key={sub.id}
              className={`rounded-3xl bg-slate-900/60 backdrop-blur-xl border p-6 space-y-4 transition-all duration-300 hover:shadow-xl ${
                isAtRisk ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-white/5 text-slate-400">
                    {sub.subjectCode} • {sub.creditHours} Credits
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-1.5 leading-snug">{sub.subjectName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{sub.faculty}</p>
                </div>
                <div
                  className={`text-xl font-extrabold px-3.5 py-1 rounded-2xl border backdrop-blur-md ${
                    isAtRisk
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {pct}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Attended: <strong className="text-white">{sub.classesAttended}</strong> / {sub.classesConducted}</span>
                  <span>Target: {sub.targetPercentage}%</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAtRisk ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>

              {/* Bunk Margin / Recovery Recommendation Badge */}
              <div
                className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-center space-x-2.5 ${
                  margin.type === 'safe'
                    ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                }`}
              >
                {margin.type === 'safe' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                )}
                <span className="font-semibold">{margin.text}</span>
              </div>

              {/* Quick Log Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-bold">Log Today's Class:</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleLogClass(sub.id, true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/30 transition-all flex items-center space-x-1 active:scale-95"
                    title="Mark Attended"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Attended</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLogClass(sub.id, false)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold border border-rose-500/30 transition-all flex items-center space-x-1 active:scale-95"
                    title="Mark Bunked / Missed"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Missed</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Course Modal - Bento Style */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubject}
            className="bg-slate-900/90 border border-white/10 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-white">Add Course to Tracker</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={newSub.subjectName}
                  onChange={(e) => setNewSub({ ...newSub, subjectName: e.target.value })}
                  placeholder="e.g. Computer Networks"
                  className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={newSub.subjectCode}
                    onChange={(e) => setNewSub({ ...newSub, subjectCode: e.target.value })}
                    placeholder="e.g. CS304"
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Faculty Name</label>
                  <input
                    type="text"
                    value={newSub.faculty}
                    onChange={(e) => setNewSub({ ...newSub, faculty: e.target.value })}
                    placeholder="e.g. Dr. Gupta"
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Classes Conducted</label>
                  <input
                    type="number"
                    min="0"
                    value={newSub.classesConducted}
                    onChange={(e) => setNewSub({ ...newSub, classesConducted: Number(e.target.value) })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Classes Attended</label>
                  <input
                    type="number"
                    min="0"
                    value={newSub.classesAttended}
                    onChange={(e) => setNewSub({ ...newSub, classesAttended: Number(e.target.value) })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Target %</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={newSub.targetPercentage}
                    onChange={(e) => setNewSub({ ...newSub, targetPercentage: Number(e.target.value) })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 border border-white/10 active:scale-95"
              >
                Save Course
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
