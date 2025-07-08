import { ExtendedPayload, secret } from '@/lib/auth-util'
import prisma from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const token = request.cookies.get('session')?.value
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const { payload } = await jwtVerify<ExtendedPayload>(token, secret, {
    algorithms: ['HS256'],
  })

  if (slug !== payload?.userData?.slug) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { ids }: { ids: number[] } = await request.json()
  let text
  if (ids.length > 1) {
    text = await prisma.text.deleteMany({
      where: { id: { in: ids } },
    })
  } else {
    const textId = ids[0]
    text = await prisma.text.delete({
      where: { id: textId },
    })
  }

  return NextResponse.json({
    status: text ? true : false,
    data: text,
  })
}
