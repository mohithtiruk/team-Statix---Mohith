import React, { useState } from 'react';
import {
  BookOpenCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  Award,
  Layers,
  X,
} from 'lucide-react';
import { Exam } from '../types';

interface ExamPlannerViewProps {
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  onGenerateRevisionSchedule: (exam: Exam) => void;
}

export const ExamPlannerView: React.FC<ExamPlannerViewProps> = ({
  exams,
  setExams,
  onGenerateRevisionSchedule,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Exam>>({
    subject: '',
    subjectCode: 'CS301',
    date: '2026-08-15',
    time: '10:00',
    totalMarks: 50,
    difficulty: 'Hard',
    expectedPrepHours: 12,
    completedPrepHours: 0,
  });

  const handleToggleTopic = (examId: string, topicIndex: number) => {
    setExams((prev) =>
      prev.map((ex) => {
        if (ex.id === examId) {
          const updated = [...ex.syllabusTopics];
          updated[topicIndex] = {
            ...updated[topicIndex],
            completed: !updated[topicIndex].completed,
          };
          return { ...ex, syllabusTopics: updated };
        }
        return ex;
      })
    );
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.date) return;

    const newExam: Exam = {
      id: `ex-${Date.now()}`,
      subject: formData.subject,
      subjectCode: formData.subjectCode || 'GEN101',
      date: formData.date,
      time: formData.time || '10:00',
      totalMarks: Number(formData.totalMarks) || 50,
      difficulty: (formData.difficulty as Exam['difficulty']) || 'Medium',
      expectedPrepHours: Number(formData.expectedPrepHours) || 10,
      completedPrepHours: 0,
      syllabusTopics: [
        { title: 'Module 1: Fundamental Concepts & Definitions', completed: false },
        { title: 'Module 2: Core Theorems & Algorithms', completed: false },
        { title: 'Module 3: Advanced Problem Solving & Numerical Applications', completed: false },
      ],
    };

    setExams((prev) => [...prev, newExam]);
    setIsModalOpen(false);
    setFormData({
      subject: '',
      subjectCode: 'CS301',
      date: '2026-08-15',
      time: '10:00',
      totalMarks: 50,
      difficulty: 'Hard',
      expectedPrepHours: 12,
      completedPrepHours: 0,
    });
  };

  const getDaysLeft = (dateStr: string) => {
    const diffMs = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days <= 0 ? 0 : days;
  };

  return (
    <div id="exams-view" className="space-y-6 pb-12">
      {/* Header Bento Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white">Examination & Revision Planner</h1>
            <span className="text-xs px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-sm">
              Spaced Repetition
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Generates a personalized revision schedule that spreads preparation across remaining days instead of last-minute cramming.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 border border-white/10 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exam</span>
        </button>
      </div>

      {/* Exam Cards Grid - Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exams.map((exam) => {
          const daysLeft = getDaysLeft(exam.date);
          const prepPct = Math.round((exam.completedPrepHours / (exam.expectedPrepHours || 1)) * 100);

          return (
            <div
              key={exam.id}
              className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 space-y-5 hover:border-amber-500/40 transition-all duration-300 shadow-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-400 font-mono">{exam.subjectCode}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-white/5 text-slate-300 font-semibold">
                      {exam.totalMarks} Marks
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        exam.difficulty === 'Hard'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : exam.difficulty === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {exam.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-1.5">{exam.subject}</h3>
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold text-amber-400">{daysLeft} Days</div>
                  <span className="text-[11px] text-slate-400 font-medium">Remaining</span>
                </div>
              </div>

              {/* Date & Time */}
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Exam Date: <strong>{exam.date}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{exam.time}</span>
                </div>
              </div>

              {/* Prep Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Revision Progress ({exam.completedPrepHours} / {exam.expectedPrepHours} hrs)</span>
                  <span className="font-bold text-amber-400">{prepPct}%</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, prepPct)}%` }}
                  />
                </div>
              </div>

              {/* Syllabus Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Syllabus Modules Breakdown:</span>
                </span>
                <div className="space-y-1.5 bg-slate-950/40 p-3.5 rounded-2xl border border-white/5">
                  {exam.syllabusTopics.map((topic, idx) => (
                    <label
                      key={idx}
                      className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-xl hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <input
                          type="checkbox"
                          checked={topic.completed}
                          onChange={() => handleToggleTopic(exam.id, idx)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-white/10"
                        />
                        <span className={topic.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                          {topic.title}
                        </span>
                      </div>
                      {topic.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </label>
                  ))}
                </div>
              </div>

              {/* AI Auto-Revision Button */}
              <button
                type="button"
                onClick={() => onGenerateRevisionSchedule(exam)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-indigo-600 to-indigo-500 hover:from-amber-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-600/20 border border-white/10 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Generate AI Spaced Revision Schedule</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Exam Modal - Bento Style */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveExam}
            className="bg-slate-900/90 border border-white/10 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-white">Add Upcoming Examination</h3>
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Operating Systems Final"
                  className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={formData.subjectCode}
                    onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                    placeholder="e.g. CS303"
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Exam Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Exam Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Difficulty Level</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Exam['difficulty'] })}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Hard">Hard</option>
                    <option value="Medium">Medium</option>
                    <option value="Easy">Easy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Expected Prep Hours</label>
                  <input
                    type="number"
                    value={formData.expectedPrepHours}
                    onChange={(e) => setFormData({ ...formData, expectedPrepHours: Number(e.target.value) })}
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
                Save Exam
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
