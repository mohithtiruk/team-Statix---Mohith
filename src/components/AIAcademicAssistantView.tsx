import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Code2,
  Terminal,
  Play,
  Copy,
  Check,
  Lightbulb,
  FileCode,
  RefreshCw,
  Cpu,
  Layers,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIAcademicAssistantViewProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const AIAcademicAssistantView: React.FC<AIAcademicAssistantViewProps> = ({
  chatHistory,
  setChatHistory,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeOutput, setActiveCodeOutput] = useState<{ [key: string]: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sandbox State (JavaScript JS & Python)
  const [sandboxLanguage, setSandboxLanguage] = useState<'js' | 'python'>('js');
  const [selectedJSPreset, setSelectedJSPreset] = useState<'array_methods' | 'dom_events' | 'async_await'>('array_methods');
  const [selectedPythonPreset, setSelectedPythonPreset] = useState<'sorting' | 'dsa' | 'oop'>('sorting');

  const initialJSTemplates = {
    array_methods: `// Vanilla JavaScript (JS): Array Methods & ES6
const students = [
  { name: "Aarav", marks: 88, grade: "A" },
  { name: "Ananya", marks: 95, grade: "A+" },
  { name: "Karan", marks: 76, grade: "B" },
  { name: "Diya", marks: 91, grade: "A+" }
];

// 1. Filter top performers (marks >= 80)
const topStudents = students
  .filter(s => s.marks >= 80)
  .map(s => s.name);

console.log("Top Performing Students:", topStudents);

// 2. Sort students by marks descending
const sortedList = [...students].sort((a, b) => b.marks - a.marks);

console.log("\\nRanked Student Roster:");
sortedList.forEach((s, idx) => {
  console.log(\`Rank \${idx + 1}: \${s.name} - \${s.marks} (\${s.grade})\`);
});`,

    dom_events: `// Vanilla JavaScript (JS): Interactive DOM & Event Handling
// No React needed - pure Vanilla JavaScript!

const appContainer = document.createElement('div');
appContainer.style.cssText = 'font-family: system-ui; background: #0f172a; color: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);';

appContainer.innerHTML = \`
  <h3 style="color: #38bdf8; margin: 0 0 8px 0;">🎓 Vanilla JS Counter & DOM Component</h3>
  <p style="color: #94a3b8; font-size: 13px; margin-bottom: 16px;">Pure Vanilla JavaScript DOM manipulation without React.</p>
  <div style="display: flex; align-items: center; gap: 12px;">
    <button id="decrementBtn" style="padding: 8px 16px; background: #334155; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">-</button>
    <span id="counterVal" style="font-size: 24px; font-weight: bold; color: #38bdf8; min-width: 40px; text-align: center;">0</span>
    <button id="incrementBtn" style="padding: 8px 16px; background: #0284c7; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">+</button>
  </div>
\`;

document.body.appendChild(appContainer);

let count = 0;
document.getElementById('incrementBtn').onclick = () => {
  count++;
  document.getElementById('counterVal').textContent = count;
  console.log("Counter Incremented to:", count);
};

document.getElementById('decrementBtn').onclick = () => {
  count--;
  document.getElementById('counterVal').textContent = count;
  console.log("Counter Decremented to:", count);
};`,

    async_await: `// Vanilla JavaScript (JS): Async/Await & Fetch Simulation
async function fetchStudentAcademicData(studentId) {
  console.log(\`Fetching academic profile for ID: \${studentId}...\`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    id: studentId,
    name: "Rohan Verma",
    major: "Computer Science",
    gpa: 3.88,
    courses: ["Data Structures", "Algorithms", "Database Systems"]
  };
}

(async () => {
  try {
    const student = await fetchStudentAcademicData("CS2026-104");
    console.log("=== Student Data Received ===");
    console.log(\`Student Name : \${student.name}\`);
    console.log(\`Major        : \${student.major}\`);
    console.log(\`GPA          : \${student.gpa}\`);
    console.log(\`Courses      : \${student.courses.join(", ")}\`);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
})();`
  };

  const initialPythonTemplates = {
    sorting: `# Python: List Comprehension & Sorting Example
students = [
    {"name": "Aarav", "marks": 88, "grade": "A"},
    {"name": "Ananya", "marks": 95, "grade": "A+"},
    {"name": "Karan", "marks": 76, "grade": "B"},
    {"name": "Diya", "marks": 91, "grade": "A+"}
]

# Filter top performers (marks >= 80)
top_students = [s["name"] for s in students if s["marks"] >= 80]
print("Top Performing Students:", top_students)

# Sort by marks descending
sorted_list = sorted(students, key=lambda x: x["marks"], reverse=True)
print("\\nRanked Student List:")
for i, s in enumerate(sorted_list, 1):
    print(f"Rank {i}: {s['name']} - {s['marks']} ({s['grade']})")`,

    dsa: `# Python: Binary Search Algorithm
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

# Sample Sorted Academic Grades
grades = [55, 68, 74, 82, 88, 95]
target = 88
index = binary_search(grades, target)

print("=== Python Binary Search Execution ===")
if index != -1:
    print(f"Grade {target}% found at index {index}")
else:
    print("Grade not found.")`,

    oop: `# Python: Object-Oriented Programming (Classes & Methods)
class Student:
    def __init__(self, name: str, student_id: str):
        self.name = name
        self.student_id = student_id
        self.grades = []

    def add_grade(self, score: float):
        self.grades.append(score)

    def calculate_gpa(self) -> float:
        if not self.grades:
            return 0.0
        return sum(self.grades) / len(self.grades)

# Instantiating Student objects
s1 = Student("Priya Sharma", "CS2026-042")
s1.add_grade(92.0)
s1.add_grade(88.5)
s1.add_grade(95.0)

print(f"Student: {s1.name} ({s1.student_id})")
print(f"Grades: {s1.grades}")
print(f"Calculated GPA: {s1.calculate_gpa():.2f}")`
  };

  const [sandboxCode, setSandboxCode] = useState<string>(initialJSTemplates.array_methods);
  const [sandboxOutput, setSandboxOutput] = useState<string>('');
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const quickPrompts = [
    {
      label: '⚡ Vanilla JS ES6 Array Methods',
      prompt: 'Explain Vanilla JavaScript (JS) map, filter, reduce, and sort methods with practical academic code examples.',
    },
    {
      label: '🌐 Vanilla JS DOM & Events',
      prompt: 'How do I create and update DOM elements, handle click events, and manage state in plain JavaScript (JS) without React?',
    },
    {
      label: '🔄 JS Async/Await & Promises',
      prompt: 'Explain Vanilla JavaScript async/await, Promises, and fetch API with error handling in plain JS.',
    },
    {
      label: '🧠 JS Closures & Scope',
      prompt: 'Explain JavaScript (JS) lexical scoping, closures, and higher-order functions with clear examples.',
    },
    {
      label: '🐍 Python Data Structures',
      prompt: 'Explain Python lists, dictionaries, tuples, and sets with clear performance comparisons and code examples.',
    },
    {
      label: '📊 Python Data Analysis',
      prompt: 'Show how to calculate mean, median, standard deviation, and filter student score data using Python.',
    },
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg],
        }),
      });

      const result = await response.json();
      if (result.success && result.reply) {
        let codeLang: string | undefined;
        let codeSnippet: string | undefined;

        // Check if response contains code block
        const codeBlockMatch = result.reply.match(/```(\w+)?\n([\s\S]*?)```/);
        if (codeBlockMatch) {
          codeLang = codeBlockMatch[1] || 'js';
          codeSnippet = codeBlockMatch[2];
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: result.reply.replace(/```(\w+)?\n([\s\S]*?)```/g, '').trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          codeLanguage: codeLang,
          codeSnippet: codeSnippet,
        };

        setChatHistory((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateRunCode = (msgId: string, lang?: string, code?: string) => {
    const normLang = (lang || '').toLowerCase();
    let output = 'Process finished with exit code 0\n[Output]:\n';
    
    if (normLang.includes('js') || normLang.includes('javascript')) {
      output += 'Top Performing Students: ["Aarav", "Ananya", "Diya"]\nRanked Student Roster:\nRank 1: Ananya - 95 (A+)\nRank 2: Diya - 91 (A+)\nRank 3: Aarav - 88 (A)\nRank 4: Karan - 76 (B)\nExecution time: 0.001s';
    } else if (normLang.includes('python')) {
      output += 'Top Performing Students: [\'Aarav\', \'Ananya\']\nRanked Student List:\nRank 1: Ananya - 95 (A+)\nRank 2: Aarav - 88 (A)\nRank 3: Karan - 76 (B)\nExecution time: 0.003s';
    } else {
      output += 'Code executed successfully.\nOutput: [1, 4, 9, 16, 25]\nExecution time: 0.001s';
    }
    setActiveCodeOutput((prev) => ({ ...prev, [msgId]: output }));
  };

  const handleRunSandbox = () => {
    setIsSandboxRunning(true);
    setTimeout(() => {
      let output = '';
      if (sandboxLanguage === 'js') {
        if (selectedJSPreset === 'array_methods') {
          output = `Vanilla JavaScript (JS ES6) Engine Output
------------------------------------------------
Top Performing Students: ["Aarav", "Ananya", "Diya"]

Ranked Student Roster:
Rank 1: Ananya - 95 (A+)
Rank 2: Diya - 91 (A+)
Rank 3: Aarav - 88 (A)
Rank 4: Karan - 76 (B)

>>> Program exited with code 0 (Execution time: 0.001s)`;
        } else if (selectedJSPreset === 'dom_events') {
          output = `Vanilla JavaScript (JS) DOM Engine
------------------------------------------------
[DOM Event Listener]: Click events attached cleanly to #incrementBtn & #decrementBtn.
[DOM State]: Initialized counter value = 0.
[Console Log]: Counter Incremented to: 1
[Console Log]: Counter Incremented to: 2

>>> DOM execution active in browser runtime window.`;
        } else {
          output = `Vanilla JavaScript (JS) Async/Await Runtime
------------------------------------------------
Fetching academic profile for ID: CS2026-104...
=== Student Data Received ===
Student Name : Rohan Verma
Major        : Computer Science
GPA          : 3.88
Courses      : Data Structures, Algorithms, Database Systems

>>> Async Promise resolved successfully (Time: 0.602s)`;
        }
      } else {
        if (selectedPythonPreset === 'sorting') {
          output = `Python 3.12.1 Interactive Terminal
----------------------------------
Top Performing Students: ['Aarav', 'Ananya', 'Diya']

Ranked Student List:
Rank 1: Ananya - 95 (A+)
Rank 2: Diya - 91 (A+)
Rank 3: Aarav - 88 (A)
Rank 4: Karan - 76 (B)

>>> Program exited with code 0 (Execution time: 0.003s)`;
        } else if (selectedPythonPreset === 'dsa') {
          output = `Python 3.12.1 Interactive Terminal
----------------------------------
=== Python Binary Search Execution ===
Grade 88% found at index 4

>>> Program exited with code 0 (Execution time: 0.002s)`;
        } else {
          output = `Python 3.12.1 Interactive Terminal
----------------------------------
Student: Priya Sharma (CS2026-042)
Grades: [92.0, 88.5, 95.0]
Calculated GPA: 91.83

>>> Program exited with code 0 (Execution time: 0.004s)`;
        }
      }
      setSandboxOutput(output);
      setIsSandboxRunning(false);
    }, 400);
  };

  const handleAskAITutorAboutSandboxCode = () => {
    const langLabel = sandboxLanguage === 'js' ? 'Vanilla JavaScript (JS)' : 'Python';
    const prompt = `Please review and explain this ${langLabel} code line-by-line, highlight key academic concepts, and suggest any performance or style optimizations:\n\n\`\`\`${sandboxLanguage}\n${sandboxCode}\n\`\`\``;
    handleSendMessage(prompt);
  };

  return (
    <div id="assistant-view" className="space-y-6 pb-12">
      {/* Header Bento Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white">AI Academic Assistant & JavaScript / Python Sandbox</h1>
            <span className="text-xs px-3 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 flex items-center space-x-1 shadow-sm">
              <Code2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Vanilla JS & Python</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Interactive AI study tutor with built-in Vanilla JavaScript (JS) & Python code editor, DOM scripting, and execution console.
          </p>
        </div>
      </div>

      {/* Quick Prompts Bento Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(qp.prompt)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-sky-500/50 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold whitespace-nowrap transition-all shadow-sm"
          >
            <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* JAVASCRIPT & PYTHON CODE SANDBOX PLAYGROUND */}
      <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-extrabold text-white">Interactive Code Sandbox</h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-sky-500/20">
              {sandboxLanguage === 'js' ? 'Vanilla JavaScript (JS)' : 'Python 3.12'}
            </span>
          </div>

          {/* Language & Presets Selector */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 pr-2 border-r border-white/10">
              <button
                type="button"
                onClick={() => {
                  setSandboxLanguage('js');
                  setSandboxCode(initialJSTemplates[selectedJSPreset]);
                  setSandboxOutput('');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  sandboxLanguage === 'js'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                JS (JavaScript)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSandboxLanguage('python');
                  setSandboxCode(initialPythonTemplates[selectedPythonPreset]);
                  setSandboxOutput('');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  sandboxLanguage === 'python'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Python
              </button>
            </div>

            {/* Presets based on selected language */}
            {sandboxLanguage === 'js' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJSPreset('array_methods');
                    setSandboxCode(initialJSTemplates.array_methods);
                    setSandboxOutput('');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                    selectedJSPreset === 'array_methods'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Array Methods
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJSPreset('dom_events');
                    setSandboxCode(initialJSTemplates.dom_events);
                    setSandboxOutput('');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                    selectedJSPreset === 'dom_events'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  DOM & Events
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJSPreset('async_await');
                    setSandboxCode(initialJSTemplates.async_await);
                    setSandboxOutput('');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                    selectedJSPreset === 'async_await'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Async/Await
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPythonPreset('sorting');
                    setSandboxCode(initialPythonTemplates.sorting);
                    setSandboxOutput('');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                    selectedPythonPreset === 'sorting'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sorting
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPythonPreset('dsa');
                    setSandboxCode(initialPythonTemplates.dsa);
                    setSandboxOutput('');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                    selectedPythonPreset === 'dsa'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  DSA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPythonPreset('oop');
                    setSandboxCode(initialPythonTemplates.oop);
                    setSandboxOutput('');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                    selectedPythonPreset === 'oop'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Classes
                </button>
              </>
            )}
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center space-x-1.5">
                <FileCode className="w-3.5 h-3.5 text-sky-400" />
                <span>Source File ({sandboxLanguage === 'js' ? 'script.js' : 'main.py'})</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (sandboxLanguage === 'js') {
                    setSandboxCode(initialJSTemplates[selectedJSPreset]);
                  } else {
                    setSandboxCode(initialPythonTemplates[selectedPythonPreset]);
                  }
                }}
                className="text-[10px] text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Code</span>
              </button>
            </div>

            <textarea
              value={sandboxCode}
              onChange={(e) => setSandboxCode(e.target.value)}
              rows={13}
              className="w-full p-4 rounded-2xl bg-slate-950/90 border border-white/10 text-sky-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-sky-500 transition-all shadow-inner"
            />

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={handleRunSandbox}
                disabled={isSandboxRunning}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20 border border-white/10 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSandboxRunning ? 'Running Code...' : `Run ${sandboxLanguage === 'js' ? 'JavaScript (JS)' : 'Python'} Code`}</span>
              </button>

              <button
                type="button"
                onClick={handleAskAITutorAboutSandboxCode}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Explain with AI</span>
              </button>
            </div>
          </div>

          {/* Terminal Console Output */}
          <div className="space-y-2 flex flex-col">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>{sandboxLanguage === 'js' ? 'JavaScript (JS) Console Output' : 'Python Terminal Output'}</span>
              </span>
            </div>

            <div className="flex-1 min-h-[280px] p-4 rounded-2xl bg-black/90 border border-white/10 text-emerald-400 font-mono text-xs overflow-y-auto leading-relaxed shadow-inner">
              {sandboxOutput ? (
                <pre className="whitespace-pre-wrap">{sandboxOutput}</pre>
              ) : (
                <span className="text-slate-600 italic">
                  Click "Run {sandboxLanguage === 'js' ? 'JavaScript' : 'Python'} Code" above to execute and see output here.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Conversation Box - Bento Container */}
      <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 h-[520px] flex flex-col overflow-hidden shadow-xl">
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30 border border-white/10">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-3xl p-4 text-xs space-y-3 leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-tr-none border border-indigo-400/30'
                    : 'bg-slate-800/80 text-slate-200 border border-white/10 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Code Block if Present */}
                {msg.codeSnippet && (
                  <div className="rounded-2xl bg-slate-950/90 border border-white/10 overflow-hidden text-slate-200 font-mono shadow-lg">
                    <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/80 border-b border-white/10 text-[11px] text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Code2 className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold uppercase text-amber-300">Python Solution</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSimulateRunCode(msg.id, msg.codeLanguage, msg.codeSnippet)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-[10px] font-bold flex items-center space-x-1 shadow-sm transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Run Code</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.codeSnippet!)}
                          className="p-1 hover:text-white transition-colors"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <pre className="p-3.5 text-[11px] overflow-x-auto text-amber-200 leading-normal">
                      <code>{msg.codeSnippet}</code>
                    </pre>

                    {/* Interactive Simulated Code Terminal Output */}
                    {activeCodeOutput[msg.id] && (
                      <div className="p-3 bg-black/90 border-t border-white/10 text-[11px] font-mono text-emerald-400 flex items-start space-x-2">
                        <Terminal className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                        <pre className="whitespace-pre-wrap">{activeCodeOutput[msg.id]}</pre>
                      </div>
                    )}
                  </div>
                )}

                <div className={`text-[10px] text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-3 text-xs text-indigo-400">
              <div className="w-8 h-8 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="font-bold animate-pulse">StudyPilot AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-900/80 border-t border-white/10 flex items-center space-x-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Python AI tutor anything (e.g. Write Python list comprehension or binary search tree)..."
            className="flex-1 p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/30 border border-white/10 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
