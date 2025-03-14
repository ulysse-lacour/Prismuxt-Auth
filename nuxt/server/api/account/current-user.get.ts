import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to fetch the current authenticated user's data
 * GET /api/account/current-user
 *
 * Returns the user's profile data including projects and portfolios
 * Requires authentication
 */

export default defineEventHandler(async (event) => {
  try {
    // Get user session
    const session = await auth.api.getSession(event);

    // Verify authentication
    if (!session) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Fetch user's data with related entities
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        projects: true,
        portfolios: true,
        emailVerified: true,
        image: true,
        twoFactorEnabled: true,
      },
    });

    // Handle case where user is not found
    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Return user data
    return { user };
  } catch (error: any) {
    // Log error and return appropriate error response
    console.error("Error fetching user data:", error);

    // Return the error if it's already a handled error
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Error fetching user data",
    });
  }
});
