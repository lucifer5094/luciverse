import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'vault-documents'
    
    const filePath = path.join(process.cwd(), 'src', 'data', `${type}.json`)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 })
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading data:', error)
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only allow updates in development or localhost
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         request.headers.get('host')?.includes('localhost')
    
    if (!isDevelopment) {
      return NextResponse.json({ error: 'Editing only allowed in development' }, { status: 403 })
    }
    
    // Check authentication
    const sessionCookie = request.cookies.get('admin-session')
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    // Simple session validation
    try {
      const decoded = Buffer.from(sessionCookie.value, 'base64').toString()
      const [user, timestamp] = decoded.split(':')
      
      if (user !== 'admin') {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
      }
      
      // Check if session is expired (24 hours)
      const sessionTime = parseInt(timestamp)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000
      
      if (now - sessionTime > twentyFourHours) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 })
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    
    const body = await request.json()
    const { type, data } = body
    
    if (!type || !data) {
      return NextResponse.json({ error: 'Type and data required' }, { status: 400 })
    }
    
    const filePath = path.join(process.cwd(), 'src', 'data', `${type}.json`)
    
    // Add lastUpdated timestamp
    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString()
    }
    
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2))
    
    return NextResponse.json({ success: true, message: 'Data updated successfully' })
  } catch (error) {
    console.error('Error updating data:', error)
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 })
  }
}
