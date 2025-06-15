import { Prisma, PrismaClient } from '../app/generated/prisma'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    slug: 'Alice',
    password: 'jitum',
  },
  {
    slug: 'bob',
    password: 'jitum',
  },
  {
    slug: 'zurain',
    password: 'jitum',
  },
]

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u })
  }
}

main()
