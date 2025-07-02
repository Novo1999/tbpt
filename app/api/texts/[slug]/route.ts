import { PrismaClient } from '@/app/generated/prisma'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const user = await prisma.user.findUnique({
    where: {
      slug,
    },
  })
  const { password, ...userObj } = user
  return NextResponse.json(userObj)
}
