<div align="center">

# ⚡ CodeBuddy: Level Up Your Code

### **The Gamified Coding Learning Platform for Modern Developers**

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI-FF6B2B?style=for-the-badge)](https://console.groq.com/)

[**Live Demo**](https://code-buddy-eta.vercel.app/) • [**Report Bug**](https://github.com/Khushant15/CodeBuddyWebApp/issues) • [**Request Feature**](https://github.com/Khushant15/CodeBuddyWebApp/issues)

**Learn by doing.** Master Python, Web Development, and React through interactive lessons, real-world debugging challenges, and an AI mentor that never sleeps.

</div>

---

## 📸 Overview

CodeBuddy transforms the learning experience into an RPG-like adventure. Earn **XP**, maintain **Streaks**, and climb **Levels** as you conquer complex coding concepts. Whether you're a total beginner or a seasoned dev looking to brush up, CodeBuddy provides a high-octane environment to build real skills.

---

## 🚀 Key Features

### 🎓 **Immersive Learning Tracks**
Deep-dive into structured curriculums with instant theory-to-practice loops:
*   **Python Mastery** (8 Modules, 40 Lessons)
*   **HTML Development** (7 Modules, 35 Lessons)
*   **JavaScript Core** (4 Modules, 20 Lessons)
*   **React Framework** (4 Modules, 20 Lessons)
*   **CSS Essentials** (4 Modules, 20 Lessons)

### 🐛 **Debug Arena**
Sharpen your problem-solving skills in our timed debugging challenge mode. Solve real-world bugs, use progressive hints, and earn massive XP for quick fixes.

### 🤖 **AI Mentor (Powered by Groq)**
Get unstuck instantly. Our AI assistant, powered by Llama 3 on Groq's high-speed inference engine, provides code reviews, explains complex logic, and guides you toward solutions without giving them away.

### 📊 **Progress Analytics**
Track your growth with a beautiful dashboard. Monitor your learning streaks, weekly activity, and skill distribution across different technologies.

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) | Modern App Router architecture |
| **Logic** | [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first "Neon Noir" design |
| **Auth** | [Firebase Auth](https://firebase.google.com/docs/auth) | Secure user identity & Google OAuth |
| **Database** | [Firestore](https://firebase.google.com/docs/firestore) | Real-time progress & XP tracking |
| **AI API** | [Groq Cloud](https://console.groq.com/) | Ultra-fast Llama 3.3 Large Language Model |
| **Runtime** | [Pyodide](https://pyodide.org/) | Scientific Python runtime in the browser |
| **Interactions**| [Framer Motion](https://www.framer.com/motion/) | Fluid micro-interactions & transitions |

---

## 📁 Project Architecture

```bash
CodeBuddy/
├── app/                  # Next.js App Router (Pages, Layouts, API)
│   ├── learn/            # Dynamic Curriculum Engine
│   ├── practice/         # Debugging Arena implementation
│   ├── dashboard/        # User analytics & profile management
│   └── api/              # Proxy endpoints for AI and Code Review
├── components/           # Atomic UI Design System
│   ├── LessonRenderer.tsx # Renders curriculum theory
│   ├── ExerciseComponents.tsx # Interactive challenge engine
│   └── AIChat.tsx        # Floating AI mentor interface
├── lib/                  # Core Business Logic
│   ├── curriculum/       # JSON-based content system & types
│   ├── userService.ts    # Firestore data layer
│   └── groqService.ts    # AI integration service
├── scripts/              # Productivity Automation
│   └── sync-curriculum.js # Content synchronization pipeline
├── public/               # Static assets & runtime curriculum
└── firestore.rules       # Security & access control patterns
```

---

## 🏁 Getting Started

### 1. Requirements
*   **Node.js** 18.0 or higher
*   **Groq API Key** (Get it free at [console.groq.com](https://console.groq.com))
*   **Firebase Account** (Optional for local testing)

### 2. Installation
```bash
# Clone the repo
git clone https://github.com/Khushant15/CodeBuddyWebApp.git

# Enter the project
cd CodeBuddyWebApp

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Essential for Chat functionality
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here

# Firebase configuration (See config.ts for details)
NEXT_PUBLIC_FIREBASE_API_KEY=...
```

### 4. Content Synchronization
Before running the app, sync the curriculum modules:
```bash
npm run sync:curriculum
```

### 5. Launch the Experience
```bash
npm run dev
```
Open [**localhost:3000**](http://localhost:3000) to start your journey.

---

## 🎨 Visual Identity
CodeBuddy follows a bespoke **"Neon Noir"** design system defined in `app/globals.css`.

*   🟢 **Neon Green** (`#00ff87`) - Success & Primary Actions
*   🟣 **Neon Violet** (`#bf5fff`) - Mastery & Advanced Features
*   🔵 **Neon Cyan** (`#00e5ff`) - Interactive & Info Elements
*   🟠 **Neon Orange** (`#ff6b2b`) - Warnings & Practice Mode
*   🌑 **Deep Void** (`#020208`) - Base Background

---

## 🤝 Contributing
We love contributions! If you have an idea for a new lesson, a bug fix, or a UI enhancement, please:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---

## 📝 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

Built with ❤️ by **[Khushant Sharma](https://github.com/Khushant15)**  
*Mumbai, India*

**[Star this Repository](https://github.com/Khushant15/CodeBuddy)** if you find it useful!

</div>
