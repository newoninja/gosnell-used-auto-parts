import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'

const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000 // 5 days

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 })
    }

    // Verify the ID token and create a session cookie
    const decodedToken = await adminAuth.verifyIdToken(idToken)

    // Only allow verified email accounts
    if (!decodedToken.email) {
      return NextResponse.json({ error: 'No email associated with account' }, { status: 403 })
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY,
    })

    const response = NextResponse.json({ status: 'success' })
    response.cookies.set('__session', sessionCookie, {
      maxAge: SESSION_EXPIRY / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
