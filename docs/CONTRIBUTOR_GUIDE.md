# Contributor Guide

## Getting Started

### Prerequisites

- Node.js 20.x or later
- PNPM 8.x or later
- Git
- Docker (optional, for local development)

### Development Environment Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/yourusername/rolewithai.git
   cd rolewithai
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Code Style

We use ESLint and Prettier for code formatting. The configuration is in `eslint.config.mjs` and `.prettierrc`.

To format your code:
```bash
pnpm format
```

To check for linting issues:
```bash
pnpm lint
```

### Testing

We use Jest and React Testing Library for testing. Run tests with:
```bash
pnpm test
```

For test coverage:
```bash
pnpm test:coverage
```

## Development Workflow

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `release/*`: Release preparation

### Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Write/update tests
4. Update documentation
5. Run linting and tests
6. Create a pull request to `develop`
7. Address review comments
8. Merge after approval

## Project Structure

```
rolewithai/
├── src/                      # Source code
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── styles/             # Global styles
│   └── types/              # TypeScript types
├── public/                 # Static assets
├── tests/                  # Test files
└── docs/                   # Documentation
```

## Component Development

### Component Structure

```tsx
import { FC } from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps {
  // Props interface
}

export const Component: FC<ComponentProps> = ({ prop1, prop2 }) => {
  return (
    <div className={cn('base-styles', prop1 && 'conditional-styles')}>
      {/* Component content */}
    </div>
  )
}
```

### Testing Components

```tsx
import { render, screen } from '@testing-library/react'
import { Component } from './Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component prop1="value" />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

## Documentation

### Writing Documentation

- Use Markdown for all documentation
- Include code examples
- Keep it concise and clear
- Update when making changes

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error cases
- Keep OpenAPI spec updated

## Release Process

1. Create release branch from `develop`
2. Update version numbers
3. Update CHANGELOG.md
4. Run full test suite
5. Create pull request to `main`
6. After merge, create GitHub release
7. Deploy to production

## Getting Help

- Check the [documentation](docs/)
- Join our [Discord community](https://discord.gg/rolewithai)
- Open an issue for bugs
- Use GitHub Discussions for questions 