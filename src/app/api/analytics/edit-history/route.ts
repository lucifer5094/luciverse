import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { EditRecord } from '@/types/analytics'

const EDIT_HISTORY_FILE = path.join(process.cwd(), 'src/data/edit-history.json')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!fs.existsSync(EDIT_HISTORY_FILE)) {
      fs.writeFileSync(EDIT_HISTORY_FILE, JSON.stringify({ 
        editHistory: [], 
        lastUpdated: new Date().toISOString() 
      }, null, 2))
    }

    const data = JSON.parse(fs.readFileSync(EDIT_HISTORY_FILE, 'utf8'))
    let history = data.editHistory || []

    // Filter by page if specified
    if (page) {
      history = history.filter((edit: EditRecord) => edit.page === page)
    }

    // Sort by timestamp (newest first) and limit
    history = history
      .sort((a: EditRecord, b: EditRecord) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit)

    return NextResponse.json({ editHistory: history })
  } catch (error) {
    console.error('Error fetching edit history:', error)
    return NextResponse.json({ error: 'Failed to fetch edit history' }, { status: 500 })
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

    const editRecord: EditRecord = await request.json()

    // Add IST timestamp
    const now = new Date()
    const istTimestamp = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)).toISOString()
    editRecord.timestamp = istTimestamp

    if (!fs.existsSync(EDIT_HISTORY_FILE)) {
      fs.writeFileSync(EDIT_HISTORY_FILE, JSON.stringify({ 
        editHistory: [], 
        lastUpdated: istTimestamp 
      }, null, 2))
    }

    const data = JSON.parse(fs.readFileSync(EDIT_HISTORY_FILE, 'utf8'))
    data.editHistory = data.editHistory || []
    data.editHistory.push(editRecord)
    data.lastUpdated = istTimestamp

    // Keep only last 1000 records to prevent file from getting too large
    if (data.editHistory.length > 1000) {
      data.editHistory = data.editHistory.slice(-1000)
    }

    fs.writeFileSync(EDIT_HISTORY_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true, record: editRecord })
  } catch (error) {
    console.error('Error logging edit:', error)
    return NextResponse.json({ error: 'Failed to log edit' }, { status: 500 })
  }
}
