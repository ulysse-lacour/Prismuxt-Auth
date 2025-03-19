import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Creates a new project for the authenticated user
 *
 * @endpoint POST /api/projects/single
 *
 * @auth Required
 *
 * @body {
 *   name: string - Project name (required)
 *   description?: string - Project description (optional)
 *   client?: string - Client name (optional)
 * }
 *
 * @response {
 *   success: boolean - Whether the project was created successfully
 *   project: {
 *     id: string - Project unique identifier
 *     name: string - Project name
 *     description: string | null - Project description
 *     client: string | null - Client name
 *     userId: string - Owner's user ID
 *     createdAt: string - Creation timestamp
 *     updatedAt: string - Last update timestamp
 *   }
 * }
 *
 * @error {
 *   400: Bad Request - Missing or invalid project name
 *   401: Unauthorized - User not authenticated
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Creates a new project record in the database
 */

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession(event);
    if (!session?.user?.email) {
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
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create project",
      cause: error,
    });
  }
});
