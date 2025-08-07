import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/availability-compact/matrix - Ultra-compact availability matrix
router.get('/matrix', async (req, res) => {
  try {
    console.log('Fetching compact availability matrix...');

    // Get all people, days, and timezones in consistent order
    const [people, dayTypes, timezones] = await Promise.all([
      prisma.people.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.day_types.findMany({
        orderBy: { id: 'asc' }
      }),
      prisma.timezone.findMany({
        orderBy: { display_order: 'asc' }
      })
    ]);

    // Get only UNAVAILABLE availability records (much smaller dataset)
    const unavailableRecords = await prisma.people_availability.findMany({
      where: {
        is_available: false
      },
      select: {
        person_id: true,
        day_type_id: true,
        timezone_id: true
      }
    });

    // Create lookup maps for O(1) index conversion
    const personIndexMap = new Map(people.map((person: any, index: number) => [person.id, index]));
    const dayIndexMap = new Map(dayTypes.map((day: any, index: number) => [day.id, index]));
    const timezoneIndexMap = new Map(timezones.map((tz: any, index: number) => [tz.id, index]));

    // Convert unavailable records to integer indices
    const unavailableIndices = unavailableRecords
      .map((record: any) => {
        const personIndex = personIndexMap.get(record.person_id);
        const dayIndex = dayIndexMap.get(record.day_type_id);
        const timezoneIndex = timezoneIndexMap.get(record.timezone_id);
        
        // Only include if all indices are found
        if (personIndex !== undefined && dayIndex !== undefined && timezoneIndex !== undefined) {
          return [personIndex, dayIndex, timezoneIndex];
        }
        return null;
      })
      .filter(Boolean) as number[][];

    const response = {
      success: true,
      people: people.map((p: any) => p.name),
      days: dayTypes.map((d: any) => d.name),
      timezones: timezones.map((tz: any) => tz.name),
      unavailable: unavailableIndices
    };

    console.log(`Compact response size: ${JSON.stringify(response).length} bytes`);
    console.log(`People: ${people.length}, Days: ${dayTypes.length}, Timezones: ${timezones.length}`);
    console.log(`Unavailable combinations: ${unavailableIndices.length}`);

    res.json(response);
  } catch (error) {
    console.error('Error fetching compact availability matrix:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch compact availability matrix'
    });
  }
});

export default router;
