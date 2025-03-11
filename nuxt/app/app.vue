<!--
  Main application entry point
  This component serves as the root of the application and includes the global layout structure.
-->
<script setup lang="ts">
  // No setup logic needed for the root component
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
