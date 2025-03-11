<script setup lang="ts">
  /**
   * Dashboard page component
   *
   * Main dashboard view for authenticated users
   * Shows a grid layout with placeholder content
   */

  // Define page metadata for layout
  definePageMeta({
    layout: "auth",
  });
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <!-- Top row with three cards -->
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <div class="aspect-video rounded-xl bg-muted/50" />
      <div class="aspect-video rounded-xl bg-muted/50" />
      <div class="aspect-video rounded-xl bg-muted/50" />
    </div>

    <!-- Main content area -->
    <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
  </div>
</template>
