import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "StudyPilot AI Backend", timestamp: new Date().toISOString() });
});

// 1. AI Timetable Extraction Endpoint
app.post("/api/ai/timetable-extract", async (req, res) => {
  try {
    const { fileData, mimeType, textContent } = req.body;

    const systemInstruction = `You are an expert academic timetable parser for StudyPilot AI. 
Extract all weekly classes, lectures, labs, subject names, faculty names, classroom numbers, days of the week (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday), start times (HH:MM format, 24-hr or 12-hr), and end times from the provided content. Return clean JSON.`;

    let contents: any;
    if (fileData && mimeType) {
      contents = {
        parts: [
          {
            inlineData: {
              data: fileData.replace(/^data:image\/\w+;base64,/, ""),
              mimeType: mimeType,
            },
          },
          {
            text: "Extract structured timetable entries from this schedule image/document.",
          },
        ],
      };
    } else {
      contents = `Extract structured timetable entries from the following text schedule:
${textContent || "Monday 9:00 AM - 10:30 AM: Data Structures & Algorithms by Prof. Sharma in Room 302."}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subjectName: { type: Type.STRING },
                  subjectCode: { type: Type.STRING },
                  faculty: { type: Type.STRING },
                  classroom: { type: Type.STRING },
                  day: { type: Type.STRING },
                  startTime: { type: Type.STRING },
                  endTime: { type: Type.STRING },
                  type: { type: Type.STRING, description: "Lecture, Lab, or Tutorial" },
                },
                required: ["subjectName", "day", "startTime", "endTime"],
              },
            },
            summary: { type: Type.STRING },
          },
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Timetable extraction error:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to parse timetable." });
  }
});

// 2. AI Adaptive Study Planner Endpoint
app.post("/api/ai/study-planner", async (req, res) => {
  try {
    const { assignments, exams, attendance, freeHoursPerDay, learningSpeed, targetGoal } = req.body;

    const prompt = `Generate a personalized, highly efficient 7-day study plan for a student based on:
Assignments: ${JSON.stringify(assignments || [])}
Upcoming Exams: ${JSON.stringify(exams || [])}
Attendance Status: ${JSON.stringify(attendance || [])}
Daily Free Study Hours: ${freeHoursPerDay || 4} hours
Target Goals: ${targetGoal || "Maintain top grades and 85%+ attendance"}

Provide a realistic daily schedule with Pomodoro sessions (25m/50m), break times, priority order, revision sessions, and estimated hours per task.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the core AI Study Scheduler engine of StudyPilot AI.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weeklySummary: { type: Type.STRING },
            productivityScoreEstimate: { type: Type.NUMBER },
            dailyPlans: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  date: { type: Type.STRING },
                  totalHours: { type: Type.NUMBER },
                  focusSubject: { type: Type.STRING },
                  sessions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        timeSlot: { type: Type.STRING },
                        subject: { type: Type.STRING },
                        taskTitle: { type: Type.STRING },
                        type: { type: Type.STRING, description: "Study, Assignment, Exam Revision, or Break" },
                        durationMinutes: { type: Type.NUMBER },
                        pomodoroCount: { type: Type.NUMBER },
                        priority: { type: Type.STRING, description: "High, Medium, or Low" },
                        aiTip: { type: Type.STRING },
                      },
                    },
                  },
                },
              },
            },
            keyRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const plan = JSON.parse(response.text || "{}");
    res.json({ success: true, plan });
  } catch (error: any) {
    console.error("Study planner error:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to generate study plan." });
  }
});

// 3. AI Academic Chat Assistant Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, context } = req.body;

    const chatMessages = messages || [];
    const lastUserMessage = chatMessages[chatMessages.length - 1]?.content || "Hello";

    const systemInstruction = `You are StudyPilot AI, an intelligent, empathetic academic tutor and study assistant.
Help students with:
1. Explaining concepts (DBMS, Operating Systems, Data Structures & Algorithms, Computer Networks, Math, Physics, Electronics, etc.)
2. Code debugging and solutions in C++, Python, Java, JavaScript, and HTML/CSS.
3. Generating flashcards, quizzes, and revision guides.
4. Providing exam preparation advice and study techniques (Feynman Technique, Active Recall, Spaced Repetition).

Provide clear, formatted markdown responses with clean code blocks if technical. Keep explanations well-structured, supportive, and practical. Context: ${JSON.stringify(context || {})}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: lastUserMessage,
      config: {
        systemInstruction,
      },
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to fetch response." });
  }
});

// 4. Smart Notes Summarizer, Flashcard & Quiz Generator Endpoint
app.post("/api/ai/smart-notes", async (req, res) => {
  try {
    const { notesContent, subjectName } = req.body;

    const prompt = `Analyze the following lecture notes/document for subject "${subjectName || "Academic Notes"}":

${notesContent}

Extract:
1. A concise summary (3-4 paragraphs)
2. 5-7 key bullet point takeaways
3. 5 interactive Flashcards (Front question, Back answer)
4. 4 Practice Quiz Questions (MCQ with 4 options and correct index, plus explanation)
5. 1-page Revision Cheatsheet`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the StudyPilot AI Smart Notes Synthesizer.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
              },
            },
            quizQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctOptionIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
              },
            },
            revisionCheatsheet: { type: Type.STRING },
          },
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, result });
  } catch (error: any) {
    console.error("Smart notes error:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to process notes." });
  }
});

// 5. AI Intelligent Workload Rescheduler Endpoint
app.post("/api/ai/reschedule", async (req, res) => {
  try {
    const { missedTasks, currentSchedule, urgentAdditions } = req.body;

    const prompt = `The student missed or needs to reschedule the following study sessions: ${JSON.stringify(missedTasks || [])}.
New urgent additions: ${JSON.stringify(urgentAdditions || [])}.
Current remaining schedule: ${JSON.stringify(currentSchedule || [])}.

Intelligently re-balance the remaining study workload so the student catches up without burn-out. Provide updated session slots and a brief explanation of how the schedule was adapted.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the StudyPilot AI Dynamic Rescheduler.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rescheduleReasoning: { type: Type.STRING },
            rebalancedSessions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  timeSlot: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  taskTitle: { type: Type.STRING },
                  type: { type: Type.STRING },
                  durationMinutes: { type: Type.NUMBER },
                  status: { type: Type.STRING },
                  aiAdjustNote: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const resData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: resData });
  } catch (error: any) {
    console.error("Reschedule error:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to reschedule." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyPilot AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
