import { BlockType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  ]);

  // Create design templates
  const designs = await Promise.all([
    prisma.design.create({
      data: {
        name: "Minimal",
        description: "Clean and minimalistic design layout",
        blocks: {
          create: [
            {
              type: BlockType.HEADER,
              order: 1,
              config: {
                layout: "centered",
                spacing: { top: 8, bottom: 6 },
                typography: { size: "2xl", weight: "bold" },
              },
              blockContent: {
                create: {
                  content: {
                    title: "Project Overview",
                    subtitle: "Key Details",
                  },
                },
              },
            },
            {
              type: BlockType.IMAGE,
              order: 2,
              config: {
                layout: "full-width",
                spacing: { top: 4, bottom: 4 },
              },
              blockContent: {
                create: {
                  content: {
                    imageUrl: "{project.imageUrl}",
                    alt: "Project Preview",
                  },
                },
              },
            },
            {
              type: BlockType.TEXT,
              order: 3,
              config: {
                layout: "narrow",
                spacing: { top: 6, bottom: 6 },
              },
              blockContent: {
                create: {
                  content: {
                    text: "{project.description}",
                    alignment: "left",
                  },
                },
              },
            },
          ],
        },
      },
    }),
    prisma.design.create({
      data: {
        name: "Modern",
        description: "Contemporary design with bold elements",
        blocks: {
          create: [
            {
              type: BlockType.HEADER,
              order: 1,
              config: {
                layout: "full-width",
                spacing: { top: 0, bottom: 8 },
                background: { color: "gray-900" },
              },
              blockContent: {
                create: {
                  content: {
                    title: "{project.name}",
                    subtitle: "Client: {project.client}",
                  },
                },
              },
            },
            {
              type: BlockType.QUOTE,
              order: 2,
              config: {
                layout: "centered",
                spacing: { top: 8, bottom: 8 },
              },
              blockContent: {
                create: {
                  content: {
                    quote: "Project highlight or key achievement",
                    author: "{project.client}",
                  },
                },
              },
            },
            {
              type: BlockType.TEXT,
              order: 3,
              config: {
                layout: "wide",
                spacing: { top: 6, bottom: 6 },
              },
              blockContent: {
                create: {
                  content: {
                    text: "{project.description}",
                    alignment: "justify",
                  },
                },
              },
            },
          ],
        },
      },
    }),
  ]);

  // Create a portfolio
  const portfolio = await prisma.portfolio.create({
    data: {
      name: "Main Portfolio",
      description: "Showcase of my best work",
      isPublic: true,
      slug: "ulysse-portfolio",
      userId: user.id,
      projects: {
        create: [
          {
            order: 1,
            projectId: projects[0].id,
            designId: designs[0].id,
          },
          // {
          //   order: 2,
          //   projectId: projects[1].id,
          //   designId: designs[1].id,
          // },
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
