// Vercel API route for chores
// Refactored from Express to Vercel serverless function
import type { VercelRequest, VercelResponse } from '@vercel/node';
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
      // Get all chores
      const chores = await prisma.chore.findMany({
        orderBy: { name: 'asc' }
      });
      return res.status(200).json({ success: true, data: chores, count: chores.length });
    }
    
    if (req.method === 'POST') {
      const { name, description, frequency, estimatedMinutes } = req.body;
      const chore = await prisma.chore.create({
        data: {
          name,
          description,
          frequency,
          estimatedMinutes,
        },
      });
      return res.status(201).json({ success: true, data: chore });
    }
    
    // Add other methods (PUT, DELETE) as needed
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in chores API:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
