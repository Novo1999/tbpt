import { RawText } from '@/app/types/text'
import { User } from '@/app/types/user'
import { checkAuth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await checkAuth(request, slug)
  const user: User = await prisma.user.findUnique({
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

  await checkAuth(request, slug)
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
