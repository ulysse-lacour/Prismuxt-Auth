import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to delete a portfolio
 * DELETE /api/portfolio
 *
 * Returns the deleted portfolio data
 *
 * Authentication: Required (user must be logged in)
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

    // Check if the portfolio exists and belongs to the user
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug: portfolioSlug },
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
      where: { slug: portfolioSlug },
    });

    // Return success response with deleted portfolio data
    return {
      success: true,
      portfolio: deletedPortfolio,
    };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to delete portfolio",
      cause: error,
    });
  }
});
