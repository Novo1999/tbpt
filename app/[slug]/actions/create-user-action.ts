'use server'

import prisma from '@/lib/prisma'

export const createUser = async (prevState: unknown, formData: FormData) => {
  try {
    const user = await prisma.user.create({
      data: {
        slug: formData.get('slug') as string,
        password: formData.get('password') as string,
      },
    })

    const { password, ...rest } = user

    return { message: 'Site Created', status: true, data: rest }
  } catch (error) {
    console.log("🚀 ~ createUser ~ error:", error)
    return { message: 'Failed to Create Site', status: false }
  }
}
