# StudyPilot AI

> **Your Intelligent Academic Planning Assistant**

StudyPilot AI is an AI-powered academic planning assistant designed to
centralize and automate a student's learning journey. Built by **Team
StatiX**, it brings timetables, academic tasks, deadlines, attendance,
study plans, and progress tracking into one intelligent dashboard.

##  The Problem

Students receive important academic information across multiple
disconnected platforms:

-   **Class Timetables** --- schedules and lab sessions
-   **Messaging Platforms** --- important updates buried in group chats
-   **LMS Portals** --- assignments and classroom tasks
-   **Email** --- faculty announcements and academic reminders

This fragmented workflow can lead to:

-   Missed assignment deadlines
-   Overlooked LMS updates
-   Attendance shortages
-   Last-minute exam preparation
-   Difficulty maintaining consistent study habits
-   Excessive time spent manually organizing schedules

## 💡 The Solution

StudyPilot AI acts as a **personalized academic mentor** that
coordinates a student's academic workload in the background.

It can:

-   Extract important dates from schedules and academic inputs
-   Identify task priorities and milestones
-   Generate personalized study schedules
-   Adapt plans when free hours or tasks change
-   Track academic progress and study streaks
-   Monitor attendance thresholds and safe skip allowances
-   Re-optimize schedules when planned study blocks are missed

##  Project Objectives

1.  **Centralize academic activities** from timetables, LMS platforms,
    and messaging systems.
2.  **Automatically generate study schedules** without requiring
    constant manual planning.
3.  **Prevent missed deadlines and academic stress** through proactive
    alerts and attendance monitoring.
4.  **Track academic progress and streaks** to encourage consistency.
5.  **Support structured learning habits** through personalized revision
    windows.

##  Core Features

###  Smart Timetable

-   Imports weekly courses and labs
-   Helps analyze attendance buffer requirements dynamically

### 🤖 AI Study Planner

-   Creates daily revision tasks
-   Considers remaining days, target milestones, and difficulty scores

###  Attendance Monitor

-   Identifies critical attendance thresholds
-   Shows safe skip allowances
-   Tracks required makeup hours

###  Editable Agenda

-   Allows students to accept, modify, or reschedule study blocks
-   Uses user modifications to refine future planning

###  Academic Progress Dashboard

-   Displays subject completion
-   Shows daily tasks and priority order
-   Tracks study streaks
-   Provides an at-a-glance weekly academic overview

##  System Workflow

``` text
Input → Analysis → Plan → Track → Learn
```

1.  **Input** --- Upload schedules, goals, and deadlines.
2.  **Analysis** --- Evaluate priorities and workloads.
3.  **Plan** --- Generate dynamic weekly study blocks.
4.  **Track** --- Log study progress, completions, and attendance.
5.  **Learn** --- Refine the plan based on user modifications.

##  How the AI Works

The StudyPilot AI workflow follows five main steps:

1.  **Ingest Data**\
    Extract schedules, timetables, and deadlines.

2.  **Prioritize**\
    Calculate task urgency and complexity.

3.  **Generate**\
    Assign optimal study hours based on available free time.

4.  **Monitor**\
    Check daily completion and study status.

5.  **Re-optimize**\
    Automatically rebalance the schedule when study blocks are skipped
    or plans change.

##  System Architecture

``` text
┌───────────────────────────────┐
│        React.js Frontend      │
│       Tailwind CSS + HTML     │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       FastAPI Backend         │
│           Python              │
└───────────────┬───────────────┘
                │
       ┌────────┴─────────┐
       ▼                  ▼
┌───────────────┐  ┌────────────────┐
│  Gemini API   │  │    HydraDB     │
│ AI Reasoning  │  │ Data Storage   │
└───────────────┘  └────────────────┘
```

### Architecture Layers

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  Frontend                React.js, Tailwind CSS, Dynamic calendars,
                          HTML                    progress gauges,
                                                  settings, and dashboard
                                                  UI

  Backend                 FastAPI, Python         API routes, user
                                                  records, and task
                                                  calculations

  AI Agent                Gemini API              Prioritization, task
                                                  allocation, workload
                                                  optimization, and
                                                  calendar structuring

  Database                HydraDB                 Stores tasks, goals,
                                                  and class schedules
  -----------------------------------------------------------------------

##  Technology Stack

### Frontend

-   React.js
-   Tailwind CSS
-   HTML

### Backend

-   Python
-   FastAPI

### AI

-   Gemini API

### Database

-   HydraDB


##  Example AI Decision

Consider a student with:

-   **DBMS Assignment** --- due tomorrow morning
-   **DSA Coding Test** --- due in 2 days
-   **Math Exam** --- in 5 days
-   **Attendance** --- 72%, marked as critical

StudyPilot AI can prioritize the workload by considering both deadlines
and attendance:

``` text
Today
├── Complete DBMS assignment
├── Attend Math lectures
└── Practice DSA for 1 hour

Tomorrow
└── Begin structured Math exam preparation
```

The goal is to balance **academic urgency, available time, attendance
safety, and long-term preparation** instead of simply sorting tasks by
deadline.

##  Dashboard

The dashboard provides a unified academic overview with:

-   Today's prioritized tasks
-   Weekly tracker
-   Subject completion percentages
-   Study streak counter
-   Progress analytics
-   Attendance information

The interface is designed to give students immediate clarity so they can
focus on studying instead of manually managing multiple schedules.

##  Future Enhancements

The project can be extended with:

-   **Voice Assistant Integration** --- verbally ask for schedule
    updates or log changes
-   **Google Suite Sync** --- bidirectional synchronization with Google
    Calendar and Classroom
-   **Syllabus Score Forecasting** --- forecast future test outcomes
    using historical progress and streaks
-   **Instant Summarization & Study Cards** --- convert course documents
    and notes into study cards
-   **Student Wellness Support** --- recommend structured screen breaks
    during high-stress exam periods

##  Real-World Applications

### Schools & Colleges

Integrate with institutional portals to synchronize official academic
events for students.

### E-Learning Platforms

Embed academic planning tools into online learning environments for
flexible-course students.

### Self-Learners

Help learners and working professionals manage certification and
learning goals around their schedules.

### Exam Aspirants

Create structured revision plans for competitive examinations with
strict milestones.

##  Benefits

StudyPilot AI is designed to provide:

-    **Time Savings** --- reduces manual timetable cross-checking
-    **Reduced Stress** --- minimizes last-minute preparation
-    **Proactive Deadline Management** --- keeps critical milestones visible
-    **Consistent Learning** --- encourages regular study habits
-    **Attendance Awareness** --- helps students monitor academic eligibility
-    **Unified Academic Hub** --- brings fragmented academic information together

##  Expected Impact

The project targets a more organized, productive, and adaptable academic
experience through:

-   Clear weekly study direction
-   Safer attendance management
-   Adaptive recovery when plans change
-   Improved consistency compared with traditional manual scheduling

The presentation targets a **30% average consistency boost** 
over traditional schedulers.

##  Team

**Team StatiX**

### Project Vision

     **Plan Smarter. Learn Better.**

StudyPilot AI aims to become a personal AI companion that helps students
spend less time organizing their academic lives and more time learning.

------------------------------------------------------------------------
