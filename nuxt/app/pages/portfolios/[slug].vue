<script setup lang="ts">
  /**
   * Portfolio Detail Page
   *
   * Displays and manages a specific portfolio identified by its slug
   * Shows portfolio settings and associated projects
   */
  import { usePortfolioManagement } from "@/composables/usePortfolioManagement";

  // Define page metadata
  definePageMeta({
    layout: "auth",
  });

  // Route parameters
  const route = useRoute();
  const { slug: routeSlug } = route.params;
  const slug = Array.isArray(routeSlug) ? routeSlug[0] : (routeSlug as string);

  // Validate slug
  if (!slug) {
    throw createError({
      statusCode: 404,
      message: "Portfolio not found",
    });
  }

  // Fetch portfolio data centrally
  const { fetchPortfolio, fetchAllProjects } = usePortfolioManagement();

  // Fetch both portfolio and projects data in parallel
  const [portfolioData, projectsData] = await Promise.all([
    fetchPortfolio(slug),
    fetchAllProjects(slug),
  ]);

  // Extract the data
  const { portfolio } = portfolioData;
  const projectsList = projectsData.projects.value || [];
</script>

<template>
  <div class="flex w-full max-w-6xl flex-col gap-4">
    <!-- Portfolio general settings component -->
    <PortfolioSettings :portfolio-data="portfolio" :slug="slug" />

    <!-- Portfolio projects management component -->
    <PortfolioProjects :portfolio-data="portfolio" :projects="projectsList" :slug="slug" />
  </div>
</template>
