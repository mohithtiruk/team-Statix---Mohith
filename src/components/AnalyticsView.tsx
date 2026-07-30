import React from 'react';
import { BarChart3, TrendingUp, Clock, GraduationCap, CheckCircle2, Award } from 'lucide-react';
import { AttendanceSubject } from '../types';

interface AnalyticsViewProps {
  attendance: AttendanceSubject[];
  productivityScore: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  attendance,
  productivityScore,
}) => {
  const subjectHours = [
    { subject: 'Database Management Systems', hours: 8.5, color: 'bg-blue-500' },
    { subject: 'Data Structures & Algorithms', hours: 10.0, color: 'bg-emerald-500' },
    { subject: 'Operating Systems', hours: 6.0, color: 'bg-amber-500' },
    { subject: 'Computer Networks', hours: 5.5, color: 'bg-indigo-500' },
    { subject: 'Mathematics III', hours: 4.5, color: 'bg-violet-500' },
  ];

  return (
    <div id="analytics-view" className="space-y-6 pb-12">
      {/* Header Bento Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">Academic Analytics & Insights</h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Data-driven intelligence on your study distribution, productivity trends, and course mastery.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center space-x-2 shadow-sm">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Productivity Score: {productivityScore}%</span>
        </div>
      </div>

      {/* Grid: Study Hours Breakdown & Attendance Trends - Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Hours Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Weekly Study Hours per Subject</span>
          </h3>

          <div className="space-y-3.5">
            {subjectHours.map((sh, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                  <span>{sh.subject}</span>
                  <span className="font-mono text-indigo-400">{sh.hours} hrs</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full ${sh.color}`}
                    style={{ width: `${(sh.hours / 12) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Attendance Mastery */}
        <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Course Attendance Distribution</span>
          </h3>

          <div className="space-y-3">
            {attendance.map((sub) => {
              const pct = sub.classesConducted > 0 ? Math.round((sub.classesAttended / sub.classesConducted) * 100) : 100;
              const isAtRisk = pct < sub.targetPercentage;

              return (
                <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-white">{sub.subjectName}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{sub.classesAttended} / {sub.classesConducted} classes attended</p>
                  </div>
                  <div className={`text-sm font-extrabold px-3 py-1 rounded-full border ${isAtRisk ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
