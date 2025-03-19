import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Fetches all slide tags for the authenticated user, sorted alphabetically
 *
 * @endpoint GET /api/projects/slide-tags
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
 *   404: Not Found - User not found
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

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Get all slide tags for the user
    const tags = await prisma.slideTag.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    });

    return { tags };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch slide tags",
      cause: error,
    });
  }
});
