import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to update a portfolio's basic information
 * PUT /api/portfolio/single
 *
 * Request body:
 * {
 *   name?: string;       // New portfolio name
 *   description?: string; // New portfolio description
 * }
 *
 * Returns the updated portfolio
 * Requires authentication
 */

// Initialize Prisma client
const prisma = new PrismaClient();

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

    // Extract portfolio slug from query parameters
    const { slug } = getQuery(event);
    const portfolioSlug = Array.isArray(slug) ? slug[0] : slug;

    // Validate required fields
    if (!portfolioSlug || typeof portfolioSlug !== "string") {
      throw createError({
        statusCode: 400,
        message: "Portfolio slug is required",
      });
    }

    // Parse request body
    const body = await readBody(event);
    const { name, description } = body;

    // Ensure at least one field to update is provided
    if ((!name || name.trim() === "") && description === undefined) {
      throw createError({
        statusCode: 400,
        message: "At least one field to update must be provided",
      });
    }

    // Check if the portfolio exists
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug: portfolioSlug },
      select: { id: true },
    });

    if (!portfolio) {
      throw createError({
        statusCode: 404,
        message: "Portfolio not found",
      });
    }

    // Prepare update data with only provided fields
    const updateData: { name?: string; description?: string } = {};

    if (name !== undefined && name.trim() !== "") {
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    // Update portfolio basic data in database
    const updatedPortfolio = await prisma.portfolio.update({
      where: { slug: portfolioSlug },
      data: updateData,
    });

    // Return success response with updated portfolio
    return {
      success: true,
      portfolio: updatedPortfolio,
    };
  } catch (error: any) {
    // Log error and return appropriate error response
    console.error("Error updating portfolio:", error);

    // Return the error if it's already a handled error
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Error updating portfolio",
    });
  }
});
