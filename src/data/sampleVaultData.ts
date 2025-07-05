import { Document } from '@/utils/vaultUtils'

export const sampleDocuments: Document[] = [
  {
    id: '1',
    title: 'React Performance Optimization Guide',
    type: 'note',
    content: `# React Performance Optimization Guide

## Key Strategies

### 1. Memoization
- Use React.memo for functional components
- Use useMemo for expensive calculations
- Use useCallback for function references

### 2. Code Splitting
- Implement React.lazy for component-level splitting
- Use dynamic imports for route-based splitting
- Consider bundle analysis tools

### 3. Virtual DOM Optimization
- Minimize unnecessary re-renders
- Use keys properly in lists
- Avoid inline object creation in render

### 4. State Management
- Keep state as local as possible
- Use context wisely
- Consider external state management for complex apps

## Performance Monitoring
- React DevTools Profiler
- Chrome DevTools Performance tab
- Web Vitals metrics`,
    tags: ['react', 'performance', 'optimization', 'frontend'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    isPrivate: false,
    description: 'Comprehensive guide on optimizing React application performance',
    author: 'Lucifer'
  },
  {
    id: '2',
    title: 'AI Prompt Engineering Masterclass',
    type: 'prompt-dump',
    content: `# AI Prompt Engineering Collection

## Code Generation Prompts

### 1. React Component Generator
"Create a React functional component that [description]. Include proper TypeScript types, error handling, and accessibility features. Add comments explaining the logic."

### 2. API Integration
"Generate a custom hook for fetching data from [API endpoint]. Include loading states, error handling, caching, and proper TypeScript interfaces."

### 3. Database Schema Design
"Design a database schema for [domain]. Include relationships, indexes, constraints, and sample queries. Explain the design decisions."

## Writing & Content Prompts

### 1. Technical Documentation
"Write comprehensive documentation for [feature/API]. Include overview, setup instructions, examples, and troubleshooting guide."

### 2. Blog Post Structure
"Create an engaging blog post about [topic]. Include hooks, subheadings, practical examples, and actionable takeaways."

## Analysis Prompts

### 1. Code Review
"Review this code for performance, security, maintainability, and best practices. Provide specific suggestions with examples."

### 2. Architecture Assessment
"Analyze this system architecture and suggest improvements for scalability, reliability, and maintainability."`,
    tags: ['ai', 'prompts', 'engineering', 'productivity'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
    isPrivate: false,
    description: 'Collection of proven AI prompts for development and content creation',
    author: 'Lucifer'
  },
  {
    id: '3',
    title: 'System Design Patterns Handbook',
    type: 'pdf',
    content: '',
    tags: ['system-design', 'patterns', 'architecture', 'scalability'],
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
    isPrivate: true,
    fileUrl: '/vault/documents/system-design-patterns.pdf',
    description: 'Comprehensive handbook covering scalable system design patterns',
    fileSize: 2048576, // 2MB
    author: 'Lucifer'
  },
  {
    id: '4',
    title: 'Daily Development Scratchpad',
    type: 'scratchpad',
    content: `# Daily Development Notes

## 2024-02-20
- Fixed bug in authentication middleware
- Implemented new caching strategy
- TODO: Optimize database queries in user service

## 2024-02-19
- Refactored API endpoints for better error handling
- Added integration tests for payment flow
- Meeting notes: Discussed new feature requirements

## Quick Commands
\`\`\`bash
# Docker cleanup
docker system prune -a

# Git branch cleanup
git branch --merged | grep -v master | xargs git branch -d

# NPM cache clear
npm cache clean --force
\`\`\`

## Code Snippets
\`\`\`typescript
// Custom hook for local storage
const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Implementation here...
}
\`\`\``,
    tags: ['daily', 'notes', 'development', 'snippets'],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20'),
    isPrivate: false,
    description: 'Ongoing scratchpad for daily development thoughts and snippets',
    author: 'Lucifer'
  },
  {
    id: '5',
    title: 'Awesome Development Resources',
    type: 'link',
    content: 'https://github.com/sindresorhus/awesome',
    tags: ['resources', 'tools', 'development', 'learning'],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    isPrivate: false,
    description: 'Curated list of awesome development tools and resources',
    author: 'Lucifer'
  },
  {
    id: '6',
    title: 'TypeScript Advanced Patterns',
    type: 'note',
    content: `# TypeScript Advanced Patterns

## Utility Types
- Partial<T>
- Required<T>
- Readonly<T>
- Pick<T, K>
- Omit<T, K>
- Record<K, T>

## Conditional Types
\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false
type NonNullable<T> = T extends null | undefined ? never : T
\`\`\`

## Mapped Types
\`\`\`typescript
type Optional<T> = {
  [P in keyof T]?: T[P]
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null
}
\`\`\``,
    tags: ['typescript', 'patterns', 'advanced', 'types'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    isPrivate: false,
    description: 'Advanced TypeScript patterns and techniques',
    author: 'Lucifer'
  },
  {
    id: '7',
    title: 'Project Ideas Brainstorm',
    type: 'scratchpad',
    content: `# Project Ideas

## Web Applications
1. **Personal Finance Tracker**
   - Features: Budget planning, expense tracking, investment portfolio
   - Tech: Next.js, Prisma, PostgreSQL

2. **Developer Portfolio Generator**
   - Features: Template-based, GitHub integration, analytics
   - Tech: React, Node.js, MongoDB

3. **Team Collaboration Tool**
   - Features: Real-time chat, task management, file sharing
   - Tech: Socket.io, Express, Redis

## Mobile Apps
1. **Habit Tracker**
   - Features: Daily habits, streaks, analytics
   - Tech: React Native, Firebase

2. **Local Event Discovery**
   - Features: Location-based events, social features
   - Tech: Flutter, Google Maps API

## Dev Tools
1. **API Documentation Generator**
   - Features: Auto-generate from code comments
   - Tech: TypeScript, CLI tool

2. **Code Snippet Manager**
   - Features: Searchable, categorized, shareable
   - Tech: Electron, SQLite`,
    tags: ['ideas', 'projects', 'brainstorming', 'development'],
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-18'),
    isPrivate: false,
    description: 'Collection of project ideas and concepts to explore',
    author: 'Lucifer'
  },
  {
    id: '8',
    title: 'Machine Learning Cheatsheet',
    type: 'pdf',
    content: '',
    tags: ['machine-learning', 'ai', 'algorithms', 'cheatsheet'],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    isPrivate: false,
    fileUrl: '/vault/documents/ml-cheatsheet.pdf',
    description: 'Quick reference for common ML algorithms and techniques',
    fileSize: 1536000, // 1.5MB
    author: 'Lucifer'
  }
]
