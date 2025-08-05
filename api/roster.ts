// Vercel API route for roster
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, message: 'Roster endpoint - TODO: implement' });
  }
  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
