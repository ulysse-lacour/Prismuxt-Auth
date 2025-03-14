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

  // Create tags first
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        name: "Vue",
        userId: user.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Nuxt",
        userId: user.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "E-commerce",
        userId: user.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Mobile",
        userId: user.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Fintech",
        userId: user.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "UX Design",
        userId: user.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Dashboard",
        userId: user.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Healthcare",
        userId: user.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Data Visualization",
        userId: user.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Travel",
        userId: user.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Booking",
        userId: user.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Maps Integration",
        userId: user.id,
      },
    }),
  ]);

  // Create projects with tag connections
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: "E-commerce Website",
        description: "A modern e-commerce platform built with Vue and Nuxt",
        client: "Fashion Store Inc.",
        date: "2023",
        imageUrl: "/images/projects/ecommerce.jpg",
        userId: user.id,
        projectTags: {
          create: [
            { tagId: tags[0].id }, // Vue
            { tagId: tags[1].id }, // Nuxt
            { tagId: tags[2].id }, // E-commerce
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        name: "Mobile Banking App",
        description: "Secure and intuitive mobile banking application",
        client: "Digital Bank Ltd",
        date: "2024",
        imageUrl: "/images/projects/banking.jpg",
        userId: user.id,
        projectTags: {
          create: [
            { tagId: tags[3].id }, // Mobile
            { tagId: tags[4].id }, // Fintech
            { tagId: tags[5].id }, // UX Design
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        name: "Healthcare Dashboard",
        description: "Interactive dashboard for healthcare professionals",
        client: "MediCare Solutions",
        date: "2023",
        imageUrl: "/images/projects/healthcare.jpg",
        userId: user.id,
        projectTags: {
          create: [
            { tagId: tags[6].id }, // Dashboard
            { tagId: tags[7].id }, // Healthcare
            { tagId: tags[8].id }, // Data Visualization
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        name: "Travel Booking Platform",
        description: "Comprehensive travel booking solution with real-time availability",
        client: "Wanderlust Travels",
        date: "2024",
        imageUrl: "/images/projects/travel.jpg",
        userId: user.id,
        projectTags: {
          create: [
            { tagId: tags[9].id }, // Travel
            { tagId: tags[10].id }, // Booking
            { tagId: tags[11].id }, // Maps Integration
          ],
        },
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
