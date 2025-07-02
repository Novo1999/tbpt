import { dummyTextTabs } from '@/app/[slug]/text/dummy'
import htmlSerializer from '@/lib/slate-serialize-deserialize'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // First, create a user if you don't have one
  const user = await prisma.user.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      slug: 'demo',
      password: 'test',
      // add other required user fields
    },
  })

  // Clear existing text data (optional)
  await prisma.text.deleteMany({})

  // Seed the text data
  for (let i = 0; i < dummyTextTabs.length; i++) {
    const tab = dummyTextTabs[i]

    await prisma.text.create({
      data: {
        content: htmlSerializer.serialize(tab.text), // Convert Slate content to JSON string
        userId: user.id,
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
