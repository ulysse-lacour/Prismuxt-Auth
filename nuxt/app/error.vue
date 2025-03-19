<script setup lang="ts">
  /**
   * Error Page Component
   *
   * This component is automatically rendered when an error occurs in the application.
   * It displays a user-friendly error page with the error code and a link to return home.
   */

  definePageMeta({
    layout: "auth",
  });

  // Get the error object from Nuxt's error handling system
  const error = useError();

  // Log the error to the console for debugging
  console.error(error.value);

  // Determine the error code to display, defaulting to 500 if not available
  const errorCode = computed(() => error.value?.statusCode || 500);

  /**
   * Handle returning to the application
   * Clears the error state and redirects to the home page
   */
  const handleError = () => {
    clearError({ redirect: "/" });
  };

  // Clear error when component is unmounted
  onUnmounted(() => {
    clearError();
  });
</script>

<template>
  <div class="container mx-auto py-10">
    <div class="flex min-h-[50vh] items-center justify-center">
      <div class="space-y-4 text-center">
        <h1 class="text-4xl font-bold">{{ errorCode }}</h1>
        <p class="text-xl text-muted-foreground">
          {{ error?.message || "Something went wrong" }}
        </p>
        <Button @click="handleError">Return Home</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
</style>
