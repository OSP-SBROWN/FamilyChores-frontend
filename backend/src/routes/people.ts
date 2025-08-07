import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const router = Router();
const prisma = new PrismaClient();

// GET /api/people - Get all people
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('GET /api/people - Fetching all people');
    
    const people = await prisma.people.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`Found ${people.length} people`);

    res.json({
      success: true,
      data: people,
      count: people.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching people:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch people',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/people - Create new person
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('POST /api/people - Creating new person');
    console.log('Request body:', req.body);

    const { name, date_of_birth, color_code, workload_weighting, photo_url } = req.body;

    if (!name || !color_code) {
      return res.status(400).json({
        success: false,
        error: 'Name and color_code are required fields',
        timestamp: new Date().toISOString()
      });
    }

    const personData = {
      id: randomUUID(),
      name: name.trim(),
      date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
      color_code: color_code,
      workload_weighting: workload_weighting ? parseFloat(workload_weighting) : 1.0,
      photo_url: photo_url || null,
      created_at: new Date(),
      updated_at: new Date()
    };

    console.log('Creating person with data:', personData);

    const person = await prisma.people.create({
      data: personData
    });

    console.log('Person created successfully:', person.id);

    res.status(201).json({
      success: true,
      data: person,
      message: 'Person created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating person:', error);
    
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'A person with this information already exists',
          timestamp: new Date().toISOString()
        });
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create person',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// PUT /api/people/:id - Update person
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, date_of_birth, color_code, workload_weighting, photo_url } = req.body;

    console.log('PUT /api/people/:id - Updating person:', id);
    console.log('Request body:', req.body);

    // Check if person exists
    const existingPerson = await prisma.people.findUnique({
      where: { id }
    });

    if (!existingPerson) {
      return res.status(404).json({
        success: false,
        error: 'Person not found',
        timestamp: new Date().toISOString()
      });
    }

    const updateData: any = {
      updated_at: new Date()
    };

    if (name !== undefined) updateData.name = name.trim();
    if (date_of_birth !== undefined) {
      updateData.date_of_birth = date_of_birth ? new Date(date_of_birth) : null;
    }
    if (color_code !== undefined) updateData.color_code = color_code;
    if (workload_weighting !== undefined) {
      updateData.workload_weighting = parseFloat(workload_weighting);
    }
    if (photo_url !== undefined) updateData.photo_url = photo_url || null;

    console.log('Updating with data:', updateData);

    const person = await prisma.people.update({
      where: { id },
      data: updateData
    });

    console.log('Person updated successfully:', person.id);

    res.json({
      success: true,
      data: person,
      message: 'Person updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating person:', error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'A person with this information already exists',
          timestamp: new Date().toISOString()
        });
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update person',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// DELETE /api/people/:id - Delete person
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log('DELETE /api/people/:id - Deleting person:', id);

    // Check if person exists
    const existingPerson = await prisma.people.findUnique({
      where: { id }
    });

    if (!existingPerson) {
      return res.status(404).json({
        success: false,
        error: 'Person not found',
        timestamp: new Date().toISOString()
      });
    }

    // Check if person has any chore assignments
    const assignmentCount = await prisma.chore_assignments.count({
      where: {
        OR: [
          { assigned_to: id },
          { helper_id: id }
        ]
      }
    });

    if (assignmentCount > 0) {
      return res.status(409).json({
        success: false,
        error: 'Cannot delete person with existing chore assignments',
        message: `This person has ${assignmentCount} chore assignment(s). Please reassign or delete them first.`,
        timestamp: new Date().toISOString()
      });
    }

    await prisma.people.delete({
      where: { id }
    });

    console.log('Person deleted successfully:', id);

    res.json({
      success: true,
      message: 'Person deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting person:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete person',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
