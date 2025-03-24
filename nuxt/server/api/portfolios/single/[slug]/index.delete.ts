import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Deletes a portfolio and all its associated data, including project relationships.
 * This operation is irreversible and requires authentication.
 *
 * @endpoint DELETE /api/portfolios/single/[slug]
 *
 * @auth Required
 *
 * @params {
 *   slug: string - The unique slug of the portfolio to delete
 * }
 *
 * @response {
 *   success: boolean - Whether the deletion was successful
 *   portfolio: {
 *     id: string - Portfolio unique identifier
 *     name: string - Portfolio name
 *     description: string | null - Portfolio description
 *     slug: string - Portfolio URL slug
 *     // ... other portfolio properties
 *   }
 * }
 *
 * @error {
 *   400: Bad Request - Missing portfolio slug
 *   401: Unauthorized - User not authenticated
 *   403: Forbidden - User doesn't own the portfolio
 *   404: Not Found - Portfolio not found
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Deletes the portfolio and all related records from the database
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
    const portfolioSlug = getRouterParam(event, "slug");

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

    // Return portfolio data
    return { deletedPortfolio: deletedPortfolio as PortfolioDetails };
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
