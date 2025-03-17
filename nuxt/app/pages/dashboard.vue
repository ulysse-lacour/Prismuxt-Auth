<script setup lang="ts">
  /**
   * Dashboard page component
   *
   * Main dashboard view for authenticated users
   * Shows theme settings form
   */

  // Define page metadata for layout
  definePageMeta({
    layout: "auth",
  });
</script>

<template>
  <div>
    <ThemeSettingsForm />
  </div>
</template>
