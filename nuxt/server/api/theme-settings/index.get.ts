import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to fetch the current user's theme settings
 * GET /api/theme-settings
 *
 * Response:
 * ThemeSettings object or null if not found
 */

export default defineEventHandler(async (event) => {
  try {
    // Get the authenticated user session
    const session = await auth.api.getSession(event);

    // Check if user is authenticated
    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Fetch theme settings for the current user
    const themeSettings = await prisma.themeSettings.findUnique({
      where: { userId: session.user.id },
    });

    // Return theme settings (or null if not found)
    return themeSettings;
  } catch (error: any) {
    // Log error for server-side debugging
    console.error("Error fetching theme settings:", error);

    // Return the error if it's already a properly formatted error
    if (error.statusCode) {
      throw error;
    }

    // Create a generic error for unexpected issues
    throw createError({
      statusCode: 500,
      message: "Failed to fetch theme settings",
    });
  }
});
