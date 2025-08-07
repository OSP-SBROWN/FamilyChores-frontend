import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all day types
router.get('/', async (req, res) => {
  try {
    const dayTypes = await prisma.day_types.findMany({
      orderBy: {
        display_name: 'asc'
      }
    });
    
    res.json({ success: true, data: dayTypes });
  } catch (error) {
    console.error('Error fetching day types:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch day types' 
    });
  }
});

// Create a new day type
router.post('/', async (req, res) => {
  try {
    const { name, display_name } = req.body;
    
    if (!name || !display_name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and display_name are required' 
      });
    }

    const dayType = await prisma.day_types.create({
      data: {
        id: crypto.randomUUID(),
        name,
        display_name
      }
    });
    
    res.status(201).json({ success: true, data: dayType });
  } catch (error) {
    console.error('Error creating day type:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create day type' 
    });
  }
});

export default router;
