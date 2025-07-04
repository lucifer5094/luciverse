import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Get the owner secret from environment variables
    const ownerSecret = process.env.OWNER_SECRET;
    
    if (!ownerSecret) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Validate password
    if (password === ownerSecret) {
      return NextResponse.json(
        { success: true, message: 'Authentication successful' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}
