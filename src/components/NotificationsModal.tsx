import React from 'react';
import { Bell, X, Check, ShieldAlert, Clock, Sparkles, Calendar } from 'lucide-react';
import { NotificationItem, NavigationTab } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  setActiveTab: (tab: NavigationTab) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  setNotifications,
  setActiveTab,
}) => {
  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
    if (item.actionTab) {
      setActiveTab(item.actionTab);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Academic Notifications</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Mark all read
              </button>
              <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                  !n.read ? 'bg-indigo-950/30 border-indigo-500/40' : 'bg-slate-800/50 border-slate-700/60 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
