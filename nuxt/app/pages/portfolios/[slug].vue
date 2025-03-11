<script setup lang="ts">
  /**
   * Portfolio Detail Page
   *
   * Displays and manages a specific portfolio identified by its slug
   * Shows portfolio settings and associated projects
   */

  // Define page metadata
  definePageMeta({
    layout: "auth",
  });
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <!-- Portfolio general settings component -->
    <GeneralSettingsPortfolio />

    <!-- Portfolio projects management component -->
    <ProjectsPortfolio />
  </div>
</template>
