// Vercel API route for timezones collection
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

  try {
    if (req.method === 'GET') {
      const timezones = await prisma.timezone.findMany({ 
        orderBy: { display_order: 'asc' } 
      });
      
      // Map database fields to expected API fields
      const mappedTimezones = timezones.map(tz => ({
        id: tz.id,
        name: tz.name,
        description: tz.description,
        startTime: null, // Not in current schema
        endTime: null, // Not in current schema
        order: tz.display_order, // Map display_order to order
        isActive: true, // Default since not in current schema
        createdAt: tz.created_at,
        updatedAt: new Date(), // Default since updatedAt not in current schema
      }));
      
      return res.status(200).json({ 
        success: true, 
        data: mappedTimezones, 
        count: mappedTimezones.length 
      });
    }
    
    if (req.method === 'POST') {
      const { name, description, startTime, endTime, isActive, order } = req.body;
      
      if (!name) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name is required' 
        });
      }
      
      const timezone = await prisma.timezone.create({
        data: {
          name,
          description: description || null,
          display_order: order || 1,
        },
      });
      
      // Map database fields to expected API fields
      const mappedTimezone = {
        id: timezone.id,
        name: timezone.name,
        description: timezone.description,
        startTime: null,
        endTime: null,
        order: timezone.display_order, // Map display_order to order
        isActive: true,
        createdAt: timezone.created_at,
        updatedAt: new Date(),
      };
      
      return res.status(201).json({ success: true, data: mappedTimezone });
    }
    
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in timezones API:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
