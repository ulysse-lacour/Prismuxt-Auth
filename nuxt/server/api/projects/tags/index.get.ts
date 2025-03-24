import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Fetches all project tags for the authenticated user
 *
 * @endpoint GET /api/projects/tags
 *
 * @auth Required
 *
 * @response {
 *   tags: Array<{
 *     id: string - Tag unique identifier
 *     name: string - Tag name
 *     userId: string - Owner's user ID
 *     createdAt: string - Creation timestamp
 *     updatedAt: string - Last update timestamp
 *   }>
 * }
 *
 * @error {
 *   401: Unauthorized - User not authenticated
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

    // Get tags
    const tags = await prisma.tag.findMany({
      where: { userId: session.user.id },
    });

    // Return tags
    return { tags };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch tags",
      cause: error,
    });
  }
});
