import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const router = Router();
const prisma = new PrismaClient();

// GET /api/timezones - Get all timezones
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('GET /api/timezones - Fetching all timezones');
    
    const timezones = await prisma.timezone.findMany({
      orderBy: {
        display_order: 'asc'
      }
    });

    console.log(`Found ${timezones.length} timezones`);

    res.json({
      success: true,
      data: timezones,
      count: timezones.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching timezones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch timezones',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/timezones/:id - Get specific timezone
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/timezones/${id} - Fetching timezone`);

    const timezone = await prisma.timezone.findUnique({
      where: { id: id }
    });

    if (!timezone) {
      return res.status(404).json({
        success: false,
        error: 'Timezone not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: timezone,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error fetching timezone ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch timezone',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/timezones - Create new timezone
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    console.log('POST /api/timezones - Creating timezone:', { name, description });

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: name',
        timestamp: new Date().toISOString()
      });
    }

    // Get the next display order
    const maxDisplayOrder = await prisma.timezone.aggregate({
      _max: { display_order: true }
    });
    const nextDisplayOrder = (maxDisplayOrder._max.display_order || 0) + 1;

    const timezone = await prisma.timezone.create({
      data: {
        name,
        description: description || null,
        display_order: nextDisplayOrder
      }
    });

    console.log('Created timezone:', timezone);

    res.status(201).json({
      success: true,
      data: timezone,
      message: 'Timezone created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating timezone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create timezone',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// PUT /api/timezones/:id - Update timezone
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    console.log(`PUT /api/timezones/${id} - Updating timezone:`, { name, description });

    const timezone = await prisma.timezone.update({
      where: { id: id },
      data: {
        name,
        description: description || null
      }
    });

    console.log('Updated timezone:', timezone);

    res.json({
      success: true,
      data: timezone,
      message: 'Timezone updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error(`Error updating timezone ${req.params.id}:`, error);
    
    if (error?.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Timezone not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update timezone',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// DELETE /api/timezones/:id - Delete timezone
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`DELETE /api/timezones/${id} - Deleting timezone and related data`);

    // Start a transaction to ensure data consistency
    await prisma.$transaction(async (tx: any) => {
      // First, check if timezone exists
      const timezone = await tx.timezone.findUnique({
        where: { id: id }
      });

      if (!timezone) {
        throw new Error('TIMEZONE_NOT_FOUND');
      }

      // Delete related availability records
      const deletedAvailability = await tx.people_availability.deleteMany({
        where: { timezone_id: id }
      });
      console.log(`Deleted ${deletedAvailability.count} availability records for timezone ${id}`);

      // Delete related chore assignments
      const deletedAssignments = await tx.chore_assignments.deleteMany({
        where: { timezone_id: id }
      });
      console.log(`Deleted ${deletedAssignments.count} chore assignments for timezone ${id}`);

      // Delete related chore timezones
      const deletedChoreTimezones = await tx.chore_timezones.deleteMany({
        where: { timezone_id: id }
      });
      console.log(`Deleted ${deletedChoreTimezones.count} chore timezone relationships for timezone ${id}`);

      // Finally, delete the timezone
      await tx.timezone.delete({
        where: { id: id }
      });

      console.log(`Successfully deleted timezone ${id} and all related data`);
    });

    res.json({
      success: true,
      message: 'Timezone and all related data deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error(`Error deleting timezone ${req.params.id}:`, error);
    
    if (error.message === 'TIMEZONE_NOT_FOUND' || error?.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Timezone not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete timezone',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/timezones/reorder - Reorder timezones
router.post('/reorder', async (req: Request, res: Response) => {
  try {
    const { timezones } = req.body;
    console.log('POST /api/timezones/reorder - Reordering timezones');

    if (!Array.isArray(timezones)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: timezones must be an array',
        timestamp: new Date().toISOString()
      });
    }

    // Update display orders in a transaction
    await prisma.$transaction(
      timezones.map((timezone, index) =>
        prisma.timezone.update({
          where: { id: timezone.id },
          data: { display_order: index }
        })
      )
    );

    console.log('Reordered timezones successfully');

    res.json({
      success: true,
      message: 'Timezones reordered successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error reordering timezones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reorder timezones',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
