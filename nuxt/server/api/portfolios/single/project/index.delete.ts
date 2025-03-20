import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Removes a project from a portfolio and reorders remaining projects
 *
 * @endpoint DELETE /api/portfolio/project
 *
 * @auth Required
 *
 * @body {
 *   slug: string - The unique slug of the portfolio to remove the project from
 *   relatedProject: string - The ID of the PortfolioProject relationship to remove
 * }
 *
 * @response {
 *   success: boolean - Whether the project was removed successfully
 *   portfolio: {
 *     id: string - Portfolio unique identifier
 *     portfolioProjects: Array<{
 *       project: Project - Associated project data
 *       order: number - Display order in portfolio
 *     }>
 *     // ... other portfolio properties
 *   }
 * }
 *
 * @error {
 *   400: Bad Request - Missing required fields
 *   401: Unauthorized - User not authenticated
 *   404: Not Found - Portfolio or project link not found
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Deletes the PortfolioProject record and reorders remaining projects
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

    // Parse request body
    const body = await readBody(event);
    const { slug, relatedProject } = body;

    // Validate required fields
    if (!slug || typeof slug !== "string") {
      throw createError({
        statusCode: 400,
        message: "Portfolio slug is required",
      });
    }

    if (!relatedProject || typeof relatedProject !== "string") {
      throw createError({
        statusCode: 400,
        message: "PortfolioProject ID is required",
      });
    }

    // Check if the portfolio exists
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!portfolio) {
      throw createError({
        statusCode: 404,
        message: "Portfolio not found",
      });
    }

    // Check if the portfolio project relationship exists
    const portfolioProject = await prisma.portfolioProject.findUnique({
      where: {
        id: relatedProject,
      },
    });

    if (!portfolioProject) {
      throw createError({
        statusCode: 404,
        message: "Project link not found in this portfolio",
      });
    }

    // Delete the portfolio project relationship
    await prisma.portfolioProject.delete({
      where: {
        id: relatedProject,
      },
    });

    // Reorder remaining projects to ensure no gaps in order
    const remainingProjects = await prisma.portfolioProject.findMany({
      where: {
        portfolioId: portfolio.id,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Update order for each remaining project
    for (let i = 0; i < remainingProjects.length; i++) {
      await prisma.portfolioProject.update({
        where: {
          id: remainingProjects[i].id,
        },
        data: {
          order: i,
        },
      });
    }

    // Get the updated portfolio with all its projects
    const updatedPortfolio = await prisma.portfolio.findUnique({
      where: { slug },
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

    // Return success response with updated portfolio
    return {
      success: true,
      portfolio: updatedPortfolio,
    };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to remove project from portfolio",
      cause: error,
    });
  }
});
