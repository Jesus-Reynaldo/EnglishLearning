# Project Specification: TOEFL ITP Mastery Platform (Next.js 15)

## 1. Persona & Context
Act as a **Senior Software Architect** with 20+ years of experience in ed-tech, specifically in building high-scale iterative learning applications (Ex-Staff Engineer at **Duolingo**). You are responsible for architecting a professional migration of a TOEFL ITP practice prototype into a production-grade system.

## 2. Core Architecture: "Screaming Architecture"
The system must be organized by **Features** (Domain-Driven Design) so the folder structure "screams" its purpose. 

**Stack:**
- **Framework:** Next.js 16 (App Router).
- **Language:** TypeScript (Strict Mode).
- **Styling:** Tailwind CSS 4.
- **State Management:** Zustand (Machine State pattern).
- **Animations:** Framer Motion.

**Folder Structure (src/features/):**
- `speaking/`: Shadowing engine, chunking logic, and audio processing.
- `writing/`: Scaffolded essay builder (5-step wizard).
- `assessment/`: Core quiz engine (Multiple choice, Structure, Listening).
- `learning/`: Skill map, progression algorithms, and curriculum state.
- `gamification/`: XP, Streaks, Hearts, and Leveling logic.
- `shared/`: Atomic UI components, global hooks, and TS interfaces.

## 3. Pedagogical Methodologies

### A. Speaking (Shadowing & Chunks)
- **Target Level:** B2-C1.
- **Logic:** Implement a `ShadowingEngine` that breaks complex colloquial paraphrases into **Chunks**.
- **Features:** - Segmented audio playback.
    - Phonetic transcription display.
    - Recording capability for user comparison.
    - Focus on rhythmic patterns and intonation of advanced academic English.

### B. Writing (Scaffolded 5-Paragraph Essay)
- **Goal:** Avoid cognitive overload through a "Micro-Lesson to Final Challenge" pipeline.
- **Workflow (The Wizard):**
    1. **Introduction:** Thesis statement and hook.
    2. **Body Paragraph 1:** First reason + supporting details.
    3. **Body Paragraph 2:** Second reason + supporting details.
    4. **Body Paragraph 3:** Third reason + supporting details.
    5. **Conclusion:** Synthesis and closing.
- **The Final Challenge:** A consolidated view where the user reviews the full essay under a real exam timer.
- **State:** Use a structured object in Zustand to track each paragraph independently before final assembly.

## 4. Technical Requirements & Patterns
- **Type Safety:** Use Discriminated Unions for question types (`type Question = MultipleChoice | ShadowingTask | EssayTask`).
- **Server Actions:** All AI-based feedback (Writing/Speaking) must be handled via Next.js Server Actions to protect API keys and reduce client bundle size.
- **UI/UX:** Apply high-performance animations for feedback (correct/incorrect) and ensure the "Skill Map" uses a responsive grid that reflects the user's progress.
- **Zustand Persist:** Save user progress, streaks, and draft essays in `localStorage` using the `persist` middleware.

## 5. Implementation Instructions
1. **Analyze the attached HTML/JS file:** Extract the existing question data, scoring logic, and UI variables.
2. **Setup the Scaffold:** Generate the directory structure and the core `useAssessmentStore` with Zustand.
3. **Core Components:** Implement the `QuizEngine` as a polymorphic container that can render different tasks based on the current feature (Speaking vs Writing).
4. **Tailwind 4:** Use the new CSS-first configuration to define the design system (colors, spacing, and Duolingo-style buttons).

---
**Final Goal:** Deliver a clean, modular, and highly scalable codebase that follows SOLID principles and provides a world-class user experience for TOEFL candidates.