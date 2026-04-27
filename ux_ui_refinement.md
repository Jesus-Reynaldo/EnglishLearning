# UI/UX Master Specification: TOEFL ITP "Neo-Academic" Platform

## 1. Persona & Vision
**Role:** Senior Principal Product Designer (20+ years experience in EdTech & Cognitive Load Theory).
**Objective:** Evolve a functional prototype into a high-performance "Neo-Academic" ecosystem. The design must feel as polished as **Linear**, as inspiring as **MasterClass**, and as intuitive as **Apple Music**.

## 2. Design System Tokens (Tailwind CSS 4)

### A. Color Palette: "Sophisticated Mastery"
* **Backgrounds:** `zinc-50` (Base), `white` (Cards), `zinc-100` (Secondary sections).
* **Typography:** `zinc-900` (Headings), `zinc-600` (Body), `zinc-400` (Metadata).
* **Accents:**
    * **Level C1 Indigo:** `#5522E2` (Primary actions, focus states).
    * **Success Emerald:** `#059669` (Correct answers, progress).
    * **Alert Rose:** `#F43F5E` (Mistakes, attention needed).
* **Surface:** Use `glassmorphism` (`backdrop-blur-md` + `bg-white/70`) for sticky headers and floating navigation.

### B. Typography Strategy
* **Interface (UI/Nav):** Sans-serif (**Geist Sans** or **Inter**). Professional, geometric, and clean.
* **Study Content (Reading/Writing):** Serif (**Newsreader** or **Playfair Display**). 
    * *Rationale:* Academic immersion. Serif fonts prepare the user's brain for the formal structure of the TOEFL exam.
* **Utility:** Use `monospace` for phonetic transcriptions and word counts.

## 3. High-Fidelity Feature UX

### A. Speaking: The Shadowing Dashboard
* **Dual Waveform:** Implement a visual comparison component.
    * *Top Wave:* Native speaker's cadence (Indigo).
    * *Bottom Wave:* User's recording (Emerald if matches, Zinc if processing).
* **Interactive Chunks:** Phrases are displayed as discrete `pills`.
    * *Interaction:* Click a pill to hear that specific segment. Long-press to see the IPA (Phonetic) transcription.
* **Visual Rhythm:** Use a "moving playhead" that highlights chunks in real-time as the audio plays.

### B. Writing: The 5-Paragraph Stepper (Scaffolding)
* **Focus Mode:** Only the active paragraph (e.g., "Body Paragraph 2") is at 100% opacity. Previous and future steps are at 30% opacity to eliminate distraction.
* **Smart Sidebar:** A persistent but collapsible side panel containing:
    * The Essay Prompt.
    * "Topic Sentence" reminders.
    * A checklist of B2-C1 connectors (e.g., *Furthermore, Conversely, Consequently*) that light up when used.
* **The Final Challenge Transition:** Once the 5 steps are done, use a `framer-motion` layout transition to expand the 5 blocks into a single cohesive document view for final proofreading.

### C. Gamification: The Spatial Skill Map
* **Non-Linear Path:** A curved, organic SVG path representing the learning journey.
* **Node States:**
    * *Locked:* Semi-transparent with a subtle grayscale filter.
    * *Current:* Animated "breathing" outer ring in Indigo.
    * *Mastered:* Radial progress border in Emerald with a subtle checkmark.

## 4. Motion Design & Interaction
* **Micro-interactions:** Use `framer-motion` for "spring" physics on button clicks (scale: 0.95).
* **Feedback Loops:** * *Correct:* A clean, non-obtrusive emerald pulse.
    * *Incorrect:* A gentle horizontal shake (`x: [-2, 2, -2, 0]`).
* **Loading States:** High-fidelity skeletons that mirror the "Neo-Academic" card layout to prevent layout shift.

## 5. Technical Constraints
* **Next.js 15:** Use Client Components only where interactivity is required (`'use client'`).
* **Responsive:** The "Writing Stepper" must adapt to a "Split-Screen" view on tablets and a "Stacked Wizard" on mobile.
* **Accessibility:** ARIA labels for all audio controls and a minimum contrast ratio of 7:1 for study materials.

---
**Prompt for Generator:** "Using the `ux_ui_refinement.md` specs, generate the React components for the **Shadowing Module** and the **Writing Wizard**. Ensure the code is modular, uses Tailwind 4 variables, and implements the 'Focus Mode' logic for the essay paragraphs."