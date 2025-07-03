import { User } from '@/app/types/user'
import * as jose from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
const { SignJWT, jwtVerify } = jose

const secretKey = process.env.AUTH_SECRET
const key = new TextEncoder().encode(secretKey)

const encrypt = async (payload: jose.JWTPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 minute from now')
    .sign(key)
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
  console.log('🚀 ~ updateSession ~ session:', session)
  if (!session) return

  const parsed = await decrypt(session)
  parsed.exp = new Date(Date.now() + 10 * 60 * 1000)

  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.exp,
  })

  return res
}

export { decrypt, encrypt, getSession, login, logout, updateSession }

