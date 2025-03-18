<script lang="ts" setup>
  import type { ProjectContentBlock } from "@prisma/client";

  const props = defineProps<{
    section: ProjectContentBlock;
  }>();
</script>

<template>
  <section class="flex w-full gap-4">
    <div class="w-2/12">EDITOR CARD</div>
    <div class="aspect-video w-full rounded-lg bg-white p-4 text-black">
      <h2>{{ section.type }}</h2>
    </div>
  </section>
</template>

<style></style>
