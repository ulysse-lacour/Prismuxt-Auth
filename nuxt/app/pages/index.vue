<script setup lang="ts">
  /**
   * Home page component
   *
   * Landing page for the application that shows a welcome message
   * and navigation options based on authentication status
   */
  import { useSession } from "~/utils/auth-client";

  // Define page metadata for layout
  definePageMeta({
    layout: "default",
  });

  // Fetch current user session
  const { data: session } = await useSession(useFetch);
</script>

<template>
  <div
    class="no-visible-scrollbar flex min-h-[80vh] items-center justify-center overflow-hidden px-6 md:px-0"
  >
    <main class="row-start-2 flex flex-col items-center justify-center gap-4">
      <!-- Page title -->
      <div class="flex flex-col gap-1">
        <h3 class="text-center text-4xl font-bold text-black dark:text-white">
          Portfolio Generator
        </h3>

        <!-- Navigation buttons based on authentication status -->
        <div class="mx-auto mt-2 flex items-center gap-2">
          <!-- Sign in button for unauthenticated users -->
          <NuxtLink v-if="!session" to="/auth/sign-in">
            <Button variant="outline" class="rounded-none"> Sign In </Button>
          </NuxtLink>

          <!-- Dashboard button for authenticated users -->
          <NuxtLink v-if="session" to="/dashboard">
            <Button variant="outline" class="rounded-none"> Dashboard </Button>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>
