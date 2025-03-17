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
    // Get the authenticated user session
    const session = await auth.api.getSession(event);

    // Check if user is authenticated
    if (!session?.user?.id) {
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
    console.error("Error creating theme settings:", error);

    // Return the error if it's already a properly formatted error
    if (error.statusCode) {
      throw error;
    }

    // Create a generic error for unexpected issues
    throw createError({
      statusCode: 500,
      message: "Failed to create theme settings",
    });
  }
});
