import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const user = await prisma.user.findUnique({
    where: {
      slug,
    },
    include: { texts: true },
  })
  const { password, ...userObj } = user
  return NextResponse.json(userObj)
}
