// Vercel API route for timezone reordering
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

  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { timezones } = req.body;

    if (!Array.isArray(timezones)) {
      return res.status(400).json({ success: false, error: 'Invalid timezones data' });
    }

    // Update each timezone's display_order
    const updatePromises = timezones.map(tz => 
      prisma.timezone.update({
        where: { id: tz.id },
        data: { display_order: tz.order }
      })
    );

    const updatedTimezones = await Promise.all(updatePromises);

    // Map database fields to expected API fields
    const mappedTimezones = updatedTimezones.map(tz => ({
      id: tz.id,
      name: tz.name,
      description: tz.description,
      startTime: null,
      endTime: null,
      order: tz.display_order,
      isActive: true,
      createdAt: tz.created_at,
      updatedAt: new Date(),
    }));

    return res.status(200).json({ 
      success: true, 
      data: mappedTimezones 
    });
  } catch (error) {
    console.error('Error in timezone reorder API:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
