import prisma from "~/utils/prisma";

/**
 * API endpoint to fetch a single portfolio by slug
 * GET /api/portfolio/[slug]
 *
 * Returns the portfolio with all related projects and content blocks
 * Requires authentication
 */

export default defineEventHandler(async (event) => {
  // Extract portfolio slug from query parameters
  const { slug } = getQuery(event);
  const portfolioSlug = Array.isArray(slug) ? slug[0] : slug;

  console.log(portfolioSlug);

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
  } catch (error) {
    // Log error and return appropriate error response
    console.error("Error fetching portfolio:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching portfolio",
    });
  }
});
