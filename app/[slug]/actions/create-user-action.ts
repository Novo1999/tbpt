'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const createUser = async (prevState: unknown, formData: FormData) => {
  try {
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(formData.get('password') as string, salt)
    const user = await prisma.user.create({
      data: {
        slug: formData.get('slug') as string,
        password: hashedPassword,
      },
    })

    const { password, ...rest } = user

    return { message: 'Site Created', status: true, data: rest }
  } catch (error) {
    console.log('🚀 ~ createUser ~ error:', error)
    return { message: 'Failed to Create Site', status: false }
  }
}
