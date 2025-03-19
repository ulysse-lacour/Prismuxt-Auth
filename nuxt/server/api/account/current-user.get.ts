import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Fetches the current authenticated user's profile data including
 * associated projects and portfolios
 *
 * @endpoint GET /api/account/current-user
 *
 * @auth Required
 *
 * @response {
 *   user: {
 *     id: string - Unique user identifier
 *     name: string - User's display name
 *     email: string - User's email address
 *     emailVerified: boolean - Email verification status
 *     image: string | null - User's profile image URL
 *     twoFactorEnabled: boolean - 2FA status
 *     projects: Project[] - User's associated projects
 *     portfolios: Portfolio[] - User's associated portfolios
 *   }
 * }
 *
 * @error {
 *   401: Unauthorized - User not authenticated
 *   404: Not Found - User not found in database
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
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch user data",
      cause: error,
    });
  }
});
