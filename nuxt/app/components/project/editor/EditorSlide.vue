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

  // Handle activation through the slide editor
  const handleActivate = () => {
    emit("activate", props.slide.id);

    // Attempt to scroll to this element directly
    setTimeout(() => {
      // Use the ID since we know it's stable
      const element = document.getElementById(`slide-section-${props.slide.id}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 10);
  };

  // Emit intersection data and activate events for parent component
  const emit = defineEmits(["intersection", "activate"]);
</script>

<template>
  <section
    ref="slideElement"
    :id="`slide-section-${slide.id}`"
    class="flex w-full gap-4"
    :class="{ 'active-slide': props.isActive }"
  >
    <SlideCard :slide="slide" :isActive="props.isActive" />

    <div
      :id="`slide-editor-${slide.id}`"
      class="cursor-pointer"
      @click="handleActivate"
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

  /* Add scroll margin to ensure proper spacing when scrolled to */
  section[id^="slide-section-"] {
    scroll-margin-top: 1rem; /* Add 1rem space above the section when scrolled to */
  }
</style>
