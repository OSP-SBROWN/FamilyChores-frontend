# Integrating Family Chores Backend API with Vercel Frontend

## Overview
For cost and simplicity, deploy both your frontend and backend API together in a single Vercel project. Vercel will automatically route `/api/*` requests to serverless functions, and all other requests to your frontend.

---

## Steps to Integrate Backend API into Frontend Vercel Repo

### 1. Move Backend API Code
- Copy your backend API route handlers (e.g., chores, people, assignments, timezones, users, auth, roster, abilities, health) into the `/api` directory at the root of your frontend repo.
- Each API route should be a separate file (e.g., `/api/chores.ts`).
- Refactor Express route handlers to standalone functions using Vercel's request/response signature:
  ```ts
  import { NextApiRequest, NextApiResponse } from 'next';
  import prisma from '../../lib/prisma'; // or wherever your Prisma client is

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle GET, POST, etc.
  }
  ```

### 2. Shared Utilities
- Move shared utilities (e.g., Prisma client, validation) to a common location (e.g., `/lib/prisma.ts`).
- Import these utilities in each API route as needed.

### 3. Environment Variables
- In the Vercel dashboard, set your Neon database connection string as `DATABASE_URL`.
- Any other secrets (JWT, etc.) should also be set in Vercel's environment variables.

### 4. Update Frontend API Calls
- Update your frontend code to call `/api/chores`, `/api/people`, etc. (relative paths, no need for CORS).

### 5. Remove Express App
- Vercel serverless functions do not use a central Express app. Each route is a standalone handler.
- Remove any Express-specific middleware and app setup.

### 6. Test Locally
- Use `vercel dev` to run your project locally and test both frontend and API routes.

---

## Example API Route (Vercel Serverless Function)
```ts
// /api/chores.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const chores = await prisma.chore.findMany();
    return res.status(200).json({ success: true, data: chores });
  }
  // Handle other methods (POST, PUT, DELETE) as needed
}
```

---

## Summary
- Place all backend API logic in `/api` directory of your frontend repo.
- Use Vercel serverless function signature for each route.
- Set environment variables in Vercel dashboard.
- Remove Express app and middleware.
- Test with `vercel dev`.

This approach keeps everything simple, cost-effective, and easy to maintain. If you need help refactoring specific routes, let me know!
