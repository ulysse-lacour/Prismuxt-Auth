import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to create a new portfolio
 * POST /api/portfolio/create
 *
 * Request body:
 * {
 *   name: string;
 *   description?: string;
 * }
 *
 * Returns the created portfolio
 * Requires authentication
 */

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Generate a URL-friendly slug from a string
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

export default defineEventHandler(async (event) => {
  try {
    // Verify user authentication
    const session = await auth.api.getSession(event);

    if (!session) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Parse request body
    const body = await readBody(event);
    const { name, description } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw createError({
        statusCode: 400,
        message: "Valid portfolio name is required",
      });
    }

    // Generate slug from name
    const baseSlug = generateSlug(name);

    // Check if slug already exists and generate a unique one if needed
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug: baseSlug },
    });

    // If slug exists, append a random string
    const slug = existingPortfolio
      ? `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`
      : baseSlug;

    // Create new portfolio in database
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

    // Return success response with created portfolio
    return {
      success: true,
      portfolio: createdPortfolio,
    };
  } catch (error: any) {
    // Log error and return appropriate error response
    console.error("Error creating portfolio:", error);

    // Return the error if it's already a handled error
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Error creating portfolio",
    });
  }
});
