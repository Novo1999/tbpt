import { User } from '@/app/types/user'
import { PrismaClient } from '@prisma/client'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
const secret = new TextEncoder().encode(process.env.AUTH_SECRET)
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const token = request.cookies.get('session')?.value
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { payload } = await jwtVerify(token, secret, {
    algorithms: ['HS256'], // Specify the algorithm
  })

  const { slug } = await params
  if (slug !== payload?.userData?.slug) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const user: User = await prisma.user.findUnique({
    where: {
      slug,
    },
    include: { texts: true },
  })
  const { password, ...userObj } = user ?? {}
  
  return NextResponse.json(userObj)
}
