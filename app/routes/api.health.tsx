import type { LoaderFunctionArgs } from "react-router";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

export async function loader({ request }: LoaderFunctionArgs) {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const timezoneCount = await prisma.timezone.count();
    const userCount = await prisma.users.count();
    
    const responseTime = Date.now() - startTime;
    
    const healthData = {
      success: true,
      status: "healthy" as const,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      database: {
        status: "connected" as const,
        responseTime: `${responseTime}ms`,
        provider: "Neon PostgreSQL",
        host: "Neon Cloud"
      },
      stats: {
        timezones: timezoneCount,
        users: userCount
      },
      uptime: process.uptime ? `${Math.floor(process.uptime())}s` : "unknown"
    };

    return Response.json(healthData, {
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Health check failed:", error);
    
    const errorData = {
      success: false,
      status: "unhealthy" as const,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Database connection failed",
      environment: process.env.NODE_ENV || "development"
    };

    return Response.json(errorData, {
      status: 500,
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json"
      }
    });
  }
}
