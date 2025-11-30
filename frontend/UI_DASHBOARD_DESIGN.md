# RoleWithAI Frontend UI Dashboard - Design Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Layout & Structure](#layout--structure)
3. [Color Scheme](#color-scheme)
4. [Typography](#typography)
5. [Components](#components)
6. [Features](#features)
7. [Design System](#design-system)
8. [Responsive Design](#responsive-design)
9. [Animations & Interactions](#animations--interactions)
10. [Technology Stack](#technology-stack)

---

## Overview

The RoleWithAI Dashboard is a modern, dark-themed career development platform that provides users with personalized insights, skill tracking, and actionable recommendations based on their uploaded resume. The design follows a clean, professional aesthetic inspired by modern SaaS platforms like Stream, with a focus on data visualization and user engagement.

### Design Philosophy

- **Dark-First Design**: Optimized for dark mode with light mode support
- **Data-Driven**: Emphasis on visualizations, metrics, and actionable insights
- **Gamification**: XP system, levels, achievements, and challenges
- **Accessibility**: WCAG-compliant with proper focus states and semantic HTML
- **Responsive**: Mobile-first approach with breakpoints for all screen sizes

---

## Layout & Structure

### Main Layout Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    Header (Global)                      │
├─────────────────────────────────────────────────────────┤
│                  SubToolbar (Actions)                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Greeting Section                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │ Profile  │ Resume   │ Career   │ Quick    │        │
│  │ Summary  │ Score    │ Level    │ Actions  │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Prioritized Actions Row                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              XP & Metrics Row                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────┬──────────────────────────────────┐  │
│  │              │                                    │  │
│  │   Profile    │    Skill Gap Analysis             │  │
│  │   Details    │                                    │  │
│  │   (Sidebar)  │    Daily Challenges               │  │
│  │              │                                    │  │
│  └──────────────┴──────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Application Tracker (Full Width)          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Career Analytics                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Recent Activity Feed                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Grid System

- **Container**: `max-w-7xl mx-auto` (1280px max width, centered)
- **Padding**: `px-4 lg:px-8` (responsive horizontal padding)
- **Gap**: `gap-6` (24px) between major sections
- **Main Grid**: `grid-cols-1 lg:grid-cols-12` for two-column layout
  - Left Column: `lg:col-span-4` (Profile details)
  - Right Column: `lg:col-span-8` (Main content)

### Section Spacing

- **Top Padding**: `pt-32` (128px) to account for fixed header
- **Section Margins**: `mb-8` (32px) between major sections
- **Card Padding**: `p-6` (24px) standard, `p-4` (16px) compact

---

## Color Scheme

### Dark Mode (Primary)

The dashboard uses a sophisticated dark color palette optimized for extended viewing:

#### Background Colors

```css
--background: hsl(0, 0%, 4%)        /* #0B0B0D - Main background */
--card: hsl(0, 0%, 4%)              /* Card backgrounds */
--secondary: hsl(240, 3.7%, 15.9%)  /* Secondary surfaces */
--muted: hsl(240, 3.7%, 15.9%)      /* Muted backgrounds */
```

**Gradient Backgrounds:**
- Main Layout: `bg-gradient-to-br from-[#0B0B0D] via-[#111214] to-[#0B0B0D]`
- Cards: `bg-[#111214]` with `border-white/10`

#### Text Colors

```css
--foreground: hsl(210, 14%, 83%)     /* Primary text - #D1D5DB */
--muted-foreground: hsl(240, 5%, 64.9%) /* Secondary text */
```

**Text Hierarchy:**
- Primary: `text-white` (100% opacity)
- Secondary: `text-slate-300` (70% opacity)
- Tertiary: `text-slate-400` (50% opacity)
- Muted: `text-slate-500` (40% opacity)

#### Accent Colors

```css
--primary: hsl(220, 79%, 46%)        /* Blue accent - #3B82F6 */
--accent: hsl(220, 79%, 46%)         /* Matching accent */
--ring: hsl(220, 79%, 46%)           /* Focus rings */
```

**Semantic Colors:**
- **Success**: `#10B981` (Green) - `text-green-400`
- **Warning**: `#F59E0B` (Orange) - `text-orange-400`
- **Error**: `#EF4444` (Red) - `text-red-400`
- **Info**: `#3B82F6` (Blue) - `text-blue-400`
- **Gold**: `#FCD34D` (Yellow) - `text-yellow-400`

#### Border Colors

```css
--border: hsl(240, 3.7%, 15.9%)      /* Subtle borders */
```

**Border Usage:**
- Cards: `border-white/10` (10% opacity white)
- Dividers: `border-white/5` (5% opacity white)
- Inputs: `border-white/10`

### Light Mode (Secondary)

Light mode is fully supported with inverted color scheme:

```css
--background: hsl(0, 0%, 100%)       /* White background */
--foreground: hsl(240, 10%, 3.9%)    /* Dark text */
--card: hsl(0, 0%, 100%)             /* White cards */
--border: hsl(240, 5.9%, 90%)        /* Light borders */
```

### Gradient Accents

- **Primary Gradient**: `linear-gradient(135deg, #9333EA 0%, #3B82F6 100%)` (Purple to Blue)
- **Text Gradient**: `linear-gradient(to right, hsl(220, 79%, 46%), hsl(220, 100%, 70%))`
- **Avatar Gradient**: `bg-gradient-to-br from-blue-500 to-purple-600`

---

## Typography

### Font Family

**Primary Font**: `Geist` (Sans-serif)
- Source: `https://ext.same-assets.com/3935461500/912599287.woff2`
- Used for: Body text, headings, UI elements
- Fallback: `sans-serif`

**Monospace Font**: `Geist Mono`
- Source: `https://ext.same-assets.com/3935461500/1913583637.woff2`
- Used for: Code blocks, technical content
- Fallback: `monospace`

### Typography Scale

The dashboard uses a 3-tier hierarchy system:

#### Headings

```css
.dashboard-h1 {
  font-size: 24px;      /* 1.5rem */
  line-height: 1.2;
  font-weight: 700;     /* Bold */
}

.dashboard-h2 {
  font-size: 20px;      /* 1.25rem */
  line-height: 1.3;
  font-weight: 600;     /* Semi-bold */
}

.dashboard-h3 {
  font-size: 18px;      /* 1.125rem */
  line-height: 1.4;
  font-weight: 600;      /* Semi-bold */
}

.dashboard-h4 {
  font-size: 16px;       /* 1rem */
  line-height: 1.4;
  font-weight: 600;      /* Semi-bold */
}
```

#### Body Text

```css
.dashboard-body {
  font-size: 14px;       /* 0.875rem */
  line-height: 1.6;
  font-weight: 400;      /* Regular */
}

.dashboard-body-sm {
  font-size: 13px;       /* 0.8125rem */
  line-height: 1.5;
  font-weight: 400;      /* Regular */
}

.dashboard-caption {
  font-size: 12px;       /* 0.75rem */
  line-height: 1.4;
  font-weight: 500;      /* Medium */
}
```

### Typography Usage

- **H1**: Page titles, major section headers
- **H2**: Card titles, section headers
- **H3**: Subsection headers, card subheaders
- **H4**: Component titles, small headers
- **Body**: Main content, descriptions
- **Body SM**: Secondary content, metadata
- **Caption**: Labels, timestamps, fine print

### Font Weights

- **400 (Regular)**: Body text, descriptions
- **500 (Medium)**: Labels, captions
- **600 (Semi-bold)**: Headings, emphasized text
- **700 (Bold)**: Primary headings, important labels

---

## Components

### Core Dashboard Components

#### 1. **DashboardLayout**
- **Purpose**: Main layout wrapper with header and toolbar
- **Features**: 
  - Fixed header navigation
  - SubToolbar with quick actions
  - Responsive container
  - Gradient background

#### 2. **Greeting**
- **Purpose**: Personalized welcome message
- **Features**:
  - Dynamic greeting based on time of day
  - User name display
  - Motivational messaging

#### 3. **ProfileSummaryCard**
- **Purpose**: Display user profile overview
- **Features**:
  - Avatar (gradient fallback with initials)
  - Full name and title
  - Location
  - Education information
  - Compact card design

#### 4. **ResumeScoreCard**
- **Purpose**: Show resume quality score
- **Features**:
  - Score display (0-100)
  - Visual progress indicator
  - Improvement suggestions
  - Download action

#### 5. **CareerLevelCard**
- **Purpose**: Display career progression
- **Features**:
  - Level number and name (Novice, Skilled, Pro, Expert)
  - XP progress bar
  - Next unlock preview
  - Challenge navigation

#### 6. **QuickActionsCard**
- **Purpose**: Quick access to common actions
- **Features**:
  - Upload resume button
  - Add job description
  - Ask AI assistant
  - Icon-based navigation

#### 7. **PrioritizedActionsRow**
- **Purpose**: Contextual action recommendations
- **Features**:
  - Best job match highlight
  - Build project suggestion
  - Mock interview prompt
  - Action-oriented CTAs

#### 8. **XPRow**
- **Purpose**: Display gamification metrics
- **Features**:
  - Total XP display
  - Skills progressed count
  - Streak counter
  - Visual indicators

#### 9. **SkillGapMap**
- **Purpose**: Analyze skill gaps for target roles
- **Features**:
  - Categorized skill gaps (Programming, Data & ML, Cloud & DevOps)
  - Expandable categories
  - Current vs. required level visualization
  - Action pipeline (courses, projects, quizzes)
  - XP rewards for actions
  - Animated transitions

#### 10. **DailyChallenges**
- **Purpose**: Gamified task system
- **Features**:
  - Challenge cards with XP rewards
  - Completion status
  - Time estimates
  - Action buttons
  - Progress tracking

#### 11. **ApplicationTracker**
- **Purpose**: Track job applications
- **Features**:
  - Company and role display
  - Application status
  - Match percentage
  - Visual status indicators

#### 12. **CareerAnalytics**
- **Purpose**: Display career metrics
- **Features**:
  - Profile views
  - Post impressions
  - Search appearances
  - Chart visualizations

#### 13. **RecentActivityFeed**
- **Purpose**: Show recent user activity
- **Features**:
  - Activity timeline
  - Activity types (skill, experience, update)
  - Timestamps
  - Icon indicators

#### 14. **AchievementBadges**
- **Purpose**: Display earned achievements
- **Features**:
  - Badge icons
  - Achievement names
  - Grid layout
  - Unlock status

#### 15. **ProfileAccordion**
- **Purpose**: Collapsible profile details
- **Features**:
  - Experience sections
  - Expandable/collapsible
  - Detailed information display

#### 16. **EmptyState**
- **Purpose**: Handle empty data states
- **Features**:
  - Contextual messaging
  - Action prompts
  - Visual indicators

#### 17. **ConfidenceWarning**
- **Purpose**: Alert users to low extraction confidence
- **Features**:
  - Confidence percentage display
  - Field-specific warnings
  - Verification prompts

### UI Components (shadcn/ui)

The dashboard uses shadcn/ui components:

- **Card**: Container component with dark styling
- **Button**: Multiple variants (default, outline, ghost)
- **Dialog**: Modal dialogs
- **Tabs**: Tab navigation
- **Tooltip**: Hover information
- **Badge**: Status indicators
- **Input**: Form inputs
- **ScrollArea**: Custom scrollable areas
- **Separator**: Visual dividers

---

## Features

### 1. Resume Upload & Parsing
- PDF upload with drag-and-drop
- Real-time parsing status
- Structured data extraction
- Confidence scoring

### 2. Profile Management
- Automatic profile creation from resume
- Manual editing capabilities
- Avatar upload
- Education tracking

### 3. Skill Tracking
- Skill catalog
- Proficiency levels
- Skill gap analysis
- Category organization

### 4. Career Progression
- Level system (1-10+)
- XP accumulation
- Achievement system
- Unlock progression

### 5. Job Matching
- Application tracking
- Match percentage calculation
- Status management
- Company information

### 6. Skill Gap Analysis
- Target role comparison
- Gap identification
- Action recommendations
- Progress tracking

### 7. Daily Challenges
- Gamified tasks
- XP rewards
- Time estimates
- Completion tracking

### 8. Analytics Dashboard
- Profile views
- Engagement metrics
- Search appearances
- Visual charts

### 9. Activity Feed
- Recent actions
- Timeline view
- Activity types
- Timestamps

### 10. AI Assistant Integration
- Quick access button
- Notification badges
- Contextual suggestions

---

## Design System

### Spacing Scale

```css
.dashboard-spacing-xs { padding: 4px; gap: 4px; }    /* 0.25rem */
.dashboard-spacing-sm { padding: 8px; gap: 8px; }    /* 0.5rem */
.dashboard-spacing-md { padding: 16px; gap: 16px; } /* 1rem */
.dashboard-spacing-lg { padding: 24px; gap: 24px; }  /* 1.5rem */
```

### Card Padding

```css
.dashboard-card-sm { padding: 12px 16px; }  /* Compact */
.dashboard-card { padding: 16px 24px; }     /* Standard */
.dashboard-card-lg { padding: 24px 32px; } /* Large */
```

### Border Radius

```css
--radius: 0.5rem;              /* 8px - Standard */
border-radius: 0.5rem;         /* Cards, buttons */
border-radius: 0.375rem;       /* 6px - Small elements */
border-radius: 9999px;        /* Full - Pills, badges */
```

### Shadows

- **Card Shadow**: `shadow-lg` (subtle elevation)
- **Hover Shadow**: `shadow-xl` (interactive feedback)
- **Modal Shadow**: `shadow-2xl` (overlay emphasis)

### Focus States

```css
.dashboard-focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
```

All interactive elements include visible focus states for accessibility.

### Hover States

```css
.dashboard-hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
```

---

## Responsive Design

### Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Responsive Patterns

#### Grid Layouts

```tsx
// 4-card hero layout
grid-cols-1                    // Mobile: 1 column
md:grid-cols-2                 // Tablet: 2 columns
lg:grid-cols-4                 // Desktop: 4 columns

// Main content grid
grid-cols-1                    // Mobile: Stacked
lg:grid-cols-12                // Desktop: 12-column grid
lg:col-span-4                  // Left: 4 columns
lg:col-span-8                  // Right: 8 columns
```

#### Typography Scaling

```css
/* Mobile */
.dashboard-h1 { font-size: 18px; }
.dashboard-h2 { font-size: 16px; }
.dashboard-body { font-size: 13px; }
.dashboard-card { padding: 12px; }

/* Tablet */
.dashboard-h1 { font-size: 20px; }
.dashboard-h2 { font-size: 18px; }
.dashboard-card { padding: 16px; }

/* Desktop */
.dashboard-h1 { font-size: 24px; }
.dashboard-h2 { font-size: 20px; }
.dashboard-card { padding: 24px; }
```

#### Padding Adjustments

- **Mobile**: `px-4` (16px)
- **Desktop**: `lg:px-8` (32px)
- **Top Padding**: `pt-32` (128px) - accounts for fixed header

### Mobile Optimizations

- Stacked card layouts
- Full-width components
- Touch-friendly button sizes (min 44x44px)
- Simplified navigation
- Collapsible sections

---

## Animations & Interactions

### Micro Animations

#### Pulse Animation

```css
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.dashboard-pulse {
  animation: pulse-ring 2s ease-in-out infinite;
}
```

#### Fade Transitions

```tsx
// Using Framer Motion
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
>
```

#### Slide Transitions

```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.2 }}
>
```

### Interaction Patterns

#### Hover Effects

- **Cards**: Subtle lift with shadow increase
- **Buttons**: Background color change, scale transform
- **Links**: Underline animation
- **Icons**: Color transition

#### Loading States

- Skeleton loaders for async content
- Spinner animations
- Progress indicators

#### Success Feedback

- Confetti animations (canvas-confetti)
- Toast notifications
- Success badges

### Transition Timing

- **Fast**: 150ms (hover states, micro-interactions)
- **Standard**: 200ms (card transitions, modals)
- **Slow**: 300ms (page transitions, complex animations)

---

## Technology Stack

### Core Technologies

- **Framework**: Next.js 15.2.0 (React 18.3.1)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion 12.12.1
- **Icons**: Lucide React 0.475.0
- **Charts**: Recharts 2.15.3
- **Theming**: next-themes 0.4.6
- **Confetti**: canvas-confetti 1.9.3

### Build Tools

- **Package Manager**: Bun / npm / pnpm
- **Linting**: Biome 1.9.4
- **Type Checking**: TypeScript
- **Bundler**: Turbopack (Next.js)

### Development Tools

- **Code Formatting**: Biome
- **Type Safety**: TypeScript strict mode
- **Component Library**: shadcn/ui
- **State Management**: React hooks (useState, useEffect)

### Design Tools Integration

- **Design Tokens**: CSS custom properties
- **Color System**: HSL color space
- **Typography**: Custom font loading
- **Spacing**: Tailwind spacing scale

---

## Component Architecture

### File Structure

```
frontend/src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard page
│   ├── globals.css           # Global styles & CSS variables
│   └── layout.tsx            # Root layout with theme provider
├── components/
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── DashboardLayout.tsx
│   │   ├── ProfileSummaryCard.tsx
│   │   ├── ResumeScoreCard.tsx
│   │   ├── CareerLevelCard.tsx
│   │   ├── QuickActionsCard.tsx
│   │   ├── SkillGapMap.tsx
│   │   ├── DailyChallenges.tsx
│   │   ├── ApplicationTracker.tsx
│   │   ├── CareerAnalytics.tsx
│   │   └── ... (27 components)
│   └── ui/                   # shadcn/ui components
│       ├── card.tsx
│       ├── button.tsx
│       ├── dialog.tsx
│       └── ...
├── styles/
│   └── dashboard.css        # Dashboard-specific styles
└── lib/
    ├── api.ts               # API client
    ├── resumeSchema.ts      # TypeScript types
    └── utils.ts            # Utility functions
```

### Component Patterns

#### Props Interface

```typescript
interface ComponentProps {
  profile: Partial<ResumeProfile> | null;
  onAction?: () => void;
  // ... other props
}
```

#### State Management

```typescript
const [state, setState] = useState<Type>(initialValue);
```

#### Data Fetching

```typescript
useEffect(() => {
  const loadData = async () => {
    const data = await getLatestResume();
    // Handle data
  };
  loadData();
}, []);
```

---

## Accessibility

### WCAG Compliance

- **Color Contrast**: All text meets WCAG AA standards (4.5:1 minimum)
- **Focus Indicators**: Visible focus states on all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Semantic HTML and ARIA labels
- **Alt Text**: Images include descriptive alt text

### Semantic HTML

- Proper heading hierarchy (h1 → h2 → h3)
- Semantic elements (`<main>`, `<aside>`, `<nav>`)
- Form labels and inputs properly associated
- Button vs. link distinction

### ARIA Attributes

- `aria-label` for icon-only buttons
- `aria-expanded` for collapsible sections
- `aria-live` for dynamic content updates
- `role` attributes where appropriate

---

## Performance Optimizations

### Code Splitting

- Next.js automatic code splitting
- Dynamic imports for heavy components
- Route-based splitting

### Image Optimization

- Next.js Image component
- Lazy loading
- Responsive images

### Bundle Size

- Tree shaking enabled
- Minimal dependencies
- Optimized imports

### Rendering

- Client-side rendering for interactive components
- Server components where possible
- Optimistic UI updates

---

## Browser Support

### Supported Browsers

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### Progressive Enhancement

- Core functionality works without JavaScript
- Enhanced experience with JavaScript enabled
- Graceful degradation for older browsers

---

## Future Enhancements

### Planned Features

1. **Dark/Light Mode Toggle**: User preference persistence
2. **Customizable Dashboard**: Drag-and-drop widget arrangement
3. **Export Options**: PDF/CSV export for analytics
4. **Real-time Updates**: WebSocket integration for live data
5. **Advanced Filtering**: Multi-criteria filtering for applications
6. **Comparison Mode**: Side-by-side role comparison
7. **Timeline View**: Career progression timeline
8. **Social Features**: Share achievements, compare with peers

### Design Improvements

1. **Micro-interactions**: More refined hover and click feedback
2. **Loading States**: Enhanced skeleton loaders
3. **Error States**: More informative error messages
4. **Empty States**: More engaging empty state designs
5. **Onboarding**: Interactive tutorial for new users

---

## Design Resources

### Color Palette Reference

```css
/* Primary Colors */
--primary-blue: hsl(220, 79%, 46%);    /* #3B82F6 */
--primary-purple: hsl(270, 91%, 65%);  /* #9333EA */

/* Semantic Colors */
--success: hsl(142, 71%, 45%);         /* #10B981 */
--warning: hsl(38, 92%, 50%);          /* #F59E0B */
--error: hsl(0, 84%, 60%);              /* #EF4444 */
--info: hsl(199, 89%, 48%);             /* #0EA5E9 */

/* Neutral Colors */
--background: hsl(0, 0%, 4%);           /* #0B0B0D */
--card: hsl(0, 0%, 7%);                 /* #111214 */
--border: hsl(240, 3.7%, 15.9%);        /* #28282B */
--text-primary: hsl(210, 14%, 83%);     /* #D1D5DB */
--text-secondary: hsl(240, 5%, 64.9%);  /* #9CA3AF */
```

### Typography Reference

```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;   /* 24px */

/* Line Heights */
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.6;
```

### Spacing Reference

```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

---

## Contributing

When contributing to the dashboard design:

1. **Follow the Design System**: Use established colors, typography, and spacing
2. **Maintain Consistency**: Ensure new components match existing patterns
3. **Test Responsively**: Verify designs work across all breakpoints
4. **Accessibility First**: Ensure WCAG compliance
5. **Document Changes**: Update this README when adding new patterns

---

## License

This design system is part of the RoleWithAI project. All design assets and documentation are proprietary.

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintained By**: RoleWithAI Development Team

