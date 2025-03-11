import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to delete a portfolio
 * DELETE /api/portfolio/single
 *
 * Request body:
 * {
 *   slug: string;  // Portfolio slug to delete
 * }
 *
 * Returns the deleted portfolio data
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

    // Parse request body
    const body = await readBody(event);
    const { slug } = body;

    // Validate required fields
    if (!slug || typeof slug !== "string") {
      throw createError({
        statusCode: 400,
        message: "Portfolio slug is required",
      });
    }

    // Check if the portfolio exists and belongs to the user
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      select: { id: true, userId: true },
    });

    if (!portfolio) {
      throw createError({
        statusCode: 404,
        message: "Portfolio not found",
      });
    }

    // Verify ownership
    if (portfolio.userId !== session.user.id) {
      throw createError({
        statusCode: 403,
        message: "You don't have permission to delete this portfolio",
      });
    }

    // Delete the portfolio from database
    const deletedPortfolio = await prisma.portfolio.delete({
      where: { slug },
    });

    // Return success response with deleted portfolio data
    return {
      success: true,
      portfolio: deletedPortfolio,
    };
  } catch (error: any) {
    // Log error and return appropriate error response
    console.error("Error deleting portfolio:", error);

    // Return the error if it's already a handled error
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Error deleting portfolio",
    });
  }
});
