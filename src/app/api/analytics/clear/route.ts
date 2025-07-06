import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const EDIT_HISTORY_FILE = path.join(process.cwd(), 'src/data/edit-history.json')
const USER_INTERACTIONS_FILE = path.join(process.cwd(), 'src/data/user-interactions.json')

export async function DELETE(request: NextRequest) {
  try {
    // Only allow in development mode
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         request.headers.get('host')?.includes('localhost')
    
    if (!isDevelopment) {
      return NextResponse.json({ error: 'Clear analytics only available in development' }, { status: 403 })
    }

    const now = new Date()
    const istTimestamp = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)).toISOString()

    // Clear edit history
    const emptyEditHistory = {
      editHistory: [],
      lastUpdated: istTimestamp
    }
    
    // Clear user interactions
    const emptyInteractions = {
      interactions: [],
      lastUpdated: istTimestamp
    }

    fs.writeFileSync(EDIT_HISTORY_FILE, JSON.stringify(emptyEditHistory, null, 2))
    fs.writeFileSync(USER_INTERACTIONS_FILE, JSON.stringify(emptyInteractions, null, 2))

    return NextResponse.json({ 
      success: true, 
      message: 'Analytics data cleared successfully',
      timestamp: istTimestamp 
    })
  } catch (error) {
    console.error('Error clearing analytics data:', error)
    return NextResponse.json({ error: 'Failed to clear analytics data' }, { status: 500 })
  }
}
