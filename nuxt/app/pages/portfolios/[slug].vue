<script lang="ts" setup>
  import { useCurrentPortfolioStore } from "~/stores/currentPortfolio";

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

  // Deserialize portfolio data to convert dates to Date objects
  if (portfolio.value?.portfolio) {
    const deserializedPortfolio = {
      ...portfolio.value.portfolio,
      createdAt: new Date(portfolio.value.portfolio.createdAt),
      updatedAt: new Date(portfolio.value.portfolio.updatedAt),
      projects: portfolio.value.portfolio.projects.map((project) => ({
        ...project,
        project: {
          ...project.project,
          createdAt: new Date(project.project.createdAt),
          updatedAt: new Date(project.project.updatedAt),
        },
      })),
    };

    currentPortfolioStore.setCurrentPortfolio(deserializedPortfolio);
  }

  const currentPortfolio = computed(() => currentPortfolioStore.currentPortfolio);
</script>

<template>
  <div>
    <h1>Current projects :</h1>

    <pre v-for="project in currentPortfolio.projects" :key="project.id">
      {{ project.project.name }}
    </pre>

    <!-- <GeneralSettingsPortfolio /> -->

    <!-- <ProjectsPortfolio /> -->
  </div>
</template>
