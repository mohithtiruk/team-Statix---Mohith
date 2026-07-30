import React from 'react';
import {
  BrainCircuit,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Calendar,
  Sparkles,
  Flame,
  TrendingUp,
  ArrowRight,
  Play,
  Plus,
  FileCheck,
  ShieldAlert,
  Bot,
  ChevronRight,
} from 'lucide-react';
import {
  NavigationTab,
  StudySession,
  Assignment,
  Exam,
  AttendanceSubject,
  NotificationItem,
  TimetableClass,
} from '../types';

interface DashboardViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  studySessions: StudySession[];
  assignments: Assignment[];
  exams: Exam[];
  attendance: AttendanceSubject[];
  timetable: TimetableClass[];
  notifications: NotificationItem[];
  streakDays: number;
  productivityScore: number;
  onStartPomodoro: (session: StudySession) => void;
  onRunAiReschedule: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  studySessions,
  assignments,
  exams,
  attendance,
  timetable,
  notifications,
  streakDays,
  productivityScore,
  onStartPomodoro,
  onRunAiReschedule,
}) => {
  // Compute Key Dashboard Metrics
  const lowAttendanceSubjects = attendance.filter((a) => {
    const pct = a.classesConducted > 0 ? (a.classesAttended / a.classesConducted) * 100 : 100;
    return pct < a.targetPercentage;
  });

  const pendingAssignments = assignments.filter((a) => a.status !== 'Completed');
  const urgentAssignment = pendingAssignments[0];

  const upcomingExam = exams[0];

  const todaySessions = studySessions.filter((s) => s.day === 'Today' || s.day === 'Monday');

  const overallAttPct = Math.round(
    attendance.reduce(
      (acc, s) => acc + (s.classesConducted > 0 ? (s.classesAttended / s.classesConducted) * 100 : 100),
      0
    ) / (attendance.length || 1)
  );

  return (
    <div id="dashboard-view" className="space-y-6 pb-12">
      {/* Welcome & AI Banner - Hero Bento Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-slate-950/90 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Pilot Active • Monitored</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">Semester 5 • Computer Science</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good morning, Alex! 🚀
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              StudyPilot AI has generated your optimized schedule for today. You have{' '}
              <strong className="text-indigo-300">{pendingAssignments.length} pending assignments</strong> and 1 low attendance warning.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-ai-reschedule"
              onClick={onRunAiReschedule}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 border border-white/10 active:scale-95"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Auto-Reschedule Workload</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('planner')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-all shadow-sm"
            >
              <span>View Full Planner</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Low Attendance Warning Alert Card (If any) */}
      {lowAttendanceSubjects.length > 0 && (
        <div id="alert-low-attendance" className="rounded-3xl bg-amber-950/40 border border-amber-500/40 p-5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0 border border-amber-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-200">
                Attendance Risk Detected: {lowAttendanceSubjects.map((s) => s.subjectName).join(', ')}
              </h3>
              <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
                Current attendance is below the {lowAttendanceSubjects[0].targetPercentage}% threshold. StudyPilot AI has automatically adjusted your revision schedule to prioritize class attendance.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 shrink-0 transition-colors shadow-md shadow-amber-500/20"
          >
            Manage Attendance
          </button>
        </div>
      )}

      {/* 4 Core Summary Stat Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Attendance Card */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Attendance</span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className={`text-3xl font-extrabold ${overallAttPct >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {overallAttPct}%
            </span>
            <span className="text-xs text-slate-400 font-medium">Target: 75%</span>
          </div>
          <div className="mt-3.5 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${overallAttPct >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, overallAttPct)}%` }}
            />
          </div>
        </div>

        {/* Pending Assignments */}
        <div
          onClick={() => setActiveTab('assignments')}
          className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/10 cursor-pointer transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Assignments</span>
            <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{pendingAssignments.length}</span>
            <span className="text-xs text-sky-400 font-bold">Due this week</span>
          </div>
          <p className="mt-3.5 text-xs text-slate-400 truncate">
            Next: <span className="text-slate-200 font-medium">{urgentAssignment ? urgentAssignment.title : 'All caught up!'}</span>
          </p>
        </div>

        {/* Productivity Score */}
        <div
          onClick={() => setActiveTab('analytics')}
          className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Productivity Score</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-400">{productivityScore}%</span>
            <span className="text-xs text-emerald-300/80 font-bold">+4% this week</span>
          </div>
          <p className="mt-3.5 text-xs text-slate-400 font-medium">3.8 hrs study logged today</p>
        </div>

        {/* Active Study Streak */}
        <div
          onClick={() => setActiveTab('goals')}
          className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Study Streak</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-400">{streakDays} Days</span>
            <span className="text-xs text-amber-300/80 font-bold">🔥 On Fire</span>
          </div>
          <p className="mt-3.5 text-xs text-slate-400 font-medium">Target: 10 day streak milestone</p>
        </div>
      </div>

      {/* Main Asymmetrical Bento Grid: Today's AI Schedule vs Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Interactive AI Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-extrabold text-white">Today's AI Schedule</h2>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                    Adaptive
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Pomodoro focus sessions allocated based on deadline urgency</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('planner')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
              >
                <span>Full Planner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todaySessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    session.status === 'Completed'
                      ? 'bg-slate-900/40 border-white/5 opacity-70'
                      : 'bg-slate-800/50 border-white/10 hover:border-indigo-500/40 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 shrink-0 shadow-sm ${
                        session.priority === 'High'
                          ? 'bg-rose-500 shadow-rose-500/50'
                          : session.priority === 'Medium'
                          ? 'bg-amber-500 shadow-amber-500/50'
                          : 'bg-sky-500 shadow-sky-500/50'
                      }`}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-indigo-400">{session.timeSlot}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/80 border border-white/5 text-slate-300 font-medium">
                          {session.durationMinutes} mins • {session.pomodoroCount} Pomodoros
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{session.taskTitle}</h4>
                      <p className="text-xs text-slate-400">{session.subject}</p>
                      {session.aiTip && (
                        <p className="text-[11px] text-indigo-300/90 mt-1.5 italic flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-indigo-400 inline shrink-0" />
                          <span>Tip: {session.aiTip}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    {session.status === 'Completed' ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onStartPomodoro(session)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/30 border border-white/10 active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Session</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Recommendations Bento Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950/80 border border-indigo-500/30 p-6 space-y-3.5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">AI Academic Assistant Recommendations</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start space-x-2 bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-indigo-400 font-bold">•</span>
                <span>
                  <strong>Operating Systems:</strong> Attendance is 68.2%. Attend the upcoming lab on Thursday (14:00) to prevent a hall ticket block.
                </span>
              </li>
              <li className="flex items-start space-x-2 bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-indigo-400 font-bold">•</span>
                <span>
                  <strong>DBMS Assignment:</strong> Deadline is in 36 hours. Allocate 2 hours this evening for B+ Tree SQL implementation.
                </span>
              </li>
              <li className="flex items-start space-x-2 bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-indigo-400 font-bold">•</span>
                <span>
                  <strong>Smart Notes:</strong> Try generating flashcards for DBMS Transaction ACID properties before your mid-term quiz.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Today's Classes & Upcoming Exams */}
        <div className="space-y-6">
          {/* Today's Lectures Bento Card */}
          <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Today's Classes</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('timetable')}
                className="text-xs text-slate-400 hover:text-white font-medium"
              >
                Timetable →
              </button>
            </div>

            <div className="space-y-2.5">
              {timetable.slice(0, 3).map((cls) => (
                <div key={cls.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-white/5 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{cls.subjectCode} • {cls.type}</span>
                    <span className="text-slate-400 font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-900/60 border border-white/5">{cls.startTime} - {cls.endTime}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 mt-1.5">{cls.subjectName}</h4>
                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
                    <span>{cls.faculty}</span>
                    <span className="text-indigo-300 font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">Room: {cls.classroom}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Examinations Bento Card */}
          <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Upcoming Exams</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('exams')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold"
              >
                View Exams
              </button>
            </div>

            {upcomingExam && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-900 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-300">{upcomingExam.subject}</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    {upcomingExam.difficulty}
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Date: <strong className="text-white">{upcomingExam.date} ({upcomingExam.time})</strong>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Revision Prep</span>
                    <span>{upcomingExam.completedPrepHours}/{upcomingExam.expectedPrepHours} hrs</span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (upcomingExam.completedPrepHours / upcomingExam.expectedPrepHours) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
