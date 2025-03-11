import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to update a project
 * PUT /api/projects/single
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
    // Parse request body
    const body = await readBody(event);
    const { id, name, description, client } = body;

    // Validate project ID
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    // Update project data in database
    const updatedProject = await prisma.project.update({
      where: { id },
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
