import { dummyTextTabs } from '@/app/[slug]/text/dummy'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing text data (optional)
  await prisma.text.deleteMany({})

  // Seed the text data
  for (let i = 0; i < dummyTextTabs.length; i++) {
    const tab = dummyTextTabs[i]

    await prisma.text.create({
      data: {
        content: JSON.stringify(tab.content), // Convert Slate content to JSON string
        userId: 44,
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
