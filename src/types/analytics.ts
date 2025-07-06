// Analytics Types for Edit History and User Interaction Tracking

export interface EditRecord {
  id: string
  timestamp: string
  page: string
  section: string
  fieldName: string
  oldValue: string
  newValue: string
  userAgent?: string
  ipAddress?: string
}

export interface UserInteraction {
  id: string
  timestamp: string
  sessionId: string
  page: string
  element: string
  action: 'click' | 'scroll' | 'hover' | 'form_submit' | 'page_view' | 'focus' | 'blur'
  position?: { x: number, y: number }
  metadata?: any
  userAgent?: string
  ipAddress?: string
}

export interface AnalyticsData {
  editHistory: EditRecord[]
  userInteractions: UserInteraction[]
  lastUpdated: string
}

export interface AnalyticsStats {
  totalEdits: number
  totalInteractions: number
  todayInteractions: number
  uniquePages: number
  clickActions: number
  topPages: Array<{ page: string, count: number }>
  editsByPage: Array<{ page: string, count: number }>
  hourlyActivity: Array<{ hour: number, count: number }>
}

export interface AnalyticsSummary {
  date: string
  pageViews: number
  clicks: number
  edits: number
  uniqueVisitors: number
  topPages: string[]
  avgSessionTime: number
}
