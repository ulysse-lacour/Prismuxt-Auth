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
    // Check if user is authenticated
    const session = await auth.api.getSession(event);
    if (!session?.user?.email) {
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
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch theme settings",
      cause: error,
    });
  }
});
