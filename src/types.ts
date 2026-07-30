export type NavigationTab =
  | 'dashboard'
  | 'timetable'
  | 'attendance'
  | 'assignments'
  | 'exams'
  | 'planner'
  | 'assistant'
  | 'smartnotes'
  | 'goals'
  | 'calendar'
  | 'analytics'
  | 'notifications';

export interface TimetableClass {
  id: string;
  subjectName: string;
  subjectCode: string;
  faculty: string;
  classroom: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  type: 'Lecture' | 'Lab' | 'Tutorial';
  color: string;
}

export interface AttendanceSubject {
  id: string;
  subjectName: string;
  subjectCode: string;
  classesConducted: number;
  classesAttended: number;
  targetPercentage: number; // e.g. 75 or 85
  creditHours: number;
  faculty: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  deadline: string; // YYYY-MM-DDTHH:mm
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  estimatedHours: number;
  attachedDocs?: string[];
}

export interface Exam {
  id: string;
  subject: string;
  subjectCode: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  totalMarks: number;
  difficulty: 'Hard' | 'Medium' | 'Easy';
  expectedPrepHours: number;
  completedPrepHours: number;
  syllabusTopics: { title: string; completed: boolean }[];
}

export interface StudySession {
  id: string;
  day: string;
  timeSlot: string;
  subject: string;
  taskTitle: string;
  type: 'Study' | 'Assignment' | 'Exam Revision' | 'Break';
  durationMinutes: number;
  pomodoroCount: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Scheduled' | 'Completed' | 'Missed';
  aiTip?: string;
}

export interface Goal {
  id: string;
  title: string;
  category: 'Academic' | 'Attendance' | 'Study Habit' | 'Syllabus';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  streakDays: number;
  completed: boolean;
}

export interface Flashcard {
  question: string;
  answer: string;
  category?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface SmartNoteItem {
  id: string;
  title: string;
  subject: string;
  originalText: string;
  summary: string;
  keyTakeaways: string[];
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
  revisionCheatsheet: string;
  createdDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  codeLanguage?: string;
  codeSnippet?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'exam' | 'attendance_warning' | 'reschedule' | 'ai_recommendation';
  timestamp: string;
  read: boolean;
  actionTab?: NavigationTab;
}
