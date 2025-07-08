import { RawText } from '@/app/types/text'
import { User } from '@/app/types/user'
import { ExtendedPayload, secret } from '@/lib/auth-util'
import { PrismaClient } from '@prisma/client'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const token = request.cookies.get('session')?.value
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { payload } = await jwtVerify<ExtendedPayload>(token, secret, {
    algorithms: ['HS256'],
  })

  if (slug !== payload?.userData?.slug) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: {
      slug,
    },
    include: { texts: true },
  })
  const { password, ...userObj } = user ?? {}

  return NextResponse.json(userObj)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const token = request.cookies.get('session')?.value
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { payload } = await jwtVerify<ExtendedPayload>(token, secret, {
    algorithms: ['HS256'],
  })

  if (slug !== payload?.userData?.slug) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const body: RawText = await request.json()
  console.log(body)

  const text = await prisma.text.create({
    data: { ...body, userId: body.userId || 0 },
  })

  return NextResponse.json({
    status: text ? true : false,
    data: text,
  })
}

// export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params

//   await checkAuth(request, slug)
//   const body: RawText = await request.json()

//   const text = await prisma.text.updateMany()
// }
