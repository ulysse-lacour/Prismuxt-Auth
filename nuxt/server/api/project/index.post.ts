import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to create a new project
 * POST /api/project
 *
 * Request body:
 * {
 *   name: string;
 *   description?: string;
 *   client?: string;
 * }
 */

// Initialize Prisma client
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Verify user authentication
    const session = await auth.api.getSession(event);

    if (!session) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Parse request body
    const body = await readBody(event);
    const { name, description, client } = body;

    // Validate required fields
    if (!name || typeof name !== "string") {
      throw createError({
        statusCode: 400,
        message: "Project name is required",
      });
    }

    // Create new project in database
    const createdProject = await prisma.project.create({
      data: {
        name,
        description,
        client,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    // Return success response with created project
    return {
      success: true,
      project: createdProject,
    };
  } catch (error) {
    // Log error and return appropriate error response
    console.error("Error creating project:", error);
    throw createError({
      statusCode: 500,
      message: "Error creating project",
    });
  }
});
