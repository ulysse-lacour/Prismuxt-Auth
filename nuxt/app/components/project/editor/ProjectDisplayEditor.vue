<script setup lang="ts">
  import type { Project, ProjectContentBlock } from "@prisma/client";

  const props = defineProps<{
    project: Project;
    projectContent: ProjectWithContentBlocks;
    rotate?: "horizontal" | "vertical";
  }>();

  // Use our active slide composable
  const { handleIntersection, isSlideActive, setActiveSlide, resetActiveSlide } = useActiveSlide();

  // Create a ref to store the content blocks for reactivity
  const contentBlocks = ref(props.projectContent.contentBlocks || []);

  // Watch for changes in the projectContent (e.g., language change)
  watch(
    () => props.projectContent,
    (newContent) => {
      // Reset active slide tracking when content changes
      resetActiveSlide();
      // Update the content blocks
      contentBlocks.value = newContent.contentBlocks || [];
    },
    { deep: true }
  );

  // Handle manual activation of a slide
  const handleActivateSlide = (slideId: string) => {
    // Check if this slide is already active
    if (isSlideActive(slideId)) return;

    // Set the slide as active
    setActiveSlide(slideId);

    setTimeout(() => {
      const slideElement = document.getElementById(`slide-${slideId}`);

      // Scroll to the element if found
      if (slideElement) {
        // Use 'start' to scroll to top of the element
        slideElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      } else {
        console.error(`Could not find slide element with ID containing ${slideId}`);
      }
    }, 100);
  };

  // Handle slide update from EditorSlide
  const handleUpdateSlide = (updatedSlide: ProjectContentBlock) => {
    // Find the index of the slide to update
    const slideIndex = contentBlocks.value.findIndex((block) => block.id === updatedSlide.id);

    if (slideIndex !== -1) {
      // Create a new array with the updated slide
      const updatedBlocks = [...contentBlocks.value];
      updatedBlocks[slideIndex] = updatedSlide;

      // Update the content blocks
      contentBlocks.value = updatedBlocks;
    }
  };
</script>

<template>
  <div class="flex gap-2 p-6">
    <div class="flex w-1/12 items-start justify-start">
      <NuxtLink :to="`/projects/${project.id}`" class="h-[40px] w-[40px]"
        ><svg
          class="h-auto w-full"
          viewBox="0 0 41 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40.31 18.275V22.455H7.31C9.4 25.15 11.38 27.735 13.8 30.925L20.73 40H15.065L0.27 20.42L15.065 0.839999H20.73L13.8 9.915C11.38 13.105 9.4 15.635 7.365 18.275H40.31Z"
            fill="white"
          />
        </svg>
      </NuxtLink>
    </div>
    <div v-if="projectContent" class="flex w-11/12 flex-col gap-4">
      <div v-for="block in contentBlocks" :key="block.id" :id="`slide-${block.id}`">
        <EditorSlide
          :slide="block"
          :rotate="rotate"
          :isActive="isSlideActive(block.id)"
          @intersection="handleIntersection"
          @activate="handleActivateSlide"
          @update="handleUpdateSlide"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Add scroll margin to the slide containers */
  div[id^="slide-"] {
    scroll-margin-top: 1rem; /* Add 1rem space above when scrolled to */
  }
</style>
