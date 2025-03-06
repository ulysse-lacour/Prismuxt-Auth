<script setup lang="ts">
  import { useSession } from "~/utils/auth-client";

  definePageMeta({
    layout: "default",
  });

  const { data: session } = await useSession(useFetch);
</script>

<template>
  <div
    class="no-visible-scrollbar flex min-h-[80vh] items-center justify-center overflow-hidden px-6 md:px-0"
  >
    <main class="row-start-2 flex flex-col items-center justify-center gap-4">
      <div class="flex flex-col gap-1">
        <h3 class="text-center text-4xl font-bold text-black dark:text-white">
          Portfolio Generator
        </h3>

        <div class="mx-auto mt-2 flex items-center gap-2">
          <NuxtLink to="/auth/sign-in" v-if="!session">
            <Button variant="outline" class="rounded-none"> Sign In </Button>
          </NuxtLink>
          <NuxtLink to="/dashboard" v-if="session">
            <Button variant="outline" class="rounded-none"> Dashboard </Button>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>
