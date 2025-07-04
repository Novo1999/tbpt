import { User } from '@/app/types/user'
import * as jose from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
const { SignJWT, jwtVerify } = jose

const secretKey = process.env.AUTH_SECRET
const key = new TextEncoder().encode(secretKey)

const encrypt = async (payload: jose.JWTPayload) => {
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('1 minute from now').sign(key)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const decrypt = async (input: string): Promise<any> => {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload
}

const login = async (user: Partial<User>) => {
  const userData = { slug: user?.slug, id: user?.id }

  // Create the session
  const expires = new Date(Date.now() + 10 * 60 * 1000)
  const session = await encrypt({ userData, expires })

  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    expires,
    httpOnly: true,
  })
}

const logout = async () => {
  const cookieStore = await cookies()

  cookieStore.set('session', '', { expires: new Date(0) })
}

const getSession = async () => {
  const session = (await cookies()).get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

const updateSession = async (request: NextRequest) => {
  const session = request.cookies.get('session')?.value
  if (!session) return NextResponse.next()

  try {
    // Try to decrypt the session
    const parsed = await decrypt(session)

    // Create new session with fresh expiration
    const newExpires = new Date(Date.now() + 10 * 60 * 1000)
    const newSession = await encrypt({
      userData: parsed.userData,
      expires: newExpires,
    })

    const res = NextResponse.next()
    res.cookies.set({
      name: 'session',
      value: newSession,
      expires: newExpires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })

    return res
  } catch (error) {
    // Session is expired or invalid
    console.error('Session update failed:', error)
    const res = NextResponse.redirect(new URL('/', request.url))
    // Clear the invalid session
    res.cookies.set({
      name: 'session',
      value: '',
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })

    return res
  }
}

export { decrypt, encrypt, getSession, login, logout, updateSession }

