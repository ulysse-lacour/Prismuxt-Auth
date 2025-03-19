import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to create theme settings for the current user
 * POST /api/theme-settings
 *
 * Request body:
 * {
 *   logoUrl?: string;
 *   headingFont?: string;
 *   bodyFont?: string;
 *   backgroundColor?: string;
 *   textColor?: string;
 *   accentColor?: string;
 *   secondaryColor?: string;
 *   companyName?: string;
 *   companyDescription?: string;
 *   companyEmail?: string;
 *   companyPhone?: string;
 *   companyAddress?: string;
 *   defaultLanguageId?: string;
 * }
 *
 * Response:
 * Created ThemeSettings object
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

    const userId = session.user.id;

    // Check if settings already exist
    const existingSettings = await prisma.themeSettings.findUnique({
      where: { userId },
    });

    if (existingSettings) {
      throw createError({
        statusCode: 400,
        message: "Theme settings already exist. Use PUT to update.",
      });
    }

    // Parse request body
    const body = await readBody(event);

    // Create theme settings in database
    const themeSettings = await prisma.themeSettings.create({
      data: {
        ...body,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // Return created theme settings
    return themeSettings;
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create theme settings",
      cause: error,
    });
  }
});
