// Vercel API route for individual timezone operations
import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid timezone ID' });
  }

  try {
    if (req.method === 'GET') {
      const timezone = await prisma.timezone.findUnique({
        where: { id }
      });

      if (!timezone) {
        return res.status(404).json({ success: false, error: 'Timezone not found' });
      }

      // Map database fields to expected API fields
      const mappedTimezone = {
        id: timezone.id,
        name: timezone.name,
        description: timezone.description,
        startTime: null,
        endTime: null,
        order: timezone.display_order,
        isActive: true,
        createdAt: timezone.created_at,
        updatedAt: new Date(),
      };

      return res.status(200).json({ success: true, data: mappedTimezone });
    }

    if (req.method === 'PUT') {
      const { name, description, startTime, endTime, isActive, order } = req.body;

      const timezone = await prisma.timezone.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(order !== undefined && { display_order: order }),
        },
      });

      // Map database fields to expected API fields
      const mappedTimezone = {
        id: timezone.id,
        name: timezone.name,
        description: timezone.description,
        startTime: null,
        endTime: null,
        order: timezone.display_order,
        isActive: true,
        createdAt: timezone.created_at,
        updatedAt: new Date(),
      };

      return res.status(200).json({ success: true, data: mappedTimezone });
    }

    if (req.method === 'DELETE') {
      await prisma.timezone.delete({
        where: { id }
      });

      return res.status(200).json({ success: true, message: 'Timezone deleted successfully' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in timezone [id] API:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
