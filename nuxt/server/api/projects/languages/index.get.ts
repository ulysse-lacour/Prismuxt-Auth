import prisma from "~/utils/prisma";

/**
 * API endpoint to fetch all projects languages options
 *
 * Endpoint: GET /api/projects/languages
 *
 * Response:
 * Array of Language objects:
 * [
 *   {
 *     id: string;
 *     code: string;
 *     name: string;
 *     isDefault: boolean;
 *     createdAt: Date;
 *     updatedAt: Date;
 *     userId: string;
 *   },
 *   // ... more languages
 * ]
 *
 * Purpose: Used for project editor to show which languages are available
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
