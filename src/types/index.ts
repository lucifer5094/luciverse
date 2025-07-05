// Core API Response Types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Site Content Types
export interface SiteContent {
  heroTitle: string
  heroSubtitle: string
  aboutTitle: string
  aboutSubtitle: string
  aboutContent: string
  contactInfo: ContactInfo
  projectsTitle: string
  projectsSubtitle: string
  projectsDescription: string
  labTitle: string
  labSubtitle: string
  labDescription: string
  contactTitle: string
  contactSubtitle: string
  logsTitle: string
  logsSubtitle: string
  logsDescription: string
  adminTitle: string
  adminSubtitle: string
  adminDescription: string
  highlights?: Highlight[]
  stats?: Stats
  lastUpdated: string
}

export interface ContactInfo {
  email: string
  github?: string
  linkedin?: string
  twitter?: string
  location?: string
}

export interface Highlight {
  id: string
  title: string
  description: string
  icon?: string
  color?: string
  link?: string
}

export interface Stats {
  projects: number
  years: number
  technologies: number
  achievements: number
}

// Component Props Types
export interface LoadingStateProps {
  type: 'spinner' | 'skeleton' | 'text'
  message?: string
  className?: string
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export interface NavLink {
  name: string
  href: string
  icon?: React.ComponentType
  badge?: string | number
}

// Animation Types
export interface AnimationVariant {
  hidden: any
  visible: any
  hover?: any
  tap?: any
}

// Theme Types
export interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  systemPreference: boolean
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

// Event Types
export interface CustomEventMap {
  'theme-changed': CustomEvent<{ isDark: boolean }>
  'data-updated': CustomEvent<{ type: string; data: any }>
  'error-occurred': CustomEvent<{ error: Error; context: string }>
}

// Environment Types
export interface Config {
  api: {
    baseUrl: string
    timeout: number
  }
  features: {
    ownerMode: boolean
    analytics: boolean
    debugging: boolean
  }
  limits: {
    maxFileSize: number
    maxDocuments: number
    cacheTimeout: number
  }
}
