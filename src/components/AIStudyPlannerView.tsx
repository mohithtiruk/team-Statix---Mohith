import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sliders,
  Calendar,
  Flame,
  AlertCircle,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { StudySession, Assignment, Exam, AttendanceSubject } from '../types';

interface AIStudyPlannerViewProps {
  studySessions: StudySession[];
  setStudySessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
  assignments: Assignment[];
  exams: Exam[];
  attendance: AttendanceSubject[];
  onStartPomodoro: (session: StudySession) => void;
}

export const AIStudyPlannerView: React.FC<AIStudyPlannerViewProps> = ({
  studySessions,
  setStudySessions,
  assignments,
  exams,
  attendance,
  onStartPomodoro,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [freeHours, setFreeHours] = useState<number>(4);
  const [targetGoal, setTargetGoal] = useState('Maintain top grades and 80%+ attendance');
  const [aiNote, setAiNote] = useState<string | null>(null);

  // Generate Plan via Gemini Backend
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setAiNote(null);

    try {
      const response = await fetch('/api/ai/study-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignments,
          exams,
          attendance,
          freeHoursPerDay: freeHours,
          targetGoal,
        }),
      });

      const result = await response.json();
      if (result.success && result.plan?.dailyPlans?.length > 0) {
        const newSessions: StudySession[] = [];
        result.plan.dailyPlans.forEach((dp: any, dpIdx: number) => {
          const dayName = dpIdx === 0 ? 'Today' : dpIdx === 1 ? 'Tomorrow' : dp.day || 'Day';
          dp.sessions?.forEach((s: any, sIdx: number) => {
            newSessions.push({
              id: `ai-ss-${Date.now()}-${dpIdx}-${sIdx}`,
              day: dayName,
              timeSlot: s.timeSlot || '17:00 - 18:00',
              subject: s.subject || 'Core Subject',
              taskTitle: s.taskTitle || 'Study Session',
              type: (s.type as StudySession['type']) || 'Study',
              durationMinutes: s.durationMinutes || 45,
              pomodoroCount: s.pomodoroCount || 2,
              priority: (s.priority as StudySession['priority']) || 'Medium',
              status: 'Scheduled',
              aiTip: s.aiTip || 'Focus on active recall testing.',
            });
          });
        });

        setStudySessions(newSessions);
        setAiNote(`AI generated ${newSessions.length} adaptive study sessions tailored to your deadlines!`);
      }
    } catch (err) {
      console.error('Planner error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Reschedule Workload via Gemini Backend
  const handleRescheduleWorkload = async () => {
    setIsRescheduling(true);
    setAiNote(null);

    const missed = studySessions.filter((s) => s.status === 'Missed');
    const remaining = studySessions.filter((s) => s.status === 'Scheduled');

    try {
      const response = await fetch('/api/ai/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missedTasks: missed,
          currentSchedule: remaining,
          urgentAdditions: assignments.filter((a) => a.priority === 'High' && a.status !== 'Completed'),
        }),
      });

      const result = await response.json();
      if (result.success && result.data?.rebalancedSessions?.length > 0) {
        const rebalanced: StudySession[] = result.data.rebalancedSessions.map((s: any, idx: number) => ({
          id: s.id || `resched-${Date.now()}-${idx}`,
          day: s.day || 'Today',
          timeSlot: s.timeSlot || '19:00 - 20:00',
          subject: s.subject || 'Core Course',
          taskTitle: s.taskTitle || 'Catch-Up Session',
          type: (s.type as StudySession['type']) || 'Study',
          durationMinutes: s.durationMinutes || 45,
          pomodoroCount: Math.ceil((s.durationMinutes || 45) / 25),
          priority: 'High',
          status: 'Scheduled',
          aiTip: s.aiAdjustNote || 'Re-scheduled to catch up missed workload.',
        }));

        setStudySessions(rebalanced);
        setAiNote(result.data.rescheduleReasoning || 'Schedule rebalanced automatically by AI!');
      }
    } catch (err) {
      console.error('Reschedule error:', err);
    } finally {
      setIsRescheduling(false);
    }
  };

  const toggleSessionStatus = (id: string, status: StudySession['status']) => {
    setStudySessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  return (
    <div id="planner-view" className="space-y-6 pb-12">
      {/* Header Bento Card */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white">AI Adaptive Study Scheduler</h1>
            <span className="text-xs px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 flex items-center space-x-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Deep Analysis</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            StudyPilot AI continuously evaluates your assignments, exam dates, attendance targets, and available hours to synthesize the most optimal daily learning plan.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="btn-rebalance-workload"
            onClick={handleRescheduleWorkload}
            disabled={isRescheduling}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 text-sky-400 ${isRescheduling ? 'animate-spin' : ''}`} />
            <span>AI Reschedule Missed Tasks</span>
          </button>

          <button
            type="button"
            id="btn-generate-ai-plan"
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 border border-white/10 active:scale-95 disabled:opacity-50"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing Plan...' : 'Generate AI Study Plan'}</span>
          </button>
        </div>
      </div>

      {/* AI Notification Alert */}
      {aiNote && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-200 text-xs flex items-center space-x-2.5 backdrop-blur-xl shadow-md">
          <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{aiNote}</span>
        </div>
      )}

      {/* Configuration Sliders Bento Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-5 items-center shadow-xl">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            Available Free Study Hours / Day: <strong className="text-indigo-400">{freeHours} hrs</strong>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={freeHours}
            onChange={(e) => setFreeHours(Number(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-300 mb-2">Target Academic Goal</label>
          <input
            type="text"
            value={targetGoal}
            onChange={(e) => setTargetGoal(e.target.value)}
            placeholder="e.g. Maximize DBMS & DSA Grades while recovering OS attendance"
            className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Scheduled Sessions List */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Current Study Schedule & Pomodoro Blocks</span>
        </h3>

        <div className="space-y-3">
          {studySessions.map((session) => (
            <div
              key={session.id}
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl ${
                session.status === 'Completed'
                  ? 'bg-slate-900/40 border-white/5 opacity-70'
                  : session.status === 'Missed'
                  ? 'bg-rose-950/20 border-rose-500/30 shadow-md'
                  : 'bg-slate-900/60 border-white/10 hover:border-indigo-500/40 hover:shadow-xl'
              }`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-400 font-mono">{session.timeSlot}</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-white/5 text-slate-300 font-semibold">
                    {session.day}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      session.priority === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : session.priority === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    {session.priority} Priority
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-white">{session.taskTitle}</h4>
                <p className="text-xs text-slate-400 font-medium">{session.subject}</p>

                {session.aiTip && (
                  <p className="text-xs text-indigo-300/80 italic flex items-center space-x-1 mt-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>AI Strategy: {session.aiTip}</span>
                  </p>
                )}
              </div>

              {/* Status & Start Controls */}
              <div className="flex items-center space-x-3 self-end md:self-center shrink-0">
                {session.status !== 'Completed' && (
                  <button
                    type="button"
                    onClick={() => onStartPomodoro(session)}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20 border border-white/10 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Pomodoro Timer</span>
                  </button>
                )}

                <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => toggleSessionStatus(session.id, 'Completed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 ${
                      session.status === 'Completed'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-emerald-300'
                    }`}
                    title="Mark Completed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Done</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSessionStatus(session.id, 'Missed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 ${
                      session.status === 'Missed'
                        ? 'bg-rose-500 text-white'
                        : 'text-slate-400 hover:text-rose-300'
                    }`}
                    title="Mark Missed"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Missed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSessionStatus(session.id, 'Scheduled')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      session.status === 'Scheduled' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Reset Status"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
