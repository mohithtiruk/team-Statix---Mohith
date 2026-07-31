import {
  TimetableClass,
  AttendanceSubject,
  Assignment,
  Exam,
  StudySession,
  Goal,
  SmartNoteItem,
  ChatMessage,
  NotificationItem,
} from '../types';

export const INITIAL_TIMETABLE: TimetableClass[] = [
  {
    id: 'c1',
    subjectName: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    faculty: 'Prof. R. V. Sharma',
    classroom: 'LHC-201',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    type: 'Lecture',
    color: 'emerald',
  },
  {
    id: 'c2',
    subjectName: 'Database Management Systems',
    subjectCode: 'CS302',
    faculty: 'Dr. Ananya Roy',
    classroom: 'LHC-104',
    day: 'Monday',
    startTime: '11:00',
    endTime: '12:30',
    type: 'Lecture',
    color: 'blue',
  },
  {
    id: 'c3',
    subjectName: 'Python & DSA Laboratory',
    subjectCode: 'CS301L',
    faculty: 'Prof. R. V. Sharma',
    classroom: 'CS-Lab 3',
    day: 'Monday',
    startTime: '14:00',
    endTime: '16:00',
    type: 'Lab',
    color: 'teal',
  },
  {
    id: 'c4',
    subjectName: 'Operating Systems',
    subjectCode: 'CS303',
    faculty: 'Prof. K. Mehta',
    classroom: 'LHC-202',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:30',
    type: 'Lecture',
    color: 'amber',
  },
  {
    id: 'c5',
    subjectName: 'Computer Networks',
    subjectCode: 'CS304',
    faculty: 'Dr. S. K. Gupta',
    classroom: 'LHC-201',
    day: 'Tuesday',
    startTime: '11:00',
    endTime: '12:30',
    type: 'Lecture',
    color: 'indigo',
  },
  {
    id: 'c6',
    subjectName: 'Mathematics III (Discrete Math)',
    subjectCode: 'MA301',
    faculty: 'Dr. P. Deshmukh',
    classroom: 'LHC-305',
    day: 'Wednesday',
    startTime: '09:00',
    endTime: '10:30',
    type: 'Lecture',
    color: 'violet',
  },
  {
    id: 'c7',
    subjectName: 'Database Management Systems',
    subjectCode: 'CS302',
    faculty: 'Dr. Ananya Roy',
    classroom: 'LHC-104',
    day: 'Wednesday',
    startTime: '11:00',
    endTime: '12:30',
    type: 'Lecture',
    color: 'blue',
  },
  {
    id: 'c8',
    subjectName: 'Operating Systems Lab',
    subjectCode: 'CS303L',
    faculty: 'Prof. K. Mehta',
    classroom: 'OS-Lab 1',
    day: 'Thursday',
    startTime: '14:00',
    endTime: '16:00',
    type: 'Lab',
    color: 'amber',
  },
  {
    id: 'c9',
    subjectName: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    faculty: 'Prof. R. V. Sharma',
    classroom: 'LHC-201',
    day: 'Friday',
    startTime: '09:00',
    endTime: '10:30',
    type: 'Lecture',
    color: 'emerald',
  },
  {
    id: 'c10',
    subjectName: 'Computer Networks',
    subjectCode: 'CS304',
    faculty: 'Dr. S. K. Gupta',
    classroom: 'LHC-201',
    day: 'Friday',
    startTime: '11:00',
    endTime: '12:30',
    type: 'Lecture',
    color: 'indigo',
  },
];

export const INITIAL_ATTENDANCE: AttendanceSubject[] = [
  {
    id: 'att1',
    subjectName: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    classesConducted: 28,
    classesAttended: 25,
    targetPercentage: 75,
    creditHours: 4,
    faculty: 'Prof. R. V. Sharma',
  },
  {
    id: 'att2',
    subjectName: 'Database Management Systems',
    subjectCode: 'CS302',
    classesConducted: 24,
    classesAttended: 21,
    targetPercentage: 80,
    creditHours: 4,
    faculty: 'Dr. Ananya Roy',
  },
  {
    id: 'att3',
    subjectName: 'Operating Systems',
    subjectCode: 'CS303',
    classesConducted: 22,
    classesAttended: 15, // 68.18% -> Low attendance warning!
    targetPercentage: 75,
    creditHours: 3,
    faculty: 'Prof. K. Mehta',
  },
  {
    id: 'att4',
    subjectName: 'Computer Networks',
    subjectCode: 'CS304',
    classesConducted: 20,
    classesAttended: 18,
    targetPercentage: 75,
    creditHours: 3,
    faculty: 'Dr. S. K. Gupta',
  },
  {
    id: 'att5',
    subjectName: 'Mathematics III',
    subjectCode: 'MA301',
    classesConducted: 18,
    classesAttended: 16,
    targetPercentage: 75,
    creditHours: 3,
    faculty: 'Dr. P. Deshmukh',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg1',
    title: 'DBMS ER-Diagram & B+ Tree Indexing Assignment',
    subject: 'Database Management Systems',
    description: 'Design an ER diagram for a hospital management system and implement B+ Tree insertion steps in SQL.',
    deadline: '2026-08-02T23:59',
    priority: 'High',
    status: 'In Progress',
    estimatedHours: 3.5,
    attachedDocs: ['DBMS_Assignment_2_ProblemStatement.pdf'],
  },
  {
    id: 'asg2',
    title: 'Red-Black Tree Insertion & Deletion C++ Code',
    subject: 'Data Structures & Algorithms',
    description: 'Implement a self-balancing Red-Black Tree in C++ with test cases for left and right rotations.',
    deadline: '2026-08-04T18:00',
    priority: 'High',
    status: 'Pending',
    estimatedHours: 4,
    attachedDocs: ['RBT_Spec_CS301.pdf'],
  },
  {
    id: 'asg3',
    title: 'Operating Systems Process Synchronization (Semaphores)',
    subject: 'Operating Systems',
    description: 'Solve the Dining Philosophers Problem using C POSIX semaphores and mutex locks.',
    deadline: '2026-08-06T23:59',
    priority: 'Medium',
    status: 'Pending',
    estimatedHours: 2.5,
  },
  {
    id: 'asg4',
    title: 'TCP/IP Subnetting & Packet Analysis Report',
    subject: 'Computer Networks',
    description: 'Analyze Wireshark packet capture files for TCP 3-way handshake and HTTP GET requests.',
    deadline: '2026-08-10T17:00',
    priority: 'Low',
    status: 'Pending',
    estimatedHours: 2,
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'ex1',
    subject: 'Database Management Systems Mid-Term',
    subjectCode: 'CS302',
    date: '2026-08-12',
    time: '10:00',
    totalMarks: 50,
    difficulty: 'Hard',
    expectedPrepHours: 14,
    completedPrepHours: 6,
    syllabusTopics: [
      { title: 'Relational Algebra & Tuple Calculus', completed: true },
      { title: 'Normal Forms (1NF, 2NF, 3NF, BCNF)', completed: true },
      { title: 'Indexing & Hashing (B+ Trees)', completed: false },
      { title: 'Transaction Processing & ACID Properties', completed: false },
      { title: 'Concurrency Control (2PL, Timestamp)', completed: false },
    ],
  },
  {
    id: 'ex2',
    subject: 'Data Structures & Algorithms Mid-Term',
    subjectCode: 'CS301',
    date: '2026-08-15',
    time: '14:00',
    totalMarks: 50,
    difficulty: 'Hard',
    expectedPrepHours: 18,
    completedPrepHours: 8,
    syllabusTopics: [
      { title: 'Asymptotic Analysis & Master Theorem', completed: true },
      { title: 'Linked Lists, Stacks, Queues', completed: true },
      { title: 'Binary Trees & BST Operations', completed: true },
      { title: 'Graph Algorithms (DFS, BFS, Dijkstra, Prim)', completed: false },
      { title: 'Dynamic Programming (Knapsack, LCS)', completed: false },
    ],
  },
  {
    id: 'ex3',
    subject: 'Operating Systems Quiz 2',
    subjectCode: 'CS303',
    date: '2026-08-08',
    time: '11:30',
    totalMarks: 20,
    difficulty: 'Medium',
    expectedPrepHours: 6,
    completedPrepHours: 3,
    syllabusTopics: [
      { title: 'CPU Scheduling Algorithms (FCFS, SJF, RR)', completed: true },
      { title: 'Process Synchronization & Deadlocks', completed: false },
      { title: 'Paging & Virtual Memory', completed: false },
    ],
  },
];

export const INITIAL_STUDY_SESSIONS: StudySession[] = [
  {
    id: 'ss1',
    day: 'Today',
    timeSlot: '16:30 - 17:30',
    subject: 'Database Management Systems',
    taskTitle: 'Solve Normalization (3NF & BCNF) Practice Problems',
    type: 'Study',
    durationMinutes: 60,
    pomodoroCount: 2,
    priority: 'High',
    status: 'Completed',
    aiTip: 'Use decomposition rules to verify if relation is in BCNF.',
  },
  {
    id: 'ss2',
    day: 'Today',
    timeSlot: '18:00 - 19:30',
    subject: 'Data Structures & Algorithms',
    taskTitle: 'Implement C++ Red-Black Tree Rotations',
    type: 'Assignment',
    durationMinutes: 90,
    pomodoroCount: 3,
    priority: 'High',
    status: 'Scheduled',
    aiTip: 'Focus on color-flip cases before handling double rotation.',
  },
  {
    id: 'ss3',
    day: 'Today',
    timeSlot: '20:30 - 21:30',
    subject: 'Operating Systems',
    taskTitle: 'Revise Semaphore Mutex Locks & Dining Philosophers',
    type: 'Exam Revision',
    durationMinutes: 60,
    pomodoroCount: 2,
    priority: 'Medium',
    status: 'Scheduled',
    aiTip: 'Attendance is currently 68%. Reviewing OS boosts your quiz confidence.',
  },
  {
    id: 'ss4',
    day: 'Tomorrow',
    timeSlot: '16:00 - 17:30',
    subject: 'Database Management Systems',
    taskTitle: 'B+ Tree Indexing & SQL Query Optimization',
    type: 'Assignment',
    durationMinutes: 90,
    pomodoroCount: 3,
    priority: 'High',
    status: 'Scheduled',
  },
  {
    id: 'ss5',
    day: 'Tomorrow',
    timeSlot: '18:00 - 19:00',
    subject: 'Computer Networks',
    taskTitle: 'TCP Handshake & Wireshark Log Analysis',
    type: 'Study',
    durationMinutes: 60,
    pomodoroCount: 2,
    priority: 'Low',
    status: 'Scheduled',
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Maintain 4.0 Hours Daily Study Average',
    category: 'Study Habit',
    targetValue: 4,
    currentValue: 3.8,
    unit: 'hrs/day',
    deadline: '2026-08-31',
    streakDays: 7,
    completed: false,
  },
  {
    id: 'g2',
    title: 'Recover Operating Systems Attendance to 75%+',
    category: 'Attendance',
    targetValue: 75,
    currentValue: 68.2,
    unit: '%',
    deadline: '2026-08-15',
    streakDays: 4,
    completed: false,
  },
  {
    id: 'g3',
    title: 'Complete DBMS Mid-Term Syllabus',
    category: 'Syllabus',
    targetValue: 5,
    currentValue: 2,
    unit: 'modules',
    deadline: '2026-08-12',
    streakDays: 5,
    completed: false,
  },
  {
    id: 'g4',
    title: 'Solve 30 DSA Dynamic Programming Problems',
    category: 'Academic',
    targetValue: 30,
    currentValue: 18,
    unit: 'problems',
    deadline: '2026-08-20',
    streakDays: 9,
    completed: false,
  },
];

export const INITIAL_SMART_NOTES: SmartNoteItem[] = [
  {
    id: 'sn1',
    title: 'DBMS Module 3: Transactions & Concurrency Control',
    subject: 'Database Management Systems',
    originalText: `A transaction is a logical unit of database processing that includes one or more database access operations. ACID properties stand for Atomicity, Consistency, Isolation, and Durability.
Atomicity ensures all operations execute or none do. Consistency maintains database invariants before and after the transaction. Isolation guarantees concurrent execution results in the same state as serial execution. Durability ensures committed changes survive system crashes. Two-Phase Locking (2PL) has a Growing Phase and Shrinking Phase to ensure serializability.`,
    summary: 'This note covers core relational database transaction management and ACID properties. It details how two-phase locking (2PL) guarantees serializability and concurrency control without compromising data consistency during unexpected system crashes.',
    keyTakeaways: [
      'ACID = Atomicity (all or nothing), Consistency (preserves rules), Isolation (independent concurrent execution), Durability (persisted).',
      'Two-Phase Locking (2PL) consists of a Growing Phase (locks acquired) and a Shrinking Phase (locks released).',
      'Strict 2PL releases all exclusive locks only when the transaction commits to prevent cascading rollbacks.',
      'Deadlocks in transactions can be handled via Wait-For Graphs or Timeout mechanisms.',
    ],
    flashcards: [
      {
        question: 'What does the Atomicity property in ACID guarantee?',
        answer: 'It guarantees that either all operations of a transaction execute completely, or none of them take effect (all-or-nothing execution).',
        category: 'DBMS Transactions',
      },
      {
        question: 'What is the main rule of Two-Phase Locking (2PL)?',
        answer: 'A transaction cannot acquire any new lock once it releases its first lock.',
        category: 'Concurrency Control',
      },
      {
        question: 'Why is Strict 2PL preferred over Basic 2PL?',
        answer: 'Strict 2PL holds all exclusive locks until commit time, preventing cascading rollbacks in concurrent transactions.',
        category: 'Concurrency Control',
      },
    ],
    quizQuestions: [
      {
        question: 'Which property ensures that database updates survive a power outage or system reboot?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctOptionIndex: 3,
        explanation: 'Durability ensures that once a transaction commits, its updates are permanently recorded in non-volatile storage.',
      },
      {
        question: 'During which phase of 2PL can a transaction release locks?',
        options: ['Growing Phase', 'Shrinking Phase', 'Commit Phase', 'Initialization Phase'],
        correctOptionIndex: 1,
        explanation: 'In the Shrinking Phase of 2PL, a transaction releases locks and cannot acquire any new locks.',
      },
    ],
    revisionCheatsheet: 'ACID Summary:\n• Atomicity -> Rollback on error\n• Consistency -> Valid state transitions\n• Isolation -> Serializability (2PL)\n• Durability -> Write-Ahead Logging (WAL)',
    createdDate: '2026-07-28',
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'ai',
    text: "👋 Hi! I'm your StudyPilot AI Assistant. I can help you explain complex subject topics (DBMS, DSA, OS, Math), solve programming problems in C++ or Python, summarize notes, or optimize your study plan. What would you like to work on today?",
    timestamp: '09:00 AM',
  },
  {
    id: 'm2',
    sender: 'user',
    text: 'Can you show me a clean C++ implementation of Binary Tree Inorder Traversal using recursion and stack?',
    timestamp: '09:02 AM',
  },
  {
    id: 'm3',
    sender: 'ai',
    text: `Here is the clean C++ solution for Binary Tree Inorder Traversal (Left -> Root -> Right) using both recursive and iterative stack methods:`,
    timestamp: '09:03 AM',
    codeLanguage: 'cpp',
    codeSnippet: `#include <iostream>
#include <vector>
#include <stack>

using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// 1. Recursive Inorder Traversal
void inorderRecursive(TreeNode* root, vector<int>& result) {
    if (!root) return;
    inorderRecursive(root->left, result);
    result.push_back(root->val);
    inorderRecursive(root->right, result);
}

// 2. Iterative Inorder Traversal using Stack
vector<int> inorderIterative(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> st;
    TreeNode* curr = root;

    while (curr != nullptr || !st.empty()) {
        while (curr != nullptr) {
            st.push(curr);
            curr = curr->left;
        }
        curr = st.top();
        st.pop();
        result.push_back(curr->val);
        curr = curr->right;
    }
    return result;
}

int main() {
    TreeNode* root = new TreeNode(1);
    root->right = new TreeNode(2);
    root->right->left = new TreeNode(3);

    vector<int> res = inorderIterative(root);
    cout << "Inorder Traversal: ";
    for (int val : res) cout << val << " "; // Output: 1 3 2
    cout << endl;
    return 0;
}`,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: '⚠️ Attendance Alert: Operating Systems',
    message: 'Your OS attendance is currently 68.2%, below your target of 75%. You need to attend the next 3 consecutive lectures to recover!',
    type: 'attendance_warning',
    timestamp: '10 mins ago',
    read: false,
    actionTab: 'attendance',
  },
  {
    id: 'n2',
    title: '⏳ Urgent Assignment Deadline',
    message: 'DBMS ER-Diagram Assignment is due in 36 hours (Aug 2). AI recommended 3.5 hrs allocation.',
    type: 'deadline',
    timestamp: '1 hour ago',
    read: false,
    actionTab: 'assignments',
  },
  {
    id: 'n3',
    title: '🤖 AI Schedule Recommendation',
    message: 'StudyPilot AI added a 60m DBMS B+ Tree revision block to your schedule to prepare for your Aug 12 Mid-Term.',
    type: 'ai_recommendation',
    timestamp: '3 hours ago',
    read: true,
    actionTab: 'planner',
  },
  {
    id: 'n4',
    title: '📅 Upcoming Exam Notice',
    message: 'Operating Systems Quiz 2 is scheduled in 9 days (Aug 8, 11:30 AM).',
    type: 'exam',
    timestamp: 'Yesterday',
    read: true,
    actionTab: 'exams',
  },
];
