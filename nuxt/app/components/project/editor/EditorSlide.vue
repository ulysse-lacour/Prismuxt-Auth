<script lang="ts" setup>
  import { useIntersectionObserver } from "@vueuse/core";
  import type { ProjectContentBlock } from "@prisma/client";

  // Set default prop values
  const props = withDefaults(
    defineProps<{
      slide: ProjectContentBlock;
      rotate?: "horizontal" | "vertical";
      isActive?: boolean;
    }>(),
    {
      isActive: false,
    }
  );

  // Create a ref for the slide element
  const slideElement = ref(null);

  // Using the more powerful useIntersectionObserver to get intersection ratio
  const { stop } = useIntersectionObserver(
    slideElement,
    (entries) => {
      // Check if we have entries and use the first one
      if (entries[0]) {
        // Emit the visibility ratio to let parent determine which slide is most visible
        emit("intersection", {
          id: props.slide.id,
          ratio: entries[0].intersectionRatio,
        });
      }
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] } // Track various intersection thresholds
  );

  // Stop observing when component is unmounted
  onUnmounted(() => {
    stop();
  });

  // Emit intersection data for parent component to determine which slide is most visible
  const emit = defineEmits(["intersection"]);
</script>

<template>
  <section ref="slideElement" class="flex w-full gap-4" :class="{ 'active-slide': props.isActive }">
    <SlideCard :slide="slide" :isActive="props.isActive" />
    <div
      :class="[
        'w-full rounded-lg bg-white p-4 text-black transition-all duration-300',
        props.rotate === 'vertical' ? 'aspect-a4-vertical' : 'aspect-a4',
        props.isActive ? 'shadow-lg ring-2 ring-yellow-400' : 'shadow',
      ]"
    >
      <h2>{{ slide.type }}</h2>
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

  .active-slide {
    z-index: 10;
  }
</style>
