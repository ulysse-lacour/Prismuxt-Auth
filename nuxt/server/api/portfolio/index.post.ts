import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Creates a new portfolio for the authenticated user with an auto-generated
 * URL-friendly slug
 *
 * @endpoint POST /api/portfolio
 *
 * @auth Required
 *
 * @body {
 *   name: string - Portfolio name (required)
 *   description?: string - Optional portfolio description
 * }
 *
 * @response {
 *   id: string - Portfolio unique identifier
 *   name: string - Portfolio name
 *   description: string | null - Portfolio description
 *   isPublic: boolean - Portfolio visibility status
 *   slug: string - Auto-generated URL-friendly identifier
 *   createdAt: string - Creation timestamp
 *   updatedAt: string - Last update timestamp
 *   userId: string - Owner's user ID
 * }
 *
 * @error {
 *   400: Bad Request - Invalid or missing portfolio name
 *   401: Unauthorized - User not authenticated
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Creates a new portfolio record in the database
 */

// Utils functions
/**
 * Generate a URL-friendly slug from a string
 *
 * Converts a string to a URL-friendly format by:
 * - Converting to lowercase
 * - Removing diacritics (accent marks)
 * - Replacing non-alphanumeric characters with dashes
 * - Removing leading and trailing dashes
 * - Limiting length to 50 characters
 *
 * @param input - The string to convert to a slug
 * @returns A URL-friendly slug
 */
const generateSlug = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // Remove diacritics using Unicode Mark property
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
    .slice(0, 50); // Limit slug length to 50 characters
};

// API endpoint
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

    // Parse and extract portfolio data from request body
    const body = await readBody(event);
    const { name, description } = body;

    // Validate portfolio name is provided and properly formatted
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw createError({
        statusCode: 400,
        message: "Valid portfolio name is required",
      });
    }

    // Generate base slug from portfolio name
    const baseSlug = generateSlug(name);

    // Check if slug already exists to ensure uniqueness
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug: baseSlug },
    });

    // If slug exists, append a random string to make it unique
    const slug = existingPortfolio
      ? `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`
      : baseSlug;

    // Create new portfolio in database with relationship to user
    const createdPortfolio = await prisma.portfolio.create({
      data: {
        slug,
        name: name.trim(),
        description,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    // Return the created portfolio to client
    return createdPortfolio;
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create portfolio",
      cause: error,
    });
  }
});
