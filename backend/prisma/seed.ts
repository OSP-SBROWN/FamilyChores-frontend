import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create day types
  const dayTypes = [
    { name: 'monday', display_name: 'Monday' },
    { name: 'tuesday', display_name: 'Tuesday' },
    { name: 'wednesday', display_name: 'Wednesday' },
    { name: 'thursday', display_name: 'Thursday' },
    { name: 'friday', display_name: 'Friday' },
    { name: 'saturday', display_name: 'Saturday' },
    { name: 'sunday', display_name: 'Sunday' }
  ];

  console.log('📅 Creating day types...');
  for (const dayType of dayTypes) {
    // Check if day type already exists
    const existing = await prisma.day_types.findFirst({
      where: { name: dayType.name }
    });

    if (!existing) {
      await prisma.day_types.create({
        data: {
          id: crypto.randomUUID(),
          name: dayType.name,
          display_name: dayType.display_name
        }
      });
      console.log(`✅ Created: ${dayType.display_name}`);
    } else {
      console.log(`⏭️  Already exists: ${dayType.display_name}`);
    }
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
