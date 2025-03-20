import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Adds a project to a portfolio with automatic ordering.
 * The project is added at the end of the portfolio's project list.
 *
 * @endpoint POST /api/portfolios/single/project
 *
 * @auth Required
 *
 * @body {
 *   slug: string - The unique slug of the portfolio to add the project to
 *   relatedProject: string - The ID of the project to add
 * }
 *
 * @response {
 *   success: boolean - Whether the project was added successfully
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
 *   400: Bad Request - Missing required fields or project already linked
 *   401: Unauthorized - User not authenticated
 *   404: Not Found - Portfolio or project not found
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Creates a new PortfolioProject record and updates project order
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
        message: "Project ID is required",
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

    // Check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: relatedProject },
    });

    if (!project) {
      throw createError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    // Check if the project is already linked to this portfolio
    const existingLink = await prisma.portfolioProject.findUnique({
      where: {
        portfolioId_projectId: {
          portfolioId: portfolio.id,
          projectId: relatedProject,
        },
      },
    });

    if (existingLink) {
      throw createError({
        statusCode: 400,
        message: "Project is already linked to this portfolio",
      });
    }

    // Get the count of existing projects to determine the order
    const projectCount = await prisma.portfolioProject.count({
      where: { portfolioId: portfolio.id },
    });

    // Update portfolio by adding the project
    const updatedPortfolio = await prisma.portfolio.update({
      where: { slug },
      data: {
        // Create a new PortfolioProject record
        portfolioProjects: {
          create: {
            projectId: relatedProject,
            order: projectCount, // Set the order based on the current count
          },
        },
      },
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
      message: error.message || "Failed to add project to portfolio",
      cause: error,
    });
  }
});
