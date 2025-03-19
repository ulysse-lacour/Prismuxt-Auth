import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Creates a new project tag for the authenticated user
 *
 * @endpoint POST /api/projects/tags
 *
 * @auth Required
 *
 * @body {
 *   name: string - Tag name (required)
 * }
 *
 * @response {
 *   success: boolean - Whether the tag was created successfully
 *   tag: {
 *     id: string - Tag unique identifier
 *     name: string - Tag name
 *     userId: string - Owner's user ID
 *     createdAt: string - Creation timestamp
 *     updatedAt: string - Last update timestamp
 *   }
 * }
 *
 * @error {
 *   400: Bad Request - Missing or invalid tag name
 *   401: Unauthorized - User not authenticated
 *   404: Not Found - User not found
 *   409: Conflict - Tag already exists
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Creates a new tag record in the database
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

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Check if user exists
    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Parse request body
    const body = await readBody(event);
    const { name } = body;

    // Validate tag name
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw createError({
        statusCode: 400,
        message: "Tag name is required",
      });
    }

    // Check if tag already exists for this user
    const existingTag = await prisma.tag.findFirst({
      where: {
        name: name.trim(),
        userId: user.id,
      },
    });

    if (existingTag) {
      throw createError({
        statusCode: 409,
        message: "Tag already exists",
      });
    }

    // Create new tag
    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        userId: user.id,
      },
    });

    // Return created tag
    return {
      success: true,
      tag,
    };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create tag",
      cause: error,
    });
  }
});
