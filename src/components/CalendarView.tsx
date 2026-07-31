import React, { useState } from 'react';
import { Clock, Calendar, CheckSquare, BookOpenCheck, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Assignment, Exam, StudySession, TimetableClass } from '../types';

interface CalendarViewProps {
  assignments: Assignment[];
  exams: Exam[];
  studySessions: StudySession[];
  timetable: TimetableClass[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  assignments,
  exams,
  studySessions,
  timetable,
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Classes' | 'Exams' | 'Assignments' | 'Sessions'>('All');

  // Days of current month view (Aug 2026)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Map dates to events
  const eventsByDay: { [day: number]: { title: string; type: 'class' | 'exam' | 'assignment' | 'session'; time: string }[] } = {
    1: [{ title: 'DBMS Assignment Prep', type: 'assignment', time: '18:00' }],
    2: [{ title: 'DBMS Assignment Deadline', type: 'assignment', time: '23:59' }],
    4: [{ title: 'Red-Black Tree Assignment', type: 'assignment', time: '18:00' }],
    8: [{ title: 'Operating Systems Quiz 2', type: 'exam', time: '11:30' }],
    12: [{ title: 'DBMS Mid-Term Exam', type: 'exam', time: '10:00' }],
    15: [{ title: 'DSA Mid-Term Exam', type: 'exam', time: '14:00' }],
  };

  return (
    <div id="calendar-view" className="space-y-6 pb-12">
      {/* Header Bento Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">Unified Academic Calendar</h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Integrated calendar view combining classes, assignment deadlines, examination dates, and AI study sessions.
          </p>
        </div>

        {/* Filter Pills - Bento Style */}
        <div className="flex space-x-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-white/10">
          {(['All', 'Classes', 'Exams', 'Assignments', 'Sessions'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterType(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === f ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid Header - Bento Card */}
      <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-base font-extrabold text-white">August 2026</h2>
          <div className="flex items-center space-x-2">
            <button type="button" className="p-2 rounded-xl bg-slate-800/80 border border-white/5 text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-300">Today: Aug 1, 2026</span>
            <button type="button" className="p-2 rounded-xl bg-slate-800/80 border border-white/5 text-slate-400 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday Names */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 pb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Month Days Grid */}
        <div className="grid grid-cols-7 gap-2.5">
          {daysInMonth.map((dayNum) => {
            const evs = eventsByDay[dayNum] || [];
            const isToday = dayNum === 1;

            return (
              <div
                key={dayNum}
                className={`min-h-[95px] p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isToday
                    ? 'bg-indigo-950/50 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-800/30 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isToday ? 'text-indigo-400 font-extrabold' : 'text-slate-300'}`}>
                    {dayNum}
                  </span>
                  {isToday && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500 text-white font-extrabold">TODAY</span>}
                </div>

                <div className="space-y-1">
                  {evs.map((ev, idx) => (
                    <div
                      key={idx}
                      className={`p-1.5 rounded-xl text-[10px] font-bold truncate leading-tight ${
                        ev.type === 'exam'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : ev.type === 'assignment'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                      title={`${ev.title} (${ev.time})`}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
