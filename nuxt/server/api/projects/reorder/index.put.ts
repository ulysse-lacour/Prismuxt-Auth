import { auth } from "~/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Updates the order of projects for the current user
 *
 * @endpoint PUT /api/projects/reorder
 *
 * @auth Required
 *
 * @body {
 *   projects: string[] - Array of project IDs in their new order
 * }
 *
 * @response {
 *   success: boolean - Whether the reorder was successful
 *   projects: Array<{
 *     id: string - Project unique identifier
 *     name: string - Project name
 *     description: string | null - Project description
 *     client: string | null - Client name
 *     projectTags: Array<{
 *       tag: {
 *         name: string
 *       }
 *     }>
 *     // ... other project properties
 *   }>
 * }
 *
 * @error {
 *   400: Bad Request - Invalid project IDs or order
 *   401: Unauthorized - User is not authenticated
 *   403: Forbidden - User doesn't own all projects
 *   500: Internal Server Error - Server-side error
 * }
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

    // Get the request body
    const body = await readBody(event);
    const { projects } = body;

    // Validate request body
    if (!Array.isArray(projects) || projects.length === 0) {
      throw createError({
        statusCode: 400,
        message: "Invalid project order",
      });
    }

    // Verify all projects belong to the user
    const userProjects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    const userProjectIds = new Set(userProjects.map((p) => p.id));
    const hasInvalidProjects = projects.some((id) => !userProjectIds.has(id));

    if (hasInvalidProjects) {
      throw createError({
        statusCode: 403,
        message: "Some projects do not belong to the current user",
      });
    }

    // Update project order using a transaction
    const updatedProjects = await prisma.$transaction(
      projects.map((id, index) =>
        prisma.project.update({
          where: { id },
          data: {
            order: index,
          },
          include: {
            projectTags: {
              include: {
                tag: true,
              },
            },
          },
        })
      )
    );

    // Return success response with updated projects
    return {
      success: true,
      projects: updatedProjects,
    };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to reorder projects",
      cause: error,
    });
  }
});
