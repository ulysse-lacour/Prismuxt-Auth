<script lang="ts" setup>
  import { watch } from "vue";
  import type { ProjectContentBlock } from "@prisma/client";

  // Set default prop values
  const props = withDefaults(
    defineProps<{
      slide: ProjectContentBlock;
      rotate?: "horizontal" | "vertical";
    }>(),
    {}
  );

  const emit = defineEmits(["update"]);

  // Handle block update from BlockEditor
  const handleBlockUpdate = (updatedBlock: ProjectContentBlock) => {
    emit("update", updatedBlock);
  };

  // Watch for changes in the slide prop
  watch(
    () => props.slide,
    (newSlide) => {
      // Re-emit the update to ensure both previews stay in sync
      emit("update", newSlide);
    },
    { deep: true }
  );
</script>

<template>
  <section class="w-full overflow-hidden">
    <div
      :class="[
        'relative w-full rounded-lg bg-white p-4 text-black',
        props.rotate === 'vertical' ? 'aspect-a4-vertical' : 'aspect-a4',
      ]"
    >
      <div class="absolute inset-0 overflow-hidden p-4">
        <BlockEditor :block="slide" @update="handleBlockUpdate" :isPreview="true" />
      </div>
    </div>
  </section>
</template>

<style>
  /* Add custom aspect ratios */
  .aspect-a4 {
    aspect-ratio: 1.414 / 1; /* A4 aspect ratio for horizontal orientation */
    width: 100%;
    height: auto;
  }
  .aspect-a4-vertical {
    aspect-ratio: 1 / 1.414; /* A4 aspect ratio for vertical orientation */
    width: 100%;
    height: auto;
  }
</style>
