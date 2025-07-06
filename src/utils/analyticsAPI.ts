import { EditRecord, UserInteraction, AnalyticsStats } from '@/types/analytics'

class AnalyticsAPI {
  // Edit History Methods
  async logEdit(editData: Omit<EditRecord, 'id' | 'timestamp'>) {
    try {
      const editRecord: EditRecord = {
        id: `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...editData
      }

      const response = await fetch('/api/analytics/edit-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editRecord)
      })

      if (!response.ok) throw new Error('Failed to log edit')
      return await response.json()
    } catch (error) {
      console.error('Failed to log edit:', error)
    }
  }

  async getEditHistory(page?: string, limit?: number) {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page)
      if (limit) params.append('limit', limit.toString())

      const response = await fetch(`/api/analytics/edit-history?${params}`)
      if (!response.ok) throw new Error('Failed to fetch edit history')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch edit history:', error)
      return { editHistory: [] }
    }
  }

  // User Interaction Methods
  async logInteraction(interactionData: Omit<UserInteraction, 'id' | 'timestamp' | 'sessionId'>) {
    try {
      const sessionId = this.getOrCreateSessionId()
      const interaction: UserInteraction = {
        id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        sessionId,
        ...interactionData
      }

      // Send to API (non-blocking)
      fetch('/api/analytics/user-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interaction)
      }).catch(error => console.error('Failed to log interaction:', error))
    } catch (error) {
      console.error('Failed to log interaction:', error)
    }
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics-session-id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics-session-id', sessionId)
    }
    return sessionId
  }

  async getUserInteractions(page?: string, limit?: number) {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page)
      if (limit) params.append('limit', limit.toString())

      const response = await fetch(`/api/analytics/user-interactions?${params}`)
      if (!response.ok) throw new Error('Failed to fetch interactions')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch interactions:', error)
      return { interactions: [] }
    }
  }

  async getAnalyticsStats(): Promise<AnalyticsStats> {
    try {
      const response = await fetch('/api/analytics/stats')
      if (!response.ok) throw new Error('Failed to fetch analytics stats')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch analytics stats:', error)
      return {
        totalEdits: 0,
        totalInteractions: 0,
        todayInteractions: 0,
        uniquePages: 0,
        clickActions: 0,
        topPages: [],
        editsByPage: [],
        hourlyActivity: []
      }
    }
  }

  // Helper method to clear analytics data (for development)
  async clearAnalyticsData() {
    try {
      const response = await fetch('/api/analytics/clear', {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to clear analytics data')
      return await response.json()
    } catch (error) {
      console.error('Failed to clear analytics data:', error)
    }
  }
}

export const analyticsAPI = new AnalyticsAPI()
