import React, { useState } from 'react';
import {
  CalendarDays,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  MapPin,
  User,
  FileText,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { TimetableClass } from '../types';

interface TimetableManagerViewProps {
  timetable: TimetableClass[];
  setTimetable: React.Dispatch<React.SetStateAction<TimetableClass[]>>;
}

export const TimetableManagerView: React.FC<TimetableManagerViewProps> = ({
  timetable,
  setTimetable,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [rawText, setRawText] = useState('');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Form State for Manual Add/Edit
  const [formData, setFormData] = useState<Partial<TimetableClass>>({
    subjectName: '',
    subjectCode: '',
    faculty: '',
    classroom: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    type: 'Lecture',
    color: 'emerald',
  });

  const days: TimetableClass['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const colorOptions = ['emerald', 'blue', 'amber', 'indigo', 'violet', 'teal', 'rose'];

  // Handle File Upload and Conversion to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
      setFileMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  // Execute AI Extraction Call
  const handleExtractWithAI = async () => {
    if (!fileBase64 && !rawText.trim()) {
      setParseError('Please upload an image/document or paste your timetable text.');
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const response = await fetch('/api/ai/timetable-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: fileBase64,
          mimeType: fileMimeType,
          textContent: rawText,
        }),
      });

      const result = await response.json();
      if (result.success && result.data?.classes?.length > 0) {
        const extractedClasses: TimetableClass[] = result.data.classes.map((c: any, index: number) => ({
          id: `extracted-${Date.now()}-${index}`,
          subjectName: c.subjectName || 'Extracted Subject',
          subjectCode: c.subjectCode || 'CS101',
          faculty: c.faculty || 'Faculty Member',
          classroom: c.classroom || 'Main Hall',
          day: (c.day as TimetableClass['day']) || 'Monday',
          startTime: c.startTime || '09:00',
          endTime: c.endTime || '10:30',
          type: (c.type as TimetableClass['type']) || 'Lecture',
          color: colorOptions[index % colorOptions.length],
        }));

        setTimetable((prev) => [...prev, ...extractedClasses]);
        setIsUploadModalOpen(false);
        setRawText('');
        setFileBase64(null);
      } else {
        setParseError(result.error || 'Could not parse structured timetable from content.');
      }
    } catch (err: any) {
      setParseError('Failed to communicate with AI timetable parser.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectName || !formData.day || !formData.startTime || !formData.endTime) return;

    const newClass: TimetableClass = {
      id: `cls-${Date.now()}`,
      subjectName: formData.subjectName,
      subjectCode: formData.subjectCode || 'GEN101',
      faculty: formData.faculty || 'TBD',
      classroom: formData.classroom || 'Auditorium',
      day: formData.day as TimetableClass['day'],
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: (formData.type as TimetableClass['type']) || 'Lecture',
      color: formData.color || 'blue',
    };

    setTimetable((prev) => [...prev, newClass]);
    setIsAddModalOpen(false);
    setFormData({
      subjectName: '',
      subjectCode: '',
      faculty: '',
      classroom: '',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      type: 'Lecture',
      color: 'emerald',
    });
  };

  const handleDeleteClass = (id: string) => {
    setTimetable((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div id="timetable-view" className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white">Smart Timetable Management</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              AI OCR Powered
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upload images, PDFs, or CSV files. StudyPilot AI extracts classes, labs, faculty, and room numbers automatically.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            id="btn-upload-timetable"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload / AI Extract</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* Weekly Timetable Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {days.map((day) => {
          const dayClasses = timetable.filter((c) => c.day === day);

          return (
            <div key={day} className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-sm font-extrabold text-white">{day}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                </span>
              </div>

              {dayClasses.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs italic">No classes scheduled</div>
              ) : (
                <div className="space-y-3">
                  {dayClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="group relative p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-500/50 transition-all space-y-2"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteClass(cls.id)}
                        className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                        title="Delete class"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center justify-between pr-4">
                        <span className="text-[11px] font-bold text-indigo-400 font-mono">
                          {cls.startTime} - {cls.endTime}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                          {cls.type}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-extrabold text-white leading-tight">{cls.subjectName}</h4>
                        <span className="text-[10px] font-bold text-slate-400">{cls.subjectCode}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-700/50 flex flex-col space-y-1 text-[11px] text-slate-400">
                        <div className="flex items-center space-x-1.5 truncate">
                          <User className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{cls.faculty}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span className="text-indigo-300 font-medium">{cls.classroom}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Extraction Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">AI Timetable Import & OCR</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {parseError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Upload Schedule Image / PDF / CSV
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf,.csv,.txt"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
              </div>

              <div className="text-center text-xs text-slate-500 font-semibold">— OR PASTE SCHEDULE TEXT —</div>

              {/* Text Area Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Paste Schedule Text / WhatsApp Notice
                </label>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="e.g. Monday 9:00 AM - 10:30 AM: Data Structures (CS301) by Prof Sharma in LHC-201..."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExtractWithAI}
                disabled={isParsing}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/20"
              >
                {isParsing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing Schedule with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract & Save to Schedule</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Class Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleManualAdd}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Class manually</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  placeholder="e.g. Operating Systems"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={formData.subjectCode}
                    onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                    placeholder="e.g. CS303"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Classroom</label>
                  <input
                    type="text"
                    value={formData.classroom}
                    onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                    placeholder="e.g. LHC-202"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Faculty Name</label>
                  <input
                    type="text"
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    placeholder="e.g. Prof. Mehta"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Day of Week *</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value as TimetableClass['day'] })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Class Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as TimetableClass['type'] })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Lab Session</option>
                  <option value="Tutorial">Tutorial</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                Save Class
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
