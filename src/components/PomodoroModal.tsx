import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, CheckCircle2, Sparkles, Volume2, VolumeX, Flame } from 'lucide-react';
import { StudySession } from '../types';

interface PomodoroModalProps {
  session: StudySession | null;
  onClose: () => void;
  onCompleteSession: (id: string) => void;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({
  session,
  onClose,
  onCompleteSession,
}) => {
  if (!session) return null;

  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(5 * 60); // 5 min break
      } else {
        setIsBreak(false);
        setTimeLeft(25 * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    onCompleteSession(session.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            {isBreak ? '☕ Break Time' : '⚡ Deep Focus Pomodoro'}
          </span>
          <h2 className="text-xl font-extrabold text-white">{session.taskTitle}</h2>
          <p className="text-xs text-slate-400 font-medium">{session.subject}</p>
        </div>

        {/* Large Timer Display */}
        <div className="py-8 relative flex items-center justify-center">
          <div className="w-64 h-64 rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center bg-slate-950 shadow-inner">
            <span className="text-5xl font-extrabold text-white font-mono tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs text-slate-400 mt-2 font-semibold">
              {isBreak ? 'Relax & Stretch' : '25 Min Focus Block'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            type="button"
            onClick={() => setTimeLeft(25 * 60)}
            className="p-3 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-extrabold text-sm flex items-center space-x-2 transition-all shadow-xl shadow-indigo-600/30"
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Ambient Sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-indigo-400" />}
          </button>
        </div>

        {/* Mark Completed Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Session Complete (+1 Streak Day)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
