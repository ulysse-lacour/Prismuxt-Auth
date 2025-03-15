<script setup lang="ts">
  /**
   * Error Page Component
   *
   * This component is automatically rendered when an error occurs in the application.
   * It displays a user-friendly error page with the error code and a link to return home.
   */

  // Get the error object from Nuxt's error handling system
  const error = useError();

  // Log the error to the console for debugging
  console.error(error.value);

  // Determine the error code to display, defaulting to 500 if not available
  const errorCode = !error.value ? 500 : error.value.statusCode;

  // Commented out but kept for reference - alternative way to get error message
  // const errorMessage = !error.value ? 'Something went wrong' : error.value.statusMessage;

  /**
   * Handle returning to the application
   * Clears the error state and redirects to the home page
   */
  const handleError = () => {
    clearError({ redirect: "/" });
  };
</script>

<template>
  <NuxtLayout>
    <div id="error-page" :class="`error-${errorCode}`" role="alert" aria-labelledby="error-title">
      <!-- Error title from i18n translations -->
      <p id="error-title" class="text-2xl font-bold">
        {{ $t(`error.error_${errorCode}`) }}
      </p>
      <!-- Large error code display -->
      <div class="error-code">
        <h1>{{ errorCode }}</h1>
      </div>
      <!-- Link to return to home page -->
      <NuxtLink to="/" class="font-bold" @click="handleError">
        {{ $t("common.home") }}
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<style>
  /* Hide the burger menu when on the error page */
  body:has(#error-page) #burger {
    display: none !important;
  }
</style>
