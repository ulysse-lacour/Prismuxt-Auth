import { auth } from "~/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Fetches all projects of the current user
 *
 * @endpoint GET /api/projects
 *
 * @auth Required
 *
 * @response {
 *   projects: Array<{
 *     id: string - Project unique identifier
 *     name: string - Project name
 *     description: string - Project description
 *     // ... other project properties
 *   }>
 * }
 *
 * @error {
 *   401: Unauthorized - User is not authenticated
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

    // Fetch all projects
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        portfolioProjects: true,
        projectTags: true,
        projectContents: true,
      },
    });

    console.log(projects);

    // Return projects
    return projects;
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch projects",
      cause: error,
    });
  }
});
