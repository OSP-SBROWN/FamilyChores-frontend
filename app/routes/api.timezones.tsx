import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

// GET /api/timezones - Get all timezones
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const timezones = await prisma.timezone.findMany({
      orderBy: { display_order: 'asc' }
    });

    return Response.json({
      success: true,
      data: timezones.map(tz => ({
        id: tz.id,
        name: tz.name,
        description: tz.description,
        startTime: null, // Not in current schema
        endTime: null,   // Not in current schema
        isActive: true,  // Not in current schema - default to true
        order: tz.display_order,
        createdAt: tz.created_at,
        updatedAt: null  // Not in current schema
      }))
    }, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Failed to fetch timezones:", error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch timezones"
    }, {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

// POST /api/timezones - Create a new timezone
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { name, description, startTime, endTime, isActive, order } = body;

    if (!name) {
      return Response.json({ 
        success: false, 
        error: "Name is required" 
      }, { status: 400 });
    }

    const timezone = await prisma.timezone.create({
      data: {
        name,
        description: description || null,
        display_order: order || 1
      }
    });

    return Response.json({
      success: true,
      data: {
        id: timezone.id,
        name: timezone.name,
        description: timezone.description,
        startTime: null,
        endTime: null,
        isActive: true,
        order: timezone.display_order,
        createdAt: timezone.created_at,
        updatedAt: null
      }
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Failed to create timezone:", error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create timezone"
    }, {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
