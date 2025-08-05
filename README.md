# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

---

## FamilyChores Vercel + Neon Setup

This project now uses Vercel for hosting and Neon for the database. Backend API routes are implemented as Vercel serverless functions in the `/api` directory.

### Key Changes

- **API routes**: All backend logic is now in `/api` as Vercel serverless functions (see `api-integration-guide.md`).
- **Database**: Prisma is configured to use Neon. Connection string is set via the `DATABASE_URL` environment variable in Vercel.
- **Shared code**: Prisma client and validation utilities are in `/lib`. Type definitions are in `/types`.
- **Prisma schema**: See `/prisma/schema.prisma` and seed scripts in `/prisma`.
- **Old backend**: The legacy Express backend has been removed. All required code has been migrated.

### Local Development

Use `vercel dev` to run both frontend and API routes locally.

### Deployment

Deploy to Vercel. Set your Neon connection string and any secrets in the Vercel dashboard.

---

## Timezone API Service Update

- The timezone management frontend now uses a relative API path (`/api`) to communicate with Vercel serverless functions.
- This replaces the previous hardcoded `localhost:4001` backend, resolving network errors and blank screens.
- No further configuration is needed for local or Vercel deployment—API calls will route correctly.

---

# Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

# Getting Started

## Installation

Install the dependencies:

```bash
npm install
```

## Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

# Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

---

## Migration Log

- Migrated backend API routes to `/api` (Vercel serverless functions)
- Moved Prisma client and validation to `/lib`
- Moved type definitions to `/types`
- Moved Prisma schema and seed scripts to `/prisma`
- Removed legacy `old-backend` directory
