import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Fetches all available project languages
 *
 * @endpoint GET /api/projects/languages
 *
 * @auth Not Required
 *
 * @response {
 *   languages: Array<{
 *     id: string - Language unique identifier
 *     code: string - Language code (e.g., 'en', 'fr')
 *     name: string - Language display name
 *     isDefault: boolean - Whether this is the default language
 *     createdAt: string - Creation timestamp
 *     updatedAt: string - Last update timestamp
 *     userId: string - Owner's user ID
 *   }>
 * }
 *
 * @error {
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @purpose Used for project editor to show which languages are available
 */

export default defineEventHandler(async (event) => {
  try {
    // Fetch all languages from the database
    const languages = await prisma.language.findMany();

    // Return languages to client
    return languages;
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch languages",
      cause: error,
    });
  }
});
