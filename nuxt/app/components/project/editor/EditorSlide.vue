<script lang="ts" setup>
  import { useIntersectionObserver } from "@vueuse/core";
  import type { ProjectContentBlock } from "@prisma/client";

  // Set default prop values
  const props = withDefaults(
    defineProps<{
      slide: ProjectContentBlock;
      rotate?: "horizontal" | "vertical";
      isActive?: boolean;
      cardClass?: string;
      slideClass?: string;
    }>(),
    {
      isActive: false,
      cardClass: "",
      slideClass: "",
    }
  );

  // Create a ref for the slide element
  const slideElement = ref(null);

  // Store the observer stop function
  let stopObserver = () => {};

  // Function to initialize the intersection observer
  const initIntersectionObserver = () => {
    // Cleanup previous observer if exists
    if (stopObserver) {
      stopObserver();
    }

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

    // Store the stop function
    stopObserver = stop;
  };

  // Initialize the observer when component is mounted
  onMounted(() => {
    initIntersectionObserver();
  });

  // Watch for changes in the slide ID which indicates a language change
  watch(
    () => props.slide.id,
    () => {
      // Re-initialize the observer when slide ID changes
      nextTick(() => {
        initIntersectionObserver();
      });
    }
  );

  // Stop observing when component is unmounted
  onUnmounted(() => {
    stopObserver();
  });

  // Handle activation through the slide editor
  const handleActivate = () => {
    // Only emit activate event if not already active
    // This prevents unnecessary scrolling when clicking an already active slide
    if (!props.isActive) {
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
    }
  };

  // Handle slide update from SlideCard
  const handleSlideUpdate = (updatedSlide: ProjectContentBlock) => {
    emit("update", updatedSlide);
  };

  // Emit intersection data and activate events for parent component
  const emit = defineEmits(["intersection", "activate", "update"]);
</script>

<template>
  <section
    ref="slideElement"
    :id="`slide-section-${slide.id}`"
    class="grid w-full grid-cols-12"
    :class="{ 'active-slide': props.isActive }"
  >
    <div :class="props.cardClass + ' pr-4'">
      <SlideCard :slide="slide" :isActive="props.isActive" @update:slide="handleSlideUpdate" />
    </div>

    <div
      :class="[
        props.slideClass,
        'rounded-lg bg-white p-4 text-black transition-all duration-300 hover:ring-2 hover:ring-yellow-400',
        props.rotate === 'vertical' ? 'aspect-a4-vertical' : 'aspect-a4',
        props.isActive ? 'shadow-lg ring-2 ring-yellow-400' : 'cursor-pointer shadow',
      ]"
      :id="`slide-editor-${slide.id}`"
      @click="handleActivate"
    >
      <BlockEditor :block="slide" />
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
