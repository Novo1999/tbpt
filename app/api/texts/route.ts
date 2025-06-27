import { PrismaClient } from '@/app/generated/prisma'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(slug: string, userId: number) {
  const texts = await prisma.text.findMany({
    where: {
      userId,
    },
  })
  return NextResponse.json(texts)
}
