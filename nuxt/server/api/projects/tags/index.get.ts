import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to fetch all tags belonging to a user
 * GET /api/projects/tags
 */

export default defineEventHandler(async (event) => {
  try {
    // Verify user authentication
    const session = await auth.api.getSession(event);

    // Check if user is authenticated
    if (!session || !session.user || !session.user.email) {
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
  } catch (error) {
    // Log error and return appropriate error response
    console.error("Error fetching tags:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching tags",
    });
  }
});
