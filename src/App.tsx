import React, { useState, useEffect } from 'react';
import { NavbarAndSidebar } from './components/NavbarAndSidebar';
import { DashboardView } from './components/DashboardView';
import { TimetableManagerView } from './components/TimetableManagerView';
import { AttendanceTrackerView } from './components/AttendanceTrackerView';
import { AssignmentManagerView } from './components/AssignmentManagerView';
import { ExamPlannerView } from './components/ExamPlannerView';
import { AIStudyPlannerView } from './components/AIStudyPlannerView';
import { AIAcademicAssistantView } from './components/AIAcademicAssistantView';
import { SmartNotesView } from './components/SmartNotesView';
import { GoalTrackerView } from './components/GoalTrackerView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { NotificationsModal } from './components/NotificationsModal';
import { PomodoroModal } from './components/PomodoroModal';

import {
  NavigationTab,
  TimetableClass,
  AttendanceSubject,
  Assignment,
  Exam,
  StudySession,
  Goal,
  SmartNoteItem,
  ChatMessage,
  NotificationItem,
} from './types';

import {
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMS,
  INITIAL_STUDY_SESSIONS,
  INITIAL_GOALS,
  INITIAL_SMART_NOTES,
  INITIAL_CHAT,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // App State with LocalStorage Persistence
  const [timetable, setTimetable] = useState<TimetableClass[]>(() => {
    const saved = localStorage.getItem('sp_timetable');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [attendance, setAttendance] = useState<AttendanceSubject[]>(() => {
    const saved = localStorage.getItem('sp_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('sp_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('sp_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('sp_study_sessions');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_SESSIONS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('sp_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [smartNotes, setSmartNotes] = useState<SmartNoteItem[]>(() => {
    const saved = localStorage.getItem('sp_smart_notes');
    return saved ? JSON.parse(saved) : INITIAL_SMART_NOTES;
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('sp_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sp_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [streakDays, setStreakDays] = useState<number>(7);
  const [productivityScore, setProductivityScore] = useState<number>(88);

  // Modals
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activePomodoroSession, setActivePomodoroSession] = useState<StudySession | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('sp_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('sp_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('sp_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('sp_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('sp_study_sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  useEffect(() => {
    localStorage.setItem('sp_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('sp_smart_notes', JSON.stringify(smartNotes));
  }, [smartNotes]);

  useEffect(() => {
    localStorage.setItem('sp_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('sp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handlers
  const handleStartPomodoro = (session: StudySession) => {
    setActivePomodoroSession(session);
  };

  const handleCompleteSession = (id: string) => {
    setStudySessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Completed' } : s))
    );
    setProductivityScore((prev) => Math.min(100, prev + 2));
  };

  const handleRunAiReschedule = () => {
    setActiveTab('planner');
  };

  const handleGenerateRevisionSchedule = (exam: Exam) => {
    // Navigate to study planner with revision sessions pre-filled
    setActiveTab('planner');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Bento Grid Ambient Canvas Glows */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))]" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_85%_85%,rgba(14,165,233,0.08),transparent_50%)]" />

      {/* Navbar and Sub-Navigation */}
      <NavbarAndSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        setIsNotificationsOpen={setIsNotificationsOpen}
        streakDays={streakDays}
        productivityScore={productivityScore}
        onQuickAiAsk={() => setActiveTab('assistant')}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            setActiveTab={setActiveTab}
            studySessions={studySessions}
            assignments={assignments}
            exams={exams}
            attendance={attendance}
            timetable={timetable}
            notifications={notifications}
            streakDays={streakDays}
            productivityScore={productivityScore}
            onStartPomodoro={handleStartPomodoro}
            onRunAiReschedule={handleRunAiReschedule}
          />
        )}

        {activeTab === 'planner' && (
          <AIStudyPlannerView
            studySessions={studySessions}
            setStudySessions={setStudySessions}
            assignments={assignments}
            exams={exams}
            attendance={attendance}
            onStartPomodoro={handleStartPomodoro}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableManagerView timetable={timetable} setTimetable={setTimetable} />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTrackerView attendance={attendance} setAttendance={setAttendance} />
        )}

        {activeTab === 'assignments' && (
          <AssignmentManagerView assignments={assignments} setAssignments={setAssignments} />
        )}

        {activeTab === 'exams' && (
          <ExamPlannerView
            exams={exams}
            setExams={setExams}
            onGenerateRevisionSchedule={handleGenerateRevisionSchedule}
          />
        )}

        {activeTab === 'assistant' && (
          <AIAcademicAssistantView chatHistory={chatHistory} setChatHistory={setChatHistory} />
        )}

        {activeTab === 'smartnotes' && (
          <SmartNotesView smartNotes={smartNotes} setSmartNotes={setSmartNotes} />
        )}

        {activeTab === 'goals' && (
          <GoalTrackerView goals={goals} setGoals={setGoals} streakDays={streakDays} />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            assignments={assignments}
            exams={exams}
            studySessions={studySessions}
            timetable={timetable}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView attendance={attendance} productivityScore={productivityScore} />
        )}
      </main>

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
        setActiveTab={setActiveTab}
      />

      {/* Pomodoro Focus Modal */}
      <PomodoroModal
        session={activePomodoroSession}
        onClose={() => setActivePomodoroSession(null)}
        onCompleteSession={handleCompleteSession}
      />
    </div>
  );
}
