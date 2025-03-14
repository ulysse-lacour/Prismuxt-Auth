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

  // Fetch portfolio data
  // const { fetchPortfolio } = usePortfolioManagement();
  // const { portfolio } = await fetchPortfolio(slug);

  // TODO : pass portfolio as props to the components ?
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <!-- Portfolio general settings component -->
    <PortfolioSettings />

    <!-- Portfolio projects management component -->
    <PortfolioProjects />
  </div>
</template>
