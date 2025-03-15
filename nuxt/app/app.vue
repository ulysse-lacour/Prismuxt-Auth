<!--
  Main Application Entry Point
  
  This component serves as the root of the application and includes the global layout structure.
  It contains:
  - The HTML and Body tags for proper document structure
  - The NuxtLayout component which renders the selected layout
  - The NuxtLoadingIndicator for page transition feedback
  - The NuxtPage component which renders the current route's page
  - The Toaster component for displaying toast notifications
-->
<script setup lang="ts">
  // No setup logic needed for the root component
  // All global providers and plugins are auto-registered by Nuxt
</script>

<template>
  <div class="app">
    <Html>
      <Body>
        <NuxtLayout>
          <NuxtLoadingIndicator />
          <NuxtPage />
          <Toaster />
        </NuxtLayout>
      </Body>
    </Html>
  </div>
</template>
