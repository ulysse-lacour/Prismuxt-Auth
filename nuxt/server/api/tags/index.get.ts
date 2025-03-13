import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to fetch all tags for the current user
 * GET /api/tags
 */

// Initialize Prisma client
const prisma = new PrismaClient();

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

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Check if user exists
    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Fetch all tags for the user
    const tags = await prisma.tag.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
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
