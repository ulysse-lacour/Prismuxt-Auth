import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Creates new theme settings for the current user, including
 * visual preferences and company information
 *
 * @endpoint POST /api/theme-settings
 *
 * @auth Required
 *
 * @body {
 *   logoUrl?: string - URL of the company logo
 *   headingFont?: string - Font family for headings
 *   bodyFont?: string - Font family for body text
 *   backgroundColor?: string - Background color hex code
 *   textColor?: string - Text color hex code
 *   accentColor?: string - Accent color hex code
 *   secondaryColor?: string - Secondary color hex code
 *   companyName?: string - Company display name
 *   companyDescription?: string - Company description
 *   companyEmail?: string - Company contact email
 *   companyPhone?: string - Company contact phone
 *   companyAddress?: string - Company physical address
 *   defaultLanguageId?: string - Default language identifier
 * }
 *
 * @response {
 *   id: string - Settings unique identifier
 *   userId: string - Associated user ID
 *   // ... all fields from request body
 *   createdAt: string - Creation timestamp
 *   updatedAt: string - Last update timestamp
 * }
 *
 * @error {
 *   400: Bad Request - Theme settings already exist
 *   401: Unauthorized - User not authenticated
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Creates a new theme settings record in the database
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
