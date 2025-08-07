// Vercel API route for health check
import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    console.log('Health check starting...');
    console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);
    
    // Test database connection with a simple query
    await prisma.$queryRaw`SELECT 1 as test`;
    const dbConnectionTime = Date.now() - startTime;
    console.log('Database connection successful');

    // Get some basic stats
    const timezoneCount = await prisma.timezone.count();
    const userCount = await prisma.users.count();
    console.log('Stats retrieved - timezones:', timezoneCount, 'users:', userCount);

    return res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'connected',
        responseTime: `${dbConnectionTime}ms`,
        provider: 'postgresql',
        host: 'neon',
      },
      stats: {
        timezones: timezoneCount,
        users: userCount,
      },
      endpoints: {
        timezones: '/api/timezones',
        health: '/api/health',
      },
      uptime: process.uptime ? `${Math.floor(process.uptime())}s` : 'unknown',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Database connection failed',
      database: {
        status: 'disconnected',
        responseTime: `${Date.now() - startTime}ms`,
      },
    });
  }
}
