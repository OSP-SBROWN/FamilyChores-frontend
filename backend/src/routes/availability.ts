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
