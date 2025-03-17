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
    console.error("Error updating theme settings:", error);

    // Return the error if it's already a properly formatted error
    if (error.statusCode) {
      throw error;
    }

    // Create a generic error for unexpected issues
    throw createError({
      statusCode: 500,
      message: "Failed to update theme settings",
    });
  }
});
