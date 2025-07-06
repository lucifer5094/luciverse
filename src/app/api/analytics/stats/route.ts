import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { EditRecord, UserInteraction, AnalyticsStats } from '@/types/analytics'

const EDIT_HISTORY_FILE = path.join(process.cwd(), 'src/data/edit-history.json')
const USER_INTERACTIONS_FILE = path.join(process.cwd(), 'src/data/user-interactions.json')

export async function GET(request: NextRequest) {
  try {
    // Read edit history
    let editHistory: EditRecord[] = []
    if (fs.existsSync(EDIT_HISTORY_FILE)) {
      const editData = JSON.parse(fs.readFileSync(EDIT_HISTORY_FILE, 'utf8'))
      editHistory = editData.editHistory || []
    }

    // Read user interactions
    let userInteractions: UserInteraction[] = []
    if (fs.existsSync(USER_INTERACTIONS_FILE)) {
      const interactionData = JSON.parse(fs.readFileSync(USER_INTERACTIONS_FILE, 'utf8'))
      userInteractions = interactionData.interactions || []
    }

    // Calculate stats
    const today = new Date().toDateString()
    const todayInteractions = userInteractions.filter(interaction => 
      new Date(interaction.timestamp).toDateString() === today
    )

    // Top pages by interactions
    const pageInteractionCounts = userInteractions.reduce((acc, interaction) => {
      acc[interaction.page] = (acc[interaction.page] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topPages = Object.entries(pageInteractionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }))

    // Edits by page
    const pageEditCounts = editHistory.reduce((acc, edit) => {
      acc[edit.page] = (acc[edit.page] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const editsByPage = Object.entries(pageEditCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }))

    // Hourly activity (last 24 hours)
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const recentInteractions = userInteractions.filter(interaction => 
      new Date(interaction.timestamp) >= twentyFourHoursAgo
    )

    const hourlyActivity = Array.from({ length: 24 }, (_, i) => {
      const hour = i
      const count = recentInteractions.filter(interaction => 
        new Date(interaction.timestamp).getHours() === hour
      ).length
      return { hour, count }
    })

    const stats: AnalyticsStats = {
      totalEdits: editHistory.length,
      totalInteractions: userInteractions.length,
      todayInteractions: todayInteractions.length,
      uniquePages: Object.keys(pageInteractionCounts).length,
      clickActions: userInteractions.filter(i => i.action === 'click').length,
      topPages,
      editsByPage,
      hourlyActivity
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching analytics stats:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics stats' }, { status: 500 })
  }
}
