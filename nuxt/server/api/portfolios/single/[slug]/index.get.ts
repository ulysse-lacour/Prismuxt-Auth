import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Fetches a single portfolio by its slug, including all related projects
 * in ordered sequence. This endpoint is publicly accessible.
 *
 * @endpoint GET /api/portfolios/single/[slug]
 *
 * @auth Not Required
 *
 * @params {
 *   slug: string - The unique slug of the portfolio to fetch
 * }
 *
 * @response {
 *   portfolio: {
 *     id: string - Portfolio unique identifier
 *     slug: string - Portfolio URL slug
 *     name: string - Portfolio name
 *     description: string | null - Portfolio description
 *     portfolioProjects: Array<{
 *       project: Project - Associated project data
 *       order: number - Display order in portfolio
 *     }>
 *     // ... other portfolio properties
 *   }
 * }
 *
 * @error {
 *   400: Bad Request - Portfolio slug is required
 *   404: Not Found - Portfolio not found
 *   500: Internal Server Error - Server-side error
 * }
 */

export default defineEventHandler(async (event) => {
  // Extract portfolio slug from query parameters
  const slug = getRouterParam(event, "slug");

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
    return { portfolio: portfolio as PortfolioDetails };
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
