import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { UserInteraction } from '@/types/analytics'

const USER_INTERACTIONS_FILE = path.join(process.cwd(), 'src/data/user-interactions.json')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const limit = parseInt(searchParams.get('limit') || '100')

    if (!fs.existsSync(USER_INTERACTIONS_FILE)) {
      fs.writeFileSync(USER_INTERACTIONS_FILE, JSON.stringify({ 
        interactions: [], 
        lastUpdated: new Date().toISOString() 
      }, null, 2))
    }

    const data = JSON.parse(fs.readFileSync(USER_INTERACTIONS_FILE, 'utf8'))
    let interactions = data.interactions || []

    // Filter by page if specified
    if (page) {
      interactions = interactions.filter((interaction: UserInteraction) => 
        interaction.page === page
      )
    }

    // Sort by timestamp (newest first) and limit
    interactions = interactions
      .sort((a: UserInteraction, b: UserInteraction) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit)

    return NextResponse.json({ interactions })
  } catch (error) {
    console.error('Error fetching user interactions:', error)
    return NextResponse.json({ error: 'Failed to fetch interactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Allow in development and on production site
    const isAllowed = process.env.NODE_ENV === 'development' || 
                     request.headers.get('host')?.includes('localhost') ||
                     request.headers.get('host')?.includes('luciverseai.vercel.app')
    
    if (!isAllowed) {
      return NextResponse.json({ error: 'Analytics not available for this domain' }, { status: 403 })
    }

    const interaction: UserInteraction = await request.json()

    // Add IST timestamp
    const now = new Date()
    const istTimestamp = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)).toISOString()
    interaction.timestamp = istTimestamp

    if (!fs.existsSync(USER_INTERACTIONS_FILE)) {
      fs.writeFileSync(USER_INTERACTIONS_FILE, JSON.stringify({ 
        interactions: [], 
        lastUpdated: istTimestamp 
      }, null, 2))
    }

    const data = JSON.parse(fs.readFileSync(USER_INTERACTIONS_FILE, 'utf8'))
    data.interactions = data.interactions || []
    data.interactions.push(interaction)
    data.lastUpdated = istTimestamp

    // Keep only last 5000 records to prevent file from getting too large
    if (data.interactions.length > 5000) {
      data.interactions = data.interactions.slice(-5000)
    }

    fs.writeFileSync(USER_INTERACTIONS_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging interaction:', error)
    return NextResponse.json({ error: 'Failed to log interaction' }, { status: 500 })
  }
}
