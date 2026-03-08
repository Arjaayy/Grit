import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting simple database seeding...')

  // Create sport categories
  console.log('Creating sport categories...')
  await prisma.sportCategory.createMany({
    data: [
      { name: 'football', displayName: 'Football', sortOrder: 1 },
      { name: 'basketball', displayName: 'Basketball', sortOrder: 2 },
      { name: 'soccer', displayName: 'Soccer', sortOrder: 3 },
      { name: 'baseball', displayName: 'Baseball', sortOrder: 4 },
      { name: 'hockey', displayName: 'Hockey', sortOrder: 5 },
      { name: 'volleyball', displayName: 'Volleyball', sortOrder: 6 },
    ],
    skipDuplicates: true
  })

  // Create project types
  console.log('Creating project types...')
  await prisma.projectType.createMany({
    data: [
      { name: 'website-redesign', displayName: 'Website Redesign', sortOrder: 1 },
      { name: 'new-website', displayName: 'New Website', sortOrder: 2 },
      { name: 'event-platform', displayName: 'Event Platform', sortOrder: 3 },
      { name: 'registration-system', displayName: 'Registration System', sortOrder: 4 },
    ],
    skipDuplicates: true
  })

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
