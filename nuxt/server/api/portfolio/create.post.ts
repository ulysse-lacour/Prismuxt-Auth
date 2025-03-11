import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const session = await auth.api.getSession(event);

    if (!session) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const body = await readBody(event);
    const { name, description } = body;

    // Update project data
    const createdPortfolio = await prisma.portfolio.create({
      data: {
        slug: name
          .toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
          .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
          .replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
          .slice(0, 50), // Limit slug length to 50 characters
        name,
        description,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return {
      success: true,
      portfolio: createdPortfolio,
    };
  } catch (error) {
    console.error("Error updating portfolio:", error);
    throw createError({
      statusCode: 500,
      message: "Error updating portfolio",
    });
  }
});
