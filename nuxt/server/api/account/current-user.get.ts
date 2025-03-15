import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to fetch the current authenticated user's data
 *
 * Endpoint: GET /api/account/current-user
 *
 * Response:
 * {
 *   user: {
 *     id: string;
 *     name: string;
 *     email: string;
 *     emailVerified: boolean;
 *     image: string | null;
 *     twoFactorEnabled: boolean;
 *     projects: Project[];
 *     portfolios: Portfolio[];
 *   }
 * }
 *
 * Authentication: Required (user must be logged in)
 * Purpose: Provides user profile data and associated projects/portfolios
 */

export default defineEventHandler(async (event) => {
  try {
    // Get user session from auth provider
    const session = await auth.api.getSession(event);

    // Verify user is authenticated
    if (!session) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized - User must be logged in",
      });
    }

    // Fetch user's data with related entities from database
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

    // Handle case where user is not found in database
    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Return user data to client
    return { user };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error("Error fetching user data:", error);

    // Return the error if it's already a properly formatted error
    if (error.statusCode) {
      throw error;
    }

    // Create a generic error for unexpected issues
    throw createError({
      statusCode: 500,
      message: "Error fetching user data",
    });
  }
});
