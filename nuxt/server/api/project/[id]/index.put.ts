import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to update a project
 * PUT /api/project/<id>
 *
 * Request body:
 * {
 *   id: string;
 *   name?: string;
 *   description?: string;
 *   client?: string;
 * }
 */

// Initialize Prisma client
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Get project ID from route params
    const projectId = event.context.params?.id;

    if (!projectId) {
      throw createError({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    // Parse request body
    const body = await readBody(event);
    const { name, description, client } = body;

    // Update project data in database
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(client !== undefined && { client }),
      },
    });

    // Return success response with updated project
    return {
      success: true,
      project: updatedProject,
    };
  } catch (error: any) {
    // Handle specific Prisma errors
    if (error.code === "P2025") {
      throw createError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    // Log error and return appropriate error response
    console.error("Error updating project:", error);
    throw createError({
      statusCode: 500,
      message: "Error updating project",
    });
  }
});
