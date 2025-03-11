import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds the database with initial data.
 *
 * This asynchronous function is a placeholder intended to seed the database.
 * Currently, it logs a success message and should be updated with actual data insertion logic.
 */
async function seed() {
  // Create a test user with hashed password
  const user = await prisma.user.create({
    data: {
      name: "Ulysse Lacour",
      email: "ulysse@eps51.de",
      emailVerified: true,
      Account: {
        create: {
          accountId: "credentials",
          providerId: "credentials",
          password: "password1234",
        },
      },
    },
  });

  // Create some projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: "E-commerce Website",
        description: "A modern e-commerce platform built with Vue and Nuxt",
        client: "Fashion Store Inc.",
        date: "2023",
        tags: ["Vue", "Nuxt", "E-commerce"],
        imageUrl: "/images/projects/ecommerce.jpg",
        userId: user.id,
      },
    }),
    prisma.project.create({
      data: {
        name: "Mobile Banking App",
        description: "Secure and intuitive mobile banking application",
        client: "Digital Bank Ltd",
        date: "2024",
        tags: ["Mobile", "Fintech", "UX Design"],
        imageUrl: "/images/projects/banking.jpg",
        userId: user.id,
      },
    }),
    prisma.project.create({
      data: {
        name: "Healthcare Dashboard",
        description: "Interactive dashboard for healthcare professionals",
        client: "MediCare Solutions",
        date: "2023",
        tags: ["Dashboard", "Healthcare", "Data Visualization"],
        imageUrl: "/images/projects/healthcare.jpg",
        userId: user.id,
      },
    }),
    prisma.project.create({
      data: {
        name: "Travel Booking Platform",
        description: "Comprehensive travel booking solution with real-time availability",
        client: "Wanderlust Travels",
        date: "2024",
        tags: ["Travel", "Booking", "Maps Integration"],
        imageUrl: "/images/projects/travel.jpg",
        userId: user.id,
      },
    }),
  ]);

  // Create a portfolio
  const mainPortfolio = await prisma.portfolio.create({
    data: {
      name: "Main Portfolio",
      description: "Showcase of my best work",
      isPublic: true,
      slug: "ulysse-portfolio",
      userId: user.id,
      portfolioProjects: {
        create: [
          {
            order: 1,
            projectId: projects[0].id,
          },
          {
            order: 2,
            projectId: projects[1].id,
          },
        ],
      },
    },
  });

  // Create a second portfolio
  const designPortfolio = await prisma.portfolio.create({
    data: {
      name: "Design Portfolio",
      description: "Showcasing my design-focused projects",
      isPublic: true,
      slug: "ulysse-design-portfolio",
      userId: user.id,
      portfolioProjects: {
        create: [
          {
            order: 1,
            projectId: projects[2].id,
          },
          {
            order: 2,
            projectId: projects[3].id,
          },
        ],
      },
    },
  });

  console.log("Seed data created successfully");
}

try {
  await seed();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
