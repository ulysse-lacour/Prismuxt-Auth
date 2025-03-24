import { auth } from "~/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Fetches all portfolios of the current user
 *
 * @endpoint GET /api/portfolios
 *
 * @auth Required
 *
 * @response {
 *   portfolios: Array<{
 *     id: string - Portfolio unique identifier
 *     name: string - Portfolio name
 *     description: string - Portfolio description
 *     portfolioProjects: Array<{
 *       project: ProjectWithTags
 *     }>
 *   }>
 * }
 *
 * @error {
 *   401: Unauthorized - User is not authenticated
 *   500: Internal Server Error - Server-side error
 * }
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

    // Fetch all portfolios
    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        portfolioProjects: {
          include: {
            project: {
              include: {
                projectTags: {
                  include: {
                    tag: true,
                  },
                },
                projectContents: true,
              },
            },
          },
        },
      },
    });

    // Return portfolios with proper typing
    return portfolios as PortfolioDetails[];
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch portfolios",
      cause: error,
    });
  }
});
