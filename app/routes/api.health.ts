import type { LoaderFunction } from "react-router";
import prisma from "../../lib/prisma";

export const loader: LoaderFunction = async ({ request }) => {
  // Set CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (request.method !== 'GET') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers }
    );
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

    const response = {
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
    };

    return new Response(JSON.stringify(response), { 
      status: 200, 
      headers 
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse = {
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Database connection failed',
      database: {
        status: 'disconnected',
        responseTime: `${Date.now() - startTime}ms`,
      },
    };

    return new Response(JSON.stringify(errorResponse), { 
      status: 503, 
      headers 
    });
  }
};
