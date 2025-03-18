<script lang="ts" setup>
  import type { ProjectContentBlock } from "@prisma/client";

  const props = defineProps<{
    section: ProjectContentBlock;
    rotate?: "horizontal" | "vertical";
  }>();

  console.log(props.rotate);
</script>

<template>
  <section class="flex w-full gap-4">
    <div class="w-2/12">EDITOR CARD</div>
    <div
      :class="[
        'w-full rounded-lg bg-white p-4 text-black',
        props.rotate === 'vertical' ? 'aspect-a4-vertical' : 'aspect-a4',
      ]"
    >
      <h2>{{ section.type }}</h2>
    </div>
  </section>
</template>

<style>
  /* Add custom aspect ratios */
  .aspect-a4 {
    aspect-ratio: 1.414 / 1; /* A4 aspect ratio for horizontal orientation */
    /* width: 100%;
    height: auto; */
  }
  .aspect-a4-vertical {
    aspect-ratio: 1 / 1.414; /* A4 aspect ratio for vertical orientation */
    /* width: auto;
    height: 100svh; */
  }
</style>
