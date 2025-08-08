# FamilyChores Application

A comprehensive family chore management system built with React, TypeScript, Shadcn UI, and React Router, with a PostgreSQL database.

![FamilyChores Application](public/favicon.ico)

## Overview

The FamilyChores application helps families organize, assign, and track household chores. It provides features for chore management, scheduling, assignment, and completion tracking.

### Key Features

- **Chore Management**: Create, edit, and delete chores with categories
- **Scheduling**: Define recurring chore schedules with flexible patterns
- **Assignment**: Assign chores to family members based on various criteria
- **Tracking**: Monitor chore completion and history
- **Timezone Support**: Organize chores by time periods or timezones

---

## Architecture

### Frontend

- **Framework**: React with TypeScript
- **Routing**: React Router v6
- **UI Components**: Shadcn UI (built on Radix UI primitives with Tailwind CSS)
- **State Management**: React Query for server state
- **Styling**: Tailwind CSS

### Backend

- **API**: Vercel Serverless Functions in `/api` directory
- **Database**: PostgreSQL via Neon
- **ORM**: Prisma
- **Authentication**: (Planned)

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

### Prerequisites

- Node.js 16+
- npm or pnpm
- PostgreSQL database (or Neon account)

### Environment Setup

1. Create a `.env` file with the following variables:

```
DATABASE_URL=your_postgres_connection_string
```

2. Set up the database:

```bash
npx prisma db push
```

3. Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Backend Development

When working on backend features:

```bash
vercel dev
```

This runs both the frontend and serverless API functions.

## Building for Production

Create a production build:

```bash
npm run build
```

### Running Tests

```bash
npm run test
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

# Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style

- Follow the existing code style
- Use TypeScript for type safety
- Write unit tests for new features
- Use Shadcn UI components for UI elements

# Roadmap

- [ ] Authentication and user management
- [ ] Mobile-responsive design improvements
- [ ] Family member profiles with avatar support
- [ ] Notifications for upcoming chores
- [ ] Reward system tracking
- [ ] Calendar view of scheduled chores
- [ ] Statistics and reporting
- [ ] Dark/light mode toggle

Built with ❤️ using React, TypeScript, and Shadcn UI.

---

# Project Structure

## Frontend

```
app/
├── components/          # Reusable UI components
│   ├── chores/          # Chore-specific components
│   ├── ui/              # Shadcn UI components
│   └── ...
├── hooks/               # Custom React hooks
├── routes/              # Route components
├── services/            # API service layer
└── types/               # TypeScript type definitions
```

### Key Components

- **ChoresList**: Displays chores grouped by category
- **ChoreFormModal**: Modal dialog for creating/editing chores
- **ScheduleBuilder**: Creates recurring schedules for chores
- **AssignmentsList**: Shows current chore assignments

## Backend

```
api/
├── routes/              # API route handlers
│   ├── choreRoutes.js
│   ├── peopleRoutes.js
│   ├── scheduleRoutes.js
│   └── timezoneRoutes.js
├── services/            # Business logic services
└── server.js            # Entry point
```

## Database

```
db/
├── migrations/          # Database migrations
│   ├── 01_initial_schema.sql
│   ├── 02_chore_scheduling_schema.sql
│   └── ...
└── models/              # Database models
```

### Database Schema

The application uses a PostgreSQL database with the following main tables:

- **chores**: Stores chore definitions
- **people**: Stores family member information
- **timezones**: Stores time periods for chore organization
- **chore_assignments**: Links chores to people
- **chore_schedules**: Defines recurring patterns for chores

# Data Flow

1. **User Interface**: React components in the `/app` directory
2. **API Calls**: Made through service modules in `/app/services`
3. **Backend Processing**: Handled by serverless functions in `/api`
4. **Database Operations**: Performed via Prisma ORM
5. **Response Handling**: Managed by React Query and component state

# Features Details

## Chore Management

- Create, edit, and delete chores
- Categorize chores by type (Morning Tasks, Lunch Tasks, etc.)
- Set time sensitivity and reward values
- Import chores from the Chores.md file

## Scheduling System

- Create recurring schedules (daily, weekly, monthly)
- Define custom recurrence patterns
- Preview upcoming occurrences

## Assignment Options

- Assign to specific individuals
- Assign to anyone in a group
- Assign to everyone
- Track who is capable of doing specific chores

## Migration Log

- Migrated backend API routes to `/api` (Vercel serverless functions)
- Moved Prisma client and validation to `/lib`
- Moved type definitions to `/types`
- Moved Prisma schema and seed scripts to `/prisma`
- Removed legacy `old-backend` directory
- Migrated UI from Material UI to Shadcn UI
- Implemented chore categorization
- Added modal-based forms for chore creation/editing
- Implemented chore import from Chores.md
