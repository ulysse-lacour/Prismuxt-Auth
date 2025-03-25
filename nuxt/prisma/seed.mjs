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

  // Create languages
  const languages = await Promise.all([
    prisma.language.create({
      data: {
        code: "en",
        name: "English",
        isDefault: true,
        userId: user.id,
      },
    }),
    prisma.language.create({
      data: {
        code: "de",
        name: "Deutsch",
        isDefault: false,
        userId: user.id,
      },
    }),
  ]);

  // Create theme settings
  const themeSettings = await prisma.themeSettings.create({
    data: {
      logoUrl: "/images/logo.svg",
      headingFont: "Inter",
      bodyFont: "Roboto",
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      accentColor: "#3b82f6",
      secondaryColor: "#10b981",
      companyName: "Ulysse Lacour Design",
      companyDescription: "Creative digital solutions for modern businesses",
      companyEmail: "contact@ulysselacour.com",
      companyPhone: "+49 123 456 7890",
      companyAddress: "Kreuzberg, Berlin, Germany",
      defaultLanguageId: languages[0].id, // English as default
      userId: user.id,
    },
  });

  // Create slide tags
  const slideTags = await Promise.all([
    prisma.slideTag.create({
      data: {
        name: "Introduction",
        userId: user.id,
      },
    }),
    prisma.slideTag.create({
      data: {
        name: "Overview",
        userId: user.id,
      },
    }),
    prisma.slideTag.create({
      data: {
        name: "Detail",
        userId: user.id,
      },
    }),
    prisma.slideTag.create({
      data: {
        name: "Showcase",
        userId: user.id,
      },
    }),
    prisma.slideTag.create({
      data: {
        name: "Testimonial",
        userId: user.id,
      },
    }),
    prisma.slideTag.create({
      data: {
        name: "Technical",
        userId: user.id,
      },
    }),
    prisma.slideTag.create({
      data: {
        name: "Results",
        userId: user.id,
      },
    }),
    prisma.slideTag.create({
      data: {
        name: "Process",
        userId: user.id,
      },
    }),
  ]);

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
        order: 1,
        userId: user.id,
        projectTags: {
          create: [
            { tagId: tags[0].id }, // Vue
            { tagId: tags[1].id }, // Nuxt
            { tagId: tags[2].id }, // E-commerce
          ],
        },
        projectContents: {
          create: [
            // English content
            {
              title: "E-commerce Website",
              description: "A modern e-commerce platform built with Vue and Nuxt",
              languageId: languages[0].id, // English
              contentBlocks: {
                create: [
                  {
                    type: "HEADER",
                    order: 1,
                    config: {
                      align: "center",
                      size: "large",
                    },
                    content: {
                      text: "Fashion Store E-commerce Platform",
                    },
                    slideTagId: slideTags[0].id, // Introduction
                  },
                  {
                    type: "TEXT",
                    order: 2,
                    config: {
                      align: "left",
                    },
                    content: {
                      text: "This project involved creating a complete e-commerce solution for a fashion retailer. The platform includes product browsing, user accounts, cart functionality, and secure checkout.",
                    },
                    slideTagId: slideTags[1].id, // Overview
                  },
                  {
                    type: "IMAGE",
                    order: 3,
                    config: {
                      width: "full",
                      height: "auto",
                    },
                    content: {
                      src: "/images/projects/ecommerce-detail.jpg",
                      alt: "E-commerce platform dashboard",
                    },
                    slideTagId: slideTags[3].id, // Showcase
                  },
                  {
                    type: "QUOTE",
                    order: 4,
                    config: {
                      style: "modern",
                    },
                    content: {
                      text: "The new platform increased our online sales by 45% in the first quarter after launch.",
                      author: "Marketing Director, Fashion Store Inc.",
                    },
                    slideTagId: slideTags[4].id, // Testimonial
                  },
                ],
              },
            },
            // German content
            {
              title: "E-Commerce-Website",
              description: "Eine moderne E-Commerce-Plattform, entwickelt mit Vue und Nuxt",
              languageId: languages[1].id, // German
              contentBlocks: {
                create: [
                  {
                    type: "HEADER",
                    order: 1,
                    config: {
                      align: "center",
                      size: "large",
                    },
                    content: {
                      text: "Fashion Store E-Commerce-Plattform",
                    },
                    slideTagId: slideTags[0].id, // Introduction
                  },
                  {
                    type: "TEXT",
                    order: 2,
                    config: {
                      align: "left",
                    },
                    content: {
                      text: "Dieses Projekt umfasste die Erstellung einer kompletten E-Commerce-Lösung für einen Modehändler. Die Plattform umfasst Produktbrowsing, Benutzerkonten, Warenkorbfunktionalität und sicheres Checkout.",
                    },
                    slideTagId: slideTags[1].id, // Overview
                  },
                  {
                    type: "IMAGE",
                    order: 3,
                    config: {
                      width: "full",
                      height: "auto",
                    },
                    content: {
                      src: "/images/projects/ecommerce-detail.jpg",
                      alt: "E-Commerce-Plattform-Dashboard",
                    },
                    slideTagId: slideTags[3].id, // Showcase
                  },
                  {
                    type: "QUOTE",
                    order: 4,
                    config: {
                      style: "modern",
                    },
                    content: {
                      text: "Die neue Plattform steigerte unseren Online-Umsatz im ersten Quartal nach dem Start um 45%.",
                      author: "Marketing Direktor, Fashion Store Inc.",
                    },
                    slideTagId: slideTags[4].id, // Testimonial
                  },
                ],
              },
            },
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
        order: 2,
        userId: user.id,
        projectTags: {
          create: [
            { tagId: tags[3].id }, // Mobile
            { tagId: tags[4].id }, // Fintech
            { tagId: tags[5].id }, // UX Design
          ],
        },
        projectContents: {
          create: [
            // English content
            {
              title: "Mobile Banking App",
              description: "Secure and intuitive mobile banking application",
              languageId: languages[0].id, // English
              contentBlocks: {
                create: [
                  {
                    type: "HEADER",
                    order: 1,
                    config: {
                      align: "center",
                      size: "large",
                    },
                    content: {
                      text: "Digital Bank Mobile Application",
                    },
                    slideTagId: slideTags[0].id, // Introduction
                  },
                  {
                    type: "TEXT",
                    order: 2,
                    config: {
                      align: "left",
                    },
                    content: {
                      text: "We developed a secure, user-friendly mobile banking application that allows customers to manage their finances on the go. The app includes features like account management, transfers, bill payments, and investment tracking.",
                    },
                    slideTagId: slideTags[2].id, // Detail
                  },
                  {
                    type: "IMAGE",
                    order: 3,
                    config: {
                      width: "full",
                      height: "auto",
                    },
                    content: {
                      src: "/images/projects/banking-detail.jpg",
                      alt: "Mobile banking app interface",
                    },
                    slideTagId: slideTags[3].id, // Showcase
                  },
                ],
              },
            },
            // German content
            {
              title: "Mobile Banking-App",
              description: "Sichere und intuitive mobile Banking-Anwendung",
              languageId: languages[1].id, // German
              contentBlocks: {
                create: [
                  {
                    type: "HEADER",
                    order: 1,
                    config: {
                      align: "center",
                      size: "large",
                    },
                    content: {
                      text: "Digital Bank Mobile Anwendung",
                    },
                    slideTagId: slideTags[0].id, // Introduction
                  },
                  {
                    type: "TEXT",
                    order: 2,
                    config: {
                      align: "left",
                    },
                    content: {
                      text: "Wir haben eine sichere, benutzerfreundliche mobile Banking-Anwendung entwickelt, mit der Kunden ihre Finanzen unterwegs verwalten können. Die App umfasst Funktionen wie Kontoverwaltung, Überweisungen, Rechnungszahlungen und Anlageverfolgung.",
                    },
                    slideTagId: slideTags[2].id, // Detail
                  },
                  {
                    type: "IMAGE",
                    order: 3,
                    config: {
                      width: "full",
                      height: "auto",
                    },
                    content: {
                      src: "/images/projects/banking-detail.jpg",
                      alt: "Mobile-Banking-App-Schnittstelle",
                    },
                    slideTagId: slideTags[3].id, // Showcase
                  },
                ],
              },
            },
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
        order: 3,
        userId: user.id,
        projectTags: {
          create: [
            { tagId: tags[6].id }, // Dashboard
            { tagId: tags[7].id }, // Healthcare
            { tagId: tags[8].id }, // Data Visualization
          ],
        },
        projectContents: {
          create: [
            // English content only for this project
            {
              title: "Healthcare Dashboard",
              description: "Interactive dashboard for healthcare professionals",
              languageId: languages[0].id, // English
              contentBlocks: {
                create: [
                  {
                    type: "HEADER",
                    order: 1,
                    config: {
                      align: "center",
                      size: "large",
                    },
                    content: {
                      text: "MediCare Solutions Dashboard",
                    },
                    slideTagId: slideTags[0].id, // Introduction
                  },
                  {
                    type: "TEXT",
                    order: 2,
                    config: {
                      align: "left",
                    },
                    content: {
                      text: "An advanced dashboard for healthcare professionals to monitor patient data, track treatments, and analyze outcomes. The system includes real-time alerts and comprehensive reporting tools.",
                    },
                    slideTagId: slideTags[5].id, // Technical
                  },
                  {
                    type: "IMAGE",
                    order: 3,
                    config: {
                      width: "full",
                      height: "auto",
                    },
                    content: {
                      src: "/images/projects/healthcare-detail.jpg",
                      alt: "Healthcare dashboard interface",
                    },
                    slideTagId: slideTags[3].id, // Showcase
                  },
                ],
              },
            },
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
        order: 4,
        userId: user.id,
        projectTags: {
          create: [
            { tagId: tags[9].id }, // Travel
            { tagId: tags[10].id }, // Booking
            { tagId: tags[11].id }, // Maps Integration
          ],
        },
        projectContents: {
          create: [
            // English content
            {
              title: "Travel Booking Platform",
              description: "Comprehensive travel booking solution with real-time availability",
              languageId: languages[0].id, // English
              contentBlocks: {
                create: [
                  {
                    type: "HEADER",
                    order: 1,
                    config: {
                      align: "center",
                      size: "large",
                    },
                    content: {
                      text: "Wanderlust Travel Booking System",
                    },
                    slideTagId: slideTags[0].id, // Introduction
                  },
                  {
                    type: "TEXT",
                    order: 2,
                    config: {
                      align: "left",
                    },
                    content: {
                      text: "A complete travel booking platform that allows users to search, compare, and book flights, hotels, and experiences. The system integrates with multiple providers to offer real-time availability and competitive pricing.",
                    },
                    slideTagId: slideTags[7].id, // Process
                  },
                  {
                    type: "IMAGE",
                    order: 3,
                    config: {
                      width: "full",
                      height: "auto",
                    },
                    content: {
                      src: "/images/projects/travel-detail.jpg",
                      alt: "Travel booking platform interface",
                    },
                    slideTagId: slideTags[6].id, // Results
                  },
                ],
              },
            },
            // German content
            {
              title: "Reisebuchungsplattform",
              description: "Umfassende Reisebuchungslösung mit Echtzeit-Verfügbarkeit",
              languageId: languages[1].id, // German
              contentBlocks: {
                create: [
                  {
                    type: "HEADER",
                    order: 1,
                    config: {
                      align: "center",
                      size: "large",
                    },
                    content: {
                      text: "Wanderlust Reisebuchungssystem",
                    },
                    slideTagId: slideTags[0].id, // Introduction
                  },
                  {
                    type: "TEXT",
                    order: 2,
                    config: {
                      align: "left",
                    },
                    content: {
                      text: "Eine komplette Reisebuchungsplattform, mit der Benutzer Flüge, Hotels und Erlebnisse suchen, vergleichen und buchen können. Das System ist mit mehreren Anbietern integriert, um Echtzeit-Verfügbarkeit und wettbewerbsfähige Preise anzubieten.",
                    },
                    slideTagId: slideTags[7].id, // Process
                  },
                  {
                    type: "IMAGE",
                    order: 3,
                    config: {
                      width: "full",
                      height: "auto",
                    },
                    content: {
                      src: "/images/projects/travel-detail.jpg",
                      alt: "Reisebuchungsplattform-Schnittstelle",
                    },
                    slideTagId: slideTags[6].id, // Results
                  },
                ],
              },
            },
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
