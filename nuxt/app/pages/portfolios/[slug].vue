<script lang="ts" setup>
  import { useCurrentPortfolioStore } from "~/stores/currentPortfolio";
  import type { Portfolio, PortfolioProject, Project } from "@prisma/client";

  definePageMeta({
    layout: "auth",
  });

  const { slug } = useRoute().params;
  const currentPortfolioStore = useCurrentPortfolioStore();

  // Fetch portfolio data
  const { data: portfolio, refresh } = await useFetch(`/api/portfolio/single`, {
    params: { slug },
    immediate: true, // Ensure fetch is immediate
  });

  // Set the current portfolio in the store with proper date conversion
  if (portfolio.value?.portfolio) {
    const portfolioData = portfolio.value.portfolio;

    // Convert date strings to Date objects
    const portfolioWithDates = {
      ...portfolioData,
      createdAt: new Date(portfolioData.createdAt),
      updatedAt: new Date(portfolioData.updatedAt),
      // Process portfolioProjects if they exist
      portfolioProjects: (portfolioData.portfolioProjects || []).map((pp) => ({
        ...pp,
        createdAt: pp.createdAt ? new Date(pp.createdAt) : new Date(),
        updatedAt: pp.updatedAt ? new Date(pp.updatedAt) : new Date(),
        project: {
          ...pp.project,
          createdAt: new Date(pp.project.createdAt),
          updatedAt: new Date(pp.project.updatedAt),
        },
        contentBlocks: pp.contentBlocks || [],
      })),
    };

    currentPortfolioStore.setCurrentPortfolio(portfolioWithDates);
  }

  const currentPortfolio = computed(() => currentPortfolioStore.currentPortfolio);
</script>

<template>
  <div>
    <GeneralSettingsPortfolio />

    <h1>Current projects:</h1>

    <div v-if="currentPortfolio.portfolioProjects && currentPortfolio.portfolioProjects.length > 0">
      <pre
        v-for="portfolioProject in currentPortfolio.portfolioProjects"
        :key="portfolioProject.id"
      >
        {{ portfolioProject.project.name }}
      </pre>
    </div>
    <p v-else>No projects in this portfolio yet.</p>

    <ProjectsPortfolio />
  </div>
</template>
