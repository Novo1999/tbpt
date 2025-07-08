import { dummyTextTabs } from '@/app/[slug]/text/dummy'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing text data (optional)
  // await prisma.text.deleteMany({})

  await prisma.user.create({
    data: {
      // texts: [],
      password: await bcrypt.hash('novo', 10),
      slug: 'novo',
      id: 1,
    },
  })

  // Seed the text data
  for (let i = 0; i < dummyTextTabs.length; i++) {
    const tab = dummyTextTabs[i]

    await prisma.text.create({
      data: {
        content: tab.content, // Convert Slate content to JSON string
        userId: 1,
        order: i + 1, // Use array index + 1 for ordering
      },
    })
  }

  console.log('Seeded text data successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
