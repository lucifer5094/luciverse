import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Get admin password from environment variable
const getAdminPassword = () => {
  return process.env.OWNER_SECRET || 'password' // fallback to 'password' if not set
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }
    
    // Check if running in development
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         request.headers.get('host')?.includes('localhost')
    
    if (!isDevelopment) {
      return NextResponse.json({ error: 'Admin access only available in development' }, { status: 403 })
    }
    
    // Get the admin password from environment
    const adminPassword = getAdminPassword()
    console.log('Environment OWNER_SECRET loaded:', adminPassword ? 'Yes' : 'No')
    
    // Simple password comparison (in production, you might want to hash the env password too)
    const isValid = password === adminPassword
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    
    // Create simple session token
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64')
    
    const response = NextResponse.json({ success: true, message: 'Authentication successful' })
    
    // Set httpOnly cookie for session
    response.cookies.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    
    return response
    
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin-session')
    
    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    
    // Simple session validation (in production, use proper JWT validation)
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString()
    const [user, timestamp] = decoded.split(':')
    
    if (user !== 'admin') {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    
    // Check if session is expired (24 hours)
    const sessionTime = parseInt(timestamp)
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    
    if (now - sessionTime > twentyFourHours) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    
    return NextResponse.json({ authenticated: true })
    
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
    
    // Clear the httpOnly session cookie
    response.cookies.set('admin-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      expires: new Date(0) // Set to past date
    })
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
