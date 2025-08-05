// Vercel API route for timezones
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const timezones = await prisma.timezone.findMany({ orderBy: { displayOrder: 'asc' } });
      return res.status(200).json({ success: true, data: timezones, count: timezones.length });
    }
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in timezones API:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
