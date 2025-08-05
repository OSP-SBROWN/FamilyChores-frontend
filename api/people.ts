// Vercel API route for people
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const people = await prisma.person.findMany({
        include: {
          creator: { select: { id: true, username: true, email: true } }
        },
        orderBy: { name: 'asc' }
      });
      return res.status(200).json({ success: true, data: people, count: people.length });
    }
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in people API:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
