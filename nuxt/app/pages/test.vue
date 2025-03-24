<template>
  <div>
    <h1>Test</h1>
  </div>
</template>

<script lang="ts" setup>
  // Test api routes

  //   import { usePortfolioManagement } from "~/composables/usePortfolioManagement";

  //   const { fetchPortfolio } = usePortfolioManagement();

  //   const portfolio = await fetchPortfolio("ulysse-design-portfolio");

  const portfolio = await $fetch(`/api/portfolios/single/ulysse-design-portfolio`, {
    method: "GET",
  });

  console.log(portfolio);
</script>

<style></style>
@
