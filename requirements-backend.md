# Backend Requirements - Neon Database Configuration

## Database Setup
We're using **Neon PostgreSQL** as our cloud database provider.

### Connection Details
- **Database**: Neon PostgreSQL
- **Connection String**: `postgresql://neondb_owner:npg_7woIGnxLi9Sk@ep-summer-leaf-abqqx24a-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- **Region**: EU West 2 (London)

### Environment Variables Required

#### Local Development (.env.local)
```bash
DATABASE_URL=postgresql://neondb_owner:npg_7woIGnxLi9Sk@ep-summer-leaf-abqqx24a-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### Vercel Production
Set in Vercel Dashboard > Settings > Environment Variables:
- **Name**: `DATABASE_URL`
- **Value**: `postgresql://neondb_owner:npg_7woIGnxLi9Sk@ep-summer-leaf-abqqx24a-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- **Environments**: Production, Preview, Development

### Database Schema
Using Prisma ORM with the following models:
- **Timezone**: Family time management zones with order, start/end times, and active status

### Deployment Steps
1. Set DATABASE_URL in Vercel environment variables
2. Run `npx prisma generate` to generate Prisma client
3. Run `npx prisma db push` to deploy schema to Neon database
4. Deploy to Vercel

### API Endpoints
- `GET /api/timezones` - List all timezones
- `POST /api/timezones` - Create new timezone
- `PUT /api/timezones/[id]` - Update timezone
- `DELETE /api/timezones/[id]` - Delete timezone