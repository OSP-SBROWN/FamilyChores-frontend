import type { LoaderFunction } from "react-router";

export const loader: LoaderFunction = async ({ request }) => {
  // Set CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    const response = {
      status: 'ok',
      message: 'Test API endpoint is working via React Router',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasDatabase: !!process.env.DATABASE_URL,
        databaseUrlStart: process.env.DATABASE_URL?.substring(0, 20) + '...',
      }
    };

    return new Response(JSON.stringify(response), { 
      status: 200, 
      headers 
    });
    
  } catch (error) {
    console.error('Test endpoint error:', error);
    
    const errorResponse = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return new Response(JSON.stringify(errorResponse), { 
      status: 500, 
      headers 
    });
  }
};
