import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Upload,
  BookOpen,
  HelpCircle,
  RotateCw,
  CheckCircle2,
  XCircle,
  Layers,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { SmartNoteItem, Flashcard, QuizQuestion } from '../types';

interface SmartNotesViewProps {
  smartNotes: SmartNoteItem[];
  setSmartNotes: React.Dispatch<React.SetStateAction<SmartNoteItem[]>>;
}

export const SmartNotesView: React.FC<SmartNotesViewProps> = ({
  smartNotes,
  setSmartNotes,
}) => {
  const [activeTab, setActiveTab] = useState<'summaries' | 'flashcards' | 'quizzes'>('summaries');
  const [selectedNoteId, setSelectedNoteId] = useState<string>(smartNotes[0]?.id || '');

  // Generator form state
  const [pastedText, setPastedText] = useState('');
  const [subjectName, setSubjectName] = useState('Database Management Systems');
  const [noteTitle, setNoteTitle] = useState('Module 3 Transactions & Concurrency Control');
  const [isProcessing, setIsProcessing] = useState(false);

  // Active Flashcard Flip Index
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);

  // Active Quiz User Selected Option
  const [userQuizAnswers, setUserQuizAnswers] = useState<{ [qIdx: number]: number }>({});

  const selectedNote = smartNotes.find((n) => n.id === selectedNoteId) || smartNotes[0];

  const handleGenerateSmartNotes = async () => {
    if (!pastedText.trim() && !noteTitle) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/ai/smart-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notesContent: pastedText || 'ACID properties and Two-Phase Locking transaction processing in relational database systems.',
          subjectName,
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        const newNote: SmartNoteItem = {
          id: `sn-${Date.now()}`,
          title: noteTitle || 'AI Synthesized Notes',
          subject: subjectName,
          originalText: pastedText,
          summary: data.result.summary || 'Concise AI summary generated for your lecture notes.',
          keyTakeaways: data.result.keyTakeaways || [],
          flashcards: data.result.flashcards || [],
          quizQuestions: data.result.quizQuestions || [],
          revisionCheatsheet: data.result.revisionCheatsheet || '',
          createdDate: new Date().toISOString().split('T')[0],
        };

        setSmartNotes((prev) => [newNote, ...prev]);
        setSelectedNoteId(newNote.id);
        setPastedText('');
      }
    } catch (err) {
      console.error('Smart notes error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id="smart-notes-view" className="space-y-6 pb-12">
      {/* Header Bento Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white">Smart Notes, Flashcards & Quiz Synthesizer</h1>
            <span className="text-xs px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 flex items-center space-x-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>AI Study Materials</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Upload or paste lecture notes. StudyPilot AI extracts bullet summaries, 3D flip flashcards, and interactive practice quizzes automatically.
          </p>
        </div>
      </div>

      {/* Generator Bento Box */}
      <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
        <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>Synthesize New Smart Notes & Quiz</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Note Title</label>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g. Operating Systems Paging & Virtual Memory"
              className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Course / Subject</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Operating Systems"
              className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Paste Lecture Notes / PDF Text</label>
          <textarea
            rows={3}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste text from your PowerPoint slides, lecture notes, or PDF..."
            className="w-full p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGenerateSmartNotes}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/20 border border-white/10 active:scale-95"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Generating Summaries, Flashcards & Quizzes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize Materials with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* View Saved Notes Tabs & Materials */}
      {selectedNote && (
        <div className="space-y-6">
          {/* Note Selector Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {smartNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setFlippedCardIndex(null);
                  setUserQuizAnswers({});
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                  selectedNote.id === note.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900/60 backdrop-blur-xl text-slate-400 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {note.title}
              </button>
            ))}
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex space-x-2 border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('summaries')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'summaries' ? 'bg-slate-800 text-white border border-white/10 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Summary & Key Takeaways</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('flashcards')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'flashcards' ? 'bg-slate-800 text-white border border-white/10 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Flashcards ({selectedNote.flashcards.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quizzes')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'quizzes' ? 'bg-slate-800 text-white border border-white/10 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Practice Quiz ({selectedNote.quizQuestions.length})</span>
            </button>
          </div>

          {/* TAB 1: SUMMARY & TAKEAWAYS */}
          {activeTab === 'summaries' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Executive AI Summary</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-wrap">
                  {selectedNote.summary}
                </p>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300">Key Takeaways & Important Points:</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {selectedNote.keyTakeaways.map((kt, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{kt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Revision Cheatsheet Box */}
              <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 space-y-3 shadow-xl">
                <h3 className="text-sm font-extrabold text-amber-300 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Revision Cheatsheet</span>
                </h3>
                <pre className="p-3.5 rounded-2xl bg-slate-950/80 text-amber-200/90 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap border border-white/5">
                  {selectedNote.revisionCheatsheet}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedNote.flashcards.map((fc, idx) => {
                const isFlipped = flippedCardIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setFlippedCardIndex(isFlipped ? null : idx)}
                    className={`h-56 p-6 rounded-3xl border cursor-pointer transition-all duration-300 flex flex-col justify-between select-none shadow-xl ${
                      isFlipped
                        ? 'bg-indigo-950/80 border-indigo-500/50 shadow-indigo-500/10'
                        : 'bg-slate-900/60 backdrop-blur-xl border-white/10 hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-indigo-400">Card #{idx + 1}</span>
                      <span className="text-slate-400 font-semibold">
                        {isFlipped ? 'ANSWER (BACK)' : 'QUESTION (FRONT)'}
                      </span>
                    </div>

                    <div className="my-auto text-center">
                      <p className={`text-sm font-extrabold leading-relaxed ${isFlipped ? 'text-indigo-200' : 'text-white'}`}>
                        {isFlipped ? fc.answer : fc.question}
                      </p>
                    </div>

                    <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 font-semibold">
                      <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Click card to flip</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: PRACTICE QUIZ */}
          {activeTab === 'quizzes' && (
            <div className="space-y-6">
              {selectedNote.quizQuestions.map((q, qIdx) => {
                const userChoice = userQuizAnswers[qIdx];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === q.correctOptionIndex;

                return (
                  <div key={qIdx} className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-extrabold text-white">
                        Q{qIdx + 1}: {q.question}
                      </h4>
                      {isAnswered && (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            isCorrect ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {isCorrect ? 'Correct! 🎉' : 'Incorrect'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-800/80 border-white/10 text-slate-200 hover:bg-slate-750 hover:border-white/20';
                        if (isAnswered) {
                          if (optIdx === q.correctOptionIndex) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                          } else if (optIdx === userChoice) {
                            btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() =>
                              setUserQuizAnswers((prev) => ({
                                ...prev,
                                [qIdx]: optIdx,
                              }))
                            }
                            className={`p-3.5 rounded-2xl border text-xs text-left transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 text-xs text-slate-300 border border-white/5 leading-relaxed">
                        <strong className="text-indigo-400">Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
