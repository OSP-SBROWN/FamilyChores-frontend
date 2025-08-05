// Vercel API route for chores
// Refactored from Express to Vercel serverless function
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../lib/prisma';
import Joi from 'joi';

const createChoreSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().optional(),
  frequency: Joi.string().valid('daily', 'multiple_daily', 'weekdays_only', 'weekend', 'weekly', 'monthly', 'quarterly', 'twice_yearly', 'annually', 'ad_hoc').required(),
  estimatedMinutes: Joi.number().min(1).optional(),
  timezoneIds: Joi.array().items(Joi.string()).default([])
});

const updateChoreSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  description: Joi.string().optional(),
  frequency: Joi.string().valid('daily', 'multiple_daily', 'weekdays_only', 'weekend', 'weekly', 'monthly', 'quarterly', 'twice_yearly', 'annually', 'ad_hoc').optional(),
  estimatedMinutes: Joi.number().min(1).optional(),
  timezoneIds: Joi.array().items(Joi.string()).optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get all chores
      const chores = await prisma.chore.findMany({
        include: {
          assignments: {
            include: {
              assignedTo: { select: { id: true, name: true } },
              helper: { select: { id: true, name: true } }
            },
            orderBy: { scheduledDate: 'desc' },
            take: 5
          },
          timezones: {
            include: {
              timezone: true
            }
          },
          _count: {
            select: { assignments: true }
          }
        },
        orderBy: { name: 'asc' }
      });
      return res.status(200).json({ success: true, data: chores, count: chores.length });
    }
    // Add other methods (POST, PUT, DELETE) as needed
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in chores API:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
