import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get availability for a person
router.get('/person/:personId', async (req, res) => {
  try {
    const { personId } = req.params;
    
    const availability = await prisma.$queryRaw`
      SELECT 
        pa.person_id,
        pa.day_type_id,
        pa.timezone_id,
        pa.is_available,
        dt.name as day_name,
        dt.display_name as day_display_name,
        t.name as timezone_name,
        t.display_name as timezone_display_name
      FROM people_availability pa
      JOIN day_types dt ON pa.day_type_id = dt.id
      JOIN timezones t ON pa.timezone_id = t.id
      WHERE pa.person_id = ${personId}::uuid
      ORDER BY dt.display_name, t.display_order
    `;
    
    res.json({ success: true, data: availability });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch availability' 
    });
  }
});

// Get optimized availability grid for entire app
router.get('/grid', async (req, res) => {
  try {
    console.log('Fetching optimized availability grid...');
    
    // Fetch all data in parallel
    const [people, dayTypes, timezones, availabilityRecords] = await Promise.all([
      prisma.people.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
      }),
      prisma.day_types.findMany({
        select: { id: true, name: true, display_name: true },
        orderBy: { display_name: 'asc' }
      }),
      prisma.timezone.findMany({
        select: { id: true, name: true, display_order: true },
        orderBy: { display_order: 'asc' }
      }),
      prisma.people_availability.findMany({
        select: { person_id: true, day_type_id: true, timezone_id: true, is_available: true }
      })
    ]);

    // Create lookup maps for indices
    const personIndexMap = new Map(people.map((p: any, i: number) => [p.id, i]));
    const dayTypeIndexMap = new Map(dayTypes.map((d: any, i: number) => [d.id, i]));
    const timezoneIndexMap = new Map(timezones.map((t: any, i: number) => [t.id, i]));

    // Initialize 3D grid with false
    const grid: boolean[][][] = people.map(() =>
      dayTypes.map(() =>
        timezones.map(() => false)
      )
    );

    // Populate grid from availability records
    availabilityRecords.forEach((record: any) => {
      const personIndex = personIndexMap.get(record.person_id) as number | undefined;
      const dayIndex = dayTypeIndexMap.get(record.day_type_id) as number | undefined;
      const timezoneIndex = timezoneIndexMap.get(record.timezone_id) as number | undefined;

      if (typeof personIndex === 'number' && typeof dayIndex === 'number' && typeof timezoneIndex === 'number' && 
          personIndex < grid.length && dayIndex < grid[personIndex].length && 
          timezoneIndex < grid[personIndex][dayIndex].length) {
        grid[personIndex][dayIndex][timezoneIndex] = record.is_available;
      }
    });

    const result = {
      people,
      dayTypes,
      timezones,
      grid
    };

    console.log(`Availability grid loaded: ${people.length} people, ${dayTypes.length} day types, ${timezones.length} timezones`);
    console.log(`Grid size: ${grid.length}x${grid[0]?.length || 0}x${grid[0]?.[0]?.length || 0}`);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching availability grid:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch availability grid' 
    });
  }
});

// Get compact availability data - only unavailable slots
router.get('/compact', async (req, res) => {
  try {
    // Get all necessary data in parallel
    const [people, dayTypes, timezones, unavailableSlots] = await Promise.all([
      prisma.people.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
      }),
      prisma.day_types.findMany({
        select: { id: true, name: true, display_name: true },
        orderBy: { display_name: 'asc' }
      }),
      prisma.timezone.findMany({
        select: { id: true, name: true, display_order: true },
        orderBy: { display_order: 'asc' }
      }),
      // Only get records where is_available = false
      prisma.people_availability.findMany({
        where: { is_available: false },
        select: {
          person_id: true,
          day_type_id: true,
          timezone_id: true
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        people,
        day_types: dayTypes,
        timezones,
        unavailable_slots: unavailableSlots
      }
    });
  } catch (error) {
    console.error('Error fetching compact availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch compact availability data' 
    });
  }
});

// Get availability matrix for all people
router.get('/matrix', async (req, res) => {
  try {
    const availability = await prisma.$queryRaw`
      SELECT 
        pa.person_id,
        pa.day_type_id,
        pa.timezone_id,
        pa.is_available,
        p.name as person_name,
        dt.name as day_name,
        dt.display_name as day_display_name,
        t.name as timezone_name,
        t.display_name as timezone_display_name,
        t.display_order as timezone_order
      FROM people_availability pa
      JOIN people p ON pa.person_id = p.id
      JOIN day_types dt ON pa.day_type_id = dt.id
      JOIN timezones t ON pa.timezone_id = t.id
      ORDER BY p.name, dt.display_name, t.display_order
    `;
    
    res.json({ success: true, data: availability });
  } catch (error) {
    console.error('Error fetching availability matrix:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch availability matrix' 
    });
  }
});

// Update availability
router.put('/', async (req, res) => {
  try {
    const { person_id, day_type_id, timezone_id, is_available } = req.body;
    
    if (!person_id || !day_type_id || !timezone_id || typeof is_available !== 'boolean') {
      return res.status(400).json({ 
        success: false, 
        error: 'person_id, day_type_id, timezone_id, and is_available are required' 
      });
    }

    // Use upsert to create or update availability
    const availability = await prisma.people_availability.upsert({
      where: {
        person_id_day_type_id_timezone_id: {
          person_id,
          day_type_id,
          timezone_id
        }
      },
      update: {
        is_available
      },
      create: {
        id: crypto.randomUUID(),
        person_id,
        day_type_id,
        timezone_id,
        is_available
      }
    });
    
    res.json({ success: true, data: availability });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update availability' 
    });
  }
});

// Update unavailable slots for a person (compact format)
router.put('/compact', async (req, res) => {
  try {
    const { person_id, unavailable_slots } = req.body;
    
    if (!person_id || !Array.isArray(unavailable_slots)) {
      return res.status(400).json({ 
        success: false, 
        error: 'person_id and unavailable_slots array are required' 
      });
    }

    // Delete all existing availability records for this person
    await prisma.people_availability.deleteMany({
      where: { person_id }
    });

    // Create records for unavailable slots only (available = false)
    if (unavailable_slots.length > 0) {
      const createData = unavailable_slots.map(({ day_type_id, timezone_id }) => ({
        id: crypto.randomUUID(),
        person_id,
        day_type_id,
        timezone_id,
        is_available: false // Only store unavailable slots
      }));

      await prisma.people_availability.createMany({
        data: createData
      });
    }

    res.json({ 
      success: true, 
      message: 'Availability updated successfully',
      updated_slots: unavailable_slots.length 
    });
  } catch (error) {
    console.error('Error updating compact availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update availability' 
    });
  }
});

// Bulk update availability for a person
router.put('/bulk', async (req, res) => {
  try {
    const { person_id, availabilities } = req.body;
    
    if (!person_id || !Array.isArray(availabilities)) {
      return res.status(400).json({ 
        success: false, 
        error: 'person_id and availabilities array are required' 
      });
    }

    // Delete existing availability for this person
    await prisma.people_availability.deleteMany({
      where: { person_id }
    });

    // Create new availability records
    const createData = availabilities.map(({ day_type_id, timezone_id, is_available }) => ({
      id: crypto.randomUUID(),
      person_id,
      day_type_id,
      timezone_id,
      is_available
    }));

    await prisma.people_availability.createMany({
      data: createData
    });

    res.json({ success: true, message: 'Availability updated successfully' });
  } catch (error) {
    console.error('Error bulk updating availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to bulk update availability' 
    });
  }
});

export default router;
