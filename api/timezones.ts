// Vercel API route for timezones
import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const timezones = await prisma.timezone.findMany({ orderBy: { displayOrder: 'asc' } });
      return res.status(200).json({ success: true, data: timezones, count: timezones.length });
    }
    
    if (req.method === 'POST') {
      const { name, description, startTime, endTime, isActive, order } = req.body;
      const timezone = await prisma.timezone.create({
        data: {
          name,
          description,
          startTime,
          endTime,
          isActive,
          displayOrder: order,
        },
      });
      return res.status(201).json({ success: true, data: timezone });
    }
    
    if (req.method === 'PUT') {
      const { id, name, description, startTime, endTime, isActive, order } = req.body;
      const timezone = await prisma.timezone.update({
        where: { id },
        data: {
          name,
          description,
          startTime,
          endTime,
          isActive,
          displayOrder: order,
        },
      });
      return res.status(200).json({ success: true, data: timezone });
    }
    
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await prisma.timezone.delete({
        where: { id: id as string },
      });
      return res.status(200).json({ success: true, message: 'Timezone deleted' });
    }
    
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in timezones API:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
