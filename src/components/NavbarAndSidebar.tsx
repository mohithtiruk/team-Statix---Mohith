import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BookOpenCheck,
  BrainCircuit,
  GraduationCap,
  FileText,
  Target,
  BarChart3,
  Bell,
  Sparkles,
  Flame,
  Search,
  Clock,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { NavigationTab, NotificationItem } from '../types';

interface NavbarAndSidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  notifications: NotificationItem[];
  setIsNotificationsOpen: (open: boolean) => void;
  streakDays: number;
  productivityScore: number;
  onQuickAiAsk: () => void;
}

export const NavbarAndSidebar: React.FC<NavbarAndSidebarProps> = ({
  activeTab,
  setActiveTab,
  notifications,
  setIsNotificationsOpen,
  streakDays,
  productivityScore,
  onQuickAiAsk,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'planner', label: 'AI Study Planner', icon: <BrainCircuit className="w-5 h-5" />, badge: 'AI' },
    { id: 'timetable', label: 'Timetable', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'attendance', label: 'Attendance', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'assignments', label: 'Assignments', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'exams', label: 'Exams & Revision', icon: <BookOpenCheck className="w-5 h-5" /> },
    { id: 'assistant', label: 'AI Academic Assistant', icon: <Sparkles className="w-5 h-5 text-indigo-400" /> },
    { id: 'smartnotes', label: 'Smart Notes & Quizzes', icon: <FileText className="w-5 h-5" /> },
    { id: 'goals', label: 'Goals & Streaks', icon: <Target className="w-5 h-5" /> },
    { id: 'calendar', label: 'Unified Calendar', icon: <Clock className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header id="top-navbar" className="sticky top-0 z-40 bg-[#090D16]/80 backdrop-blur-xl border-b border-white/10 text-slate-100 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 focus:outline-none"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center space-x-2.5 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform border border-white/20">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-lg text-white tracking-tight">StudyPilot</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Academic Intelligence Platform</p>
                </div>
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Streak Badge */}
              <div
                onClick={() => setActiveTab('goals')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 hover:border-amber-500/40 hover:bg-slate-800 cursor-pointer transition-colors shadow-sm"
                title="Active Study Streak"
              >
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-300">{streakDays} Day Streak</span>
              </div>

              {/* Productivity Score */}
              <div
                onClick={() => setActiveTab('analytics')}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 hover:bg-slate-800 cursor-pointer transition-colors shadow-sm"
                title="Productivity Score"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-slate-300 font-medium">Score:</span>
                <span className="text-xs font-bold text-emerald-400">{productivityScore}%</span>
              </div>

              {/* Ask AI Button */}
              <button
                type="button"
                id="btn-quick-ask-ai"
                onClick={onQuickAiAsk}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 border border-white/10 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-100" />
                <span className="hidden sm:inline">Ask AI Tutor</span>
                <span className="sm:hidden">AI</span>
              </button>

              {/* Notifications Bell */}
              <button
                type="button"
                id="btn-notifications-toggle"
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-md shadow-rose-500/50">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex">
          <div className="w-72 bg-slate-900 border-r border-slate-800 h-full p-4 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-6 h-6 text-indigo-400" />
                  <span className="font-bold text-white">StudyPilot AI Menu</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-400/20 text-indigo-300 font-bold border border-indigo-400/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
              StudyPilot AI v2.5 • Academic Intelligence
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar + Subnav */}
      <div id="desktop-subnav" className="hidden lg:block bg-[#090D16]/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1.5 overflow-x-auto py-2.5 scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
