import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const portfolioId = query.portfolioId as string;

  try {
    const projects = await prisma.project.findMany({
      include: {
        portfolioProjects: {
          where: {
            portfolioId,
          },
        },
      },
    });

    console.log(projects);

    const projectsWithLinkStatus = projects.map((project) => ({
      ...project,
      isLinked: project.portfolioProjects.length > 0,
    }));

    return projectsWithLinkStatus;
  } catch (error) {
    return { error: "Failed to fetch projects" };
  }
});
