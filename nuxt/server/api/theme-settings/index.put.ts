import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to update theme settings for the current user
 * PUT /api/theme-settings
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
 * Updated ThemeSettings object
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

    // Parse request body
    const body = await readBody(event);

    // Check if settings exist
    const existingSettings = await prisma.themeSettings.findUnique({
      where: { userId },
    });

    let themeSettings;

    if (!existingSettings) {
      // Create new settings if they don't exist
      themeSettings = await prisma.themeSettings.create({
        data: {
          ...body,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } else {
      // Update existing settings
      themeSettings = await prisma.themeSettings.update({
        where: { userId },
        data: body,
      });
    }

    // Return updated theme settings
    return themeSettings;
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update theme settings",
      cause: error,
    });
  }
});
