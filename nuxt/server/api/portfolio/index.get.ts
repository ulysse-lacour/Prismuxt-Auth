import prisma from "~/utils/prisma";

/**
 * API endpoint to fetch a single portfolio by slug
 * GET /api/portfolio/[slug]
 *
 * Returns the portfolio with all related projects and content blocks
 */

export default defineEventHandler(async (event) => {
  // Extract portfolio slug from query parameters
  const { slug } = getQuery(event);
  const portfolioSlug = Array.isArray(slug) ? slug[0] : slug;

  // Validate portfolio slug
  if (!portfolioSlug) {
    throw createError({
      statusCode: 400,
      message: "Portfolio slug is required",
    });
  }

  try {
    // Fetch portfolio with related data from database
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug: portfolioSlug },
      include: {
        portfolioProjects: {
          include: {
            project: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // Return 404 if portfolio not found
    if (!portfolio) {
      throw createError({
        statusCode: 404,
        message: "Portfolio not found",
      });
    }

    // Return portfolio data
    return { portfolio };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch portfolio",
      cause: error,
    });
  }
});
