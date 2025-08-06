// Vercel API route for API documentation/endpoint listing
import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  const baseUrl = req.headers.host ? `https://${req.headers.host}` : 'http://localhost:5173';

  const apiDocs = {
    title: 'ChoreNest Family Chores API',
    version: '1.0.0',
    description: 'API for managing family chores, timezones, and household tasks',
    baseUrl,
    endpoints: {
      health: {
        path: '/api/health',
        method: 'GET',
        description: 'Health check endpoint with database status',
        example: `${baseUrl}/api/health`,
      },
      timezones: {
        list: {
          path: '/api/timezones',
          method: 'GET',
          description: 'Get all timezones',
          example: `${baseUrl}/api/timezones`,
        },
        create: {
          path: '/api/timezones',
          method: 'POST',
          description: 'Create a new timezone',
          example: `${baseUrl}/api/timezones`,
          body: {
            name: 'Morning',
            description: 'Early morning tasks',
            order: 1,
            isActive: true,
          },
        },
        get: {
          path: '/api/timezones/{id}',
          method: 'GET',
          description: 'Get a specific timezone by ID',
          example: `${baseUrl}/api/timezones/123e4567-e89b-12d3-a456-426614174000`,
        },
        update: {
          path: '/api/timezones/{id}',
          method: 'PUT',
          description: 'Update a specific timezone',
          example: `${baseUrl}/api/timezones/123e4567-e89b-12d3-a456-426614174000`,
          body: {
            name: 'Updated Morning',
            description: 'Updated description',
            order: 2,
          },
        },
        delete: {
          path: '/api/timezones/{id}',
          method: 'DELETE',
          description: 'Delete a specific timezone',
          example: `${baseUrl}/api/timezones/123e4567-e89b-12d3-a456-426614174000`,
        },
        reorder: {
          path: '/api/timezones/reorder',
          method: 'PUT',
          description: 'Reorder multiple timezones',
          example: `${baseUrl}/api/timezones/reorder`,
          body: {
            timezones: [
              { id: '123e4567-e89b-12d3-a456-426614174000', order: 1 },
              { id: '123e4567-e89b-12d3-a456-426614174001', order: 2 },
            ],
          },
        },
      },
    },
    testInstructions: {
      curl: 'Use curl commands to test endpoints',
      postman: 'Import this JSON into Postman for testing',
      browser: 'Visit GET endpoints directly in your browser',
    },
  };

  // If requesting HTML format
  if (req.headers.accept?.includes('text/html')) {
    const html = generateHtmlDocs(apiDocs);
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }

  return res.status(200).json(apiDocs);
}

function generateHtmlDocs(docs: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${docs.title}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, rgba(142, 202, 230, 0.1) 0%, rgba(33, 158, 188, 0.1) 50%, rgba(2, 48, 71, 0.1) 100%);
            min-height: 100vh;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #023047; 
            font-size: 2.5em; 
            margin-bottom: 10px;
            font-family: 'Dancing Script', cursive;
        }
        h2 { 
            color: #219EBC; 
            border-bottom: 2px solid #8ECAE6; 
            padding-bottom: 10px;
        }
        h3 { 
            color: #023047; 
            margin-top: 25px;
        }
        .endpoint { 
            background: #f8f9fa; 
            padding: 15px; 
            margin: 10px 0; 
            border-radius: 8px; 
            border-left: 4px solid #8ECAE6;
        }
        .method { 
            display: inline-block; 
            padding: 4px 8px; 
            border-radius: 4px; 
            color: white; 
            font-weight: bold; 
            font-size: 0.8em;
            margin-right: 10px;
        }
        .get { background: #28a745; }
        .post { background: #007bff; }
        .put { background: #fd7e14; }
        .delete { background: #dc3545; }
        code { 
            background: #e9ecef; 
            padding: 2px 6px; 
            border-radius: 4px; 
            font-family: 'Courier New', monospace;
        }
        pre { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 8px; 
            overflow-x: auto;
            border: 1px solid #dee2e6;
        }
        .status { 
            display: inline-block; 
            padding: 4px 8px; 
            border-radius: 4px; 
            color: white; 
            font-weight: bold; 
            background: #28a745;
        }
        .test-links {
            background: linear-gradient(135deg, #8ECAE6, #219EBC);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .test-links a {
            color: white;
            text-decoration: none;
            font-weight: bold;
            margin-right: 15px;
            padding: 8px 15px;
            background: rgba(255,255,255,0.2);
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 10px;
        }
        .test-links a:hover {
            background: rgba(255,255,255,0.3);
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1>${docs.title}</h1>
        <p><strong>Version:</strong> ${docs.version}</p>
        <p>${docs.description}</p>
        <p><strong>Base URL:</strong> <code>${docs.baseUrl}</code></p>
        
        <div class="test-links">
            <h3 style="margin-top: 0; color: white;">🚀 Quick Test Links</h3>
            <a href="${docs.baseUrl}/api/health" target="_blank">Health Check</a>
            <a href="${docs.baseUrl}/api/timezones" target="_blank">List Timezones</a>
            <a href="${docs.baseUrl}/api/docs" target="_blank">API Docs (JSON)</a>
        </div>

        <h2>Health Check</h2>
        <div class="endpoint">
            <span class="method get">GET</span>
            <code>${docs.endpoints.health.path}</code>
            <p>${docs.endpoints.health.description}</p>
        </div>

        <h2>Timezone Endpoints</h2>
        
        <h3>List All Timezones</h3>
        <div class="endpoint">
            <span class="method get">GET</span>
            <code>${docs.endpoints.timezones.list.path}</code>
            <p>${docs.endpoints.timezones.list.description}</p>
        </div>

        <h3>Create Timezone</h3>
        <div class="endpoint">
            <span class="method post">POST</span>
            <code>${docs.endpoints.timezones.create.path}</code>
            <p>${docs.endpoints.timezones.create.description}</p>
            <pre>${JSON.stringify(docs.endpoints.timezones.create.body, null, 2)}</pre>
        </div>

        <h3>Get Specific Timezone</h3>
        <div class="endpoint">
            <span class="method get">GET</span>
            <code>${docs.endpoints.timezones.get.path}</code>
            <p>${docs.endpoints.timezones.get.description}</p>
        </div>

        <h3>Update Timezone</h3>
        <div class="endpoint">
            <span class="method put">PUT</span>
            <code>${docs.endpoints.timezones.update.path}</code>
            <p>${docs.endpoints.timezones.update.description}</p>
            <pre>${JSON.stringify(docs.endpoints.timezones.update.body, null, 2)}</pre>
        </div>

        <h3>Delete Timezone</h3>
        <div class="endpoint">
            <span class="method delete">DELETE</span>
            <code>${docs.endpoints.timezones.delete.path}</code>
            <p>${docs.endpoints.timezones.delete.description}</p>
        </div>

        <h3>Reorder Timezones</h3>
        <div class="endpoint">
            <span class="method put">PUT</span>
            <code>${docs.endpoints.timezones.reorder.path}</code>
            <p>${docs.endpoints.timezones.reorder.description}</p>
            <pre>${JSON.stringify(docs.endpoints.timezones.reorder.body, null, 2)}</pre>
        </div>

        <h2>Testing Instructions</h2>
        <ul>
            <li><strong>Browser:</strong> Visit GET endpoints directly in your browser</li>
            <li><strong>curl:</strong> Use curl commands to test all endpoints</li>
            <li><strong>Postman:</strong> Visit <code>/api/docs</code> to get JSON format for import</li>
        </ul>
    </div>
</body>
</html>`;
}
