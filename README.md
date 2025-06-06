# RoleWithAI 🚀

[![CI Status](https://img.shields.io/badge/CI-Passing-brightgreen)](https://github.com/yourusername/RoleWithAI/actions)
[![npm version](https://img.shields.io/npm/v/rolewithai)](https://www.npmjs.com/package/rolewithai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📚 Documentation

- [System Architecture](./docs/ARCHITECTURE.md)
- [Testing Strategy](./docs/TESTING.md)
- [Product Management](./docs/PRODUCT.md)
- [Component Library](./docs/COMPONENTS.md)

## 🎯 Why RoleWithAI?

RoleWithAI is an AI-powered career development platform that helps professionals navigate their career journey through personalized guidance, skill tracking, and interactive learning experiences.

### Key Differentiators

- 🤖 **AI-Powered Personalization**: Tailored career advice and learning paths
- 🎮 **Gamified Learning**: XP system, achievements, and progress tracking
- 🧩 **Modular Dashboards**: Customizable widgets and layouts
- 🎯 **Career Roadmapping**: Visual career progression paths
- 🤝 **Human-AI Hybrid**: Combines AI guidance with human mentorship

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/RoleWithAI.git
cd RoleWithAI

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎨 Theming

RoleWithAI uses a modern dark theme with carefully selected colors for optimal readability and visual hierarchy.

### Color Palette

- Background: `#121212`
- Surface/Card: `#1C1C1E`
- Border: `#2C2C2E`
- Primary: `#0077B5` (LinkedIn blue)
- Success: `#16B364`
- Warning: `#F59E0B`
- Text Primary: `#FFFFFF`
- Text Secondary: `#A1A1AA`

## 📱 Pages

### `/dashboard`
- Personalized greeting
- KPI cards (Weekly XP, Skills, Streak)
- Customizable widgets
- Recent activity feed

### `/mentor`
- AI chat interface
- Human mentor connections
- Suggested topics
- Conversation history

### `/skills`
- Skill assessment
- Progress tracking
- Learning recommendations
- Achievement badges

### `/roadmap`
- Career progression visualization
- Milestone tracking
- Learning path suggestions
- Industry insights

## 🛠️ Installation

1. **Prerequisites**
   - Node.js 18+
   - npm or pnpm
   - Git

2. **Environment Setup**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

3. **Development**
   ```bash
   npm run dev
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

# RoleWithAI Frontend

## Overview
RoleWithAI is an AI-powered career development platform designed to help users navigate their career journey with interactive dashboards, skill tracking, AI mentorship, and a vibrant community. The frontend is built with Next.js, React, and Radix UI, featuring a modern, glossy, and highly interactive user interface.

## Visual Design
- **Modern, Glossy UI:** Uses glassmorphism, gradients, and soft shadows for a futuristic look.
- **Dark Theme by Default:** Theme toggling is supported via `next-themes`.
- **Responsive Layout:** All pages and components are mobile-friendly and adapt to various screen sizes.
- **Sidebar Navigation:** Persistent sidebar with icons for Dashboard, Roadmap, Skills, Mentor, and Community.
- **Animated Micro-Interactions:** XP progress, notifications, and tab transitions use Framer Motion for smooth animations.

## Main Features

### 1. Dashboard
- **AI Career Dashboard:** Central hub with tabs for Roadmap, Skills, Achievements, Resources, and Community.
- **Career Path Visualization:** Interactive roadmap showing progress through AI/ML career stages.
- **Skill Progress:** Visualize technical, ML, and data skills with progress bars and levels.
- **Achievements:** Track unlocked and locked achievements, XP, and badges.
- **Recent Activity:** Timeline of user actions (courses, projects, mentor chats, etc.).
- **Resources:** Curated courses, tutorials, and projects with ratings and tags.
- **Community:** See top contributors, discussions, events, and open-source projects.

### 2. Mentor
- **AI Mentor Chat:** Conversational interface for career advice and Q&A.
- **Contextual Tips:** AI-driven suggestions based on user activity and goals.

### 3. Resume
- **Resume Uploader:** Upload and analyze resumes for skill gaps and suggestions.
- **Resume Analysis:** AI feedback on strengths, weaknesses, and improvement areas.

### 4. Skills
- **Skill Progress Card:** Track and visualize progress in technical, ML, and data skills.
- **Animated XP Bar:** Gamified experience points system with level-ups.
- **Contextual Tips:** Personalized learning suggestions.

### 5. Roadmap
- **Career Roadmap:** Interactive, node-based visualization of career progression, with completed, in-progress, and locked stages.

### 6. Community
- **Discussions:** Participate in AI/ML discussions, ask questions, and share knowledge.
- **Events:** View and join upcoming career fairs, workshops, and hackathons.
- **Projects:** Discover and contribute to open-source projects.
- **Leaderboard:** See top contributors and earn points.

### 7. Resources
- **Courses, Tutorials, Projects:** Curated learning materials with tags, ratings, and quick actions (enroll, read, fork).
- **Learning Path:** Visual timeline of completed, in-progress, and locked learning modules.
- **Recommended Content:** AI-powered suggestions for next steps.

### 8. Achievements
- **Badges & XP:** Earn badges for milestones, track XP, and view stats.
- **Progress Tracking:** See unlocked/locked achievements and progress toward new ones.

### 9. Recent Activity
- **Timeline:** Chronological feed of user actions, including completed courses, projects, mentor chats, and more.

## UI/UX Highlights
- **Framer Motion Animations:** Smooth transitions and feedback for all interactive elements.
- **Radix UI Components:** Accessible, customizable dropdowns, tabs, tooltips, and more.
- **Theming:** System and user-selectable dark/light themes.
- **Accessibility:** Keyboard navigation and ARIA support via Radix UI.
- **Micro-Interactions:** XP gain, notifications, and streaks are visually engaging.

## Getting Started
1. Install dependencies: `pnpm install`
2. Run the development server: `pnpm run dev`
3. Build for production: `pnpm run build`

---

For more details, see the code in the `src/app` and `src/components` directories. Each feature is modularized for easy extension and maintenance.
