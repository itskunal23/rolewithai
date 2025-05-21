# Component Library

## Overview

RoleWithAI's component library is built on top of shadcn/ui and Radix UI primitives, providing a consistent, accessible, and customizable set of components for building the platform's user interface.

## Design System

### Colors

```typescript
const colors = {
  background: '#121212',
  surface: '#1C1C1E',
  border: '#2C2C2E',
  primary: '#0077B5',
  success: '#16B364',
  warning: '#F59E0B',
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA'
  }
}
```

### Typography

```typescript
const typography = {
  fontFamily: {
    sans: 'Inter',
    serif: 'Georgia'
  },
  fontSize: {
    h1: 'text-3xl',
    h2: 'text-2xl',
    h3: 'text-lg',
    body: 'text-base',
    small: 'text-sm'
  }
}
```

## Core Components

### 1. CustomizableWidget

A draggable, resizable widget component for the dashboard.

```typescript
interface CustomizableWidgetProps {
  title: string
  children: React.ReactNode
  onMinimize?: () => void
  onRemove?: () => void
  onRefresh?: () => void
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
}
```

#### Usage
```tsx
<CustomizableWidget
  title="Weekly Progress"
  onMinimize={() => console.log('Minimized')}
  onRemove={() => console.log('Removed')}
  onRefresh={() => console.log('Refreshed')}
>
  <WeeklyProgress />
</CustomizableWidget>
```

### 2. AIMentorChat

AI-powered chat interface for career guidance.

```typescript
interface AIMentorChatProps {
  initialMessage?: string
  onSendMessage: (message: string) => Promise<void>
  onTyping?: () => void
  placeholder?: string
  disabled?: boolean
}
```

#### Usage
```tsx
<AIMentorChat
  initialMessage="How can I help you today?"
  onSendMessage={async (message) => {
    // Handle message
  }}
  onTyping={() => console.log('User is typing')}
  placeholder="Ask about your career..."
/>
```

### 3. SkillProgressCard

Displays skill progress with visual indicators.

```typescript
interface SkillProgressCardProps {
  skill: {
    name: string
    level: number
    progress: number
    category: string
  }
  onLevelUp?: () => void
  showDetails?: boolean
}
```

#### Usage
```tsx
<SkillProgressCard
  skill={{
    name: "Machine Learning",
    level: 3,
    progress: 75,
    category: "Technical"
  }}
  onLevelUp={() => console.log('Level up!')}
  showDetails={true}
/>
```

### 4. WeeklyChallenge

Displays and manages weekly learning challenges.

```typescript
interface WeeklyChallengeProps {
  challenge: {
    title: string
    description: string
    tasks: Array<{
      id: string
      title: string
      completed: boolean
    }>
    deadline: Date
    reward: number
  }
  onTaskComplete: (taskId: string) => void
  onChallengeComplete: () => void
}
```

#### Usage
```tsx
<WeeklyChallenge
  challenge={{
    title: "Data Science Fundamentals",
    description: "Master the basics of data science",
    tasks: [
      { id: "1", title: "Complete Python basics", completed: false }
    ],
    deadline: new Date(),
    reward: 100
  }}
  onTaskComplete={(taskId) => console.log(`Task ${taskId} completed`)}
  onChallengeComplete={() => console.log('Challenge completed!')}
/>
```

### 5. ContextualTip

Provides contextual help and guidance.

```typescript
interface ContextualTipProps {
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  showArrow?: boolean
  onDismiss?: () => void
}
```

#### Usage
```tsx
<ContextualTip
  title="Skill Assessment"
  content="Complete this assessment to get personalized learning recommendations"
  position="top"
  showArrow={true}
  onDismiss={() => console.log('Tip dismissed')}
/>
```

### 6. AnimatedXPBar

Animated progress bar for XP tracking.

```typescript
interface AnimatedXPBarProps {
  currentXP: number
  nextLevelXP: number
  level: number
  onLevelUp?: () => void
  showLevel?: boolean
}
```

#### Usage
```tsx
<AnimatedXPBar
  currentXP={750}
  nextLevelXP={1000}
  level={5}
  onLevelUp={() => console.log('Level up!')}
  showLevel={true}
/>
```

## Layout Components

### 1. DashboardLayout

Main layout component for dashboard pages.

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
}
```

#### Usage
```tsx
<DashboardLayout
  sidebar={<DashboardSidebar />}
  header={<DashboardHeader />}
  footer={<DashboardFooter />}
>
  <DashboardContent />
</DashboardLayout>
```

### 2. Card

Base card component for content containers.

```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  padding?: 'none' | 'small' | 'medium' | 'large'
}
```

#### Usage
```tsx
<Card
  variant="outline"
  padding="medium"
  className="bg-black/40"
>
  <CardHeader>
    <CardTitle>Skill Progress</CardTitle>
  </CardHeader>
  <CardContent>
    <SkillProgressCard />
  </CardContent>
</Card>
```

## Form Components

### 1. Input

Text input component with various states.

```typescript
interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  error?: string
  disabled?: boolean
}
```

#### Usage
```tsx
<Input
  value={value}
  onChange={setValue}
  placeholder="Enter your name"
  type="text"
  error={error}
/>
```

### 2. Button

Button component with various styles and states.

```typescript
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
}
```

#### Usage
```tsx
<Button
  variant="primary"
  size="medium"
  onClick={() => console.log('Clicked')}
  loading={isLoading}
>
  Save Progress
</Button>
```

## Utility Components

### 1. LoadingSpinner

Loading indicator component.

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  className?: string
}
```

#### Usage
```tsx
<LoadingSpinner
  size="medium"
  color="#0077B5"
  className="mt-4"
/>
```

### 2. ErrorBoundary

Error boundary component for graceful error handling.

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error) => void
}
```

#### Usage
```tsx
<ErrorBoundary
  fallback={<ErrorDisplay />}
  onError={(error) => console.error(error)}
>
  <Component />
</ErrorBoundary>
```

## Best Practices

### 1. Component Organization

- Group related components
- Use consistent naming
- Maintain clear hierarchy
- Document props and usage

### 2. Performance

- Use React.memo for pure components
- Implement proper loading states
- Optimize re-renders
- Lazy load when possible

### 3. Accessibility

- Use semantic HTML
- Implement ARIA labels
- Ensure keyboard navigation
- Maintain color contrast

### 4. Testing

- Write unit tests
- Test edge cases
- Verify accessibility
- Check performance

## Contributing

### 1. Adding New Components

1. Create component file
2. Add TypeScript interfaces
3. Implement component
4. Add tests
5. Update documentation

### 2. Modifying Existing Components

1. Review current implementation
2. Make changes
3. Update tests
4. Update documentation
5. Verify accessibility

### 3. Component Review Process

1. Code review
2. Accessibility check
3. Performance testing
4. Documentation review
5. Final approval 