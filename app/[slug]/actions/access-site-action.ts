'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const accessSite = async (prevState: unknown, formData: FormData) => {
  try {
    const user = await prisma.user.findUnique({
      where: { slug: formData.get('slug') as string },
    })
    console.log(user)

    const isPasswordCorrect = bcrypt.compareSync(formData.get('password') as string, user?.password || '')

    if (isPasswordCorrect) return { status: isPasswordCorrect }
    else return { status: isPasswordCorrect, message: 'Wrong Password' }
  } catch (error) {
    console.log("🚀 ~ accessSite ~ error:", error)
    return { message: 'Auth Error', status: false }
  }
}
