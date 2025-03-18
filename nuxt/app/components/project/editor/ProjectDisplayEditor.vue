<script setup lang="ts">
  import { toast } from "~/components/ui/toast";
  import type { Project, ProjectContentBlock } from "@prisma/client";

  const props = defineProps<{
    project: Project;
    projectContent: ProjectWithContentBlocks;
    rotate?: "horizontal" | "vertical";
  }>();

  // Use our active slide composable
  const { handleIntersection, isSlideActive, setActiveSlide, resetActiveSlide } = useActiveSlide();

  // Use our project content block composable
  const { createContentBlock } = useProjectContentBlock();

  // Track if we're currently adding a slide
  const isAddingSlide = ref(false);

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

  // Handle adding a new slide
  const handleAddSlide = async () => {
    // Prevent multiple simultaneous add requests
    if (isAddingSlide.value) return;

    try {
      // Set loading state
      isAddingSlide.value = true;

      // Add a new slide (default type is TEXT)
      const response = await createContentBlock(props.project.id, props.projectContent.id);

      // Add the new block to our local state
      if (response?.block) {
        contentBlocks.value = [...contentBlocks.value, response.block];

        // Set the new slide as active after a short delay
        setTimeout(() => {
          handleActivateSlide(response.block.id);
        }, 100);

        // Show success notification
        toast({
          title: "Slide added",
          description: "New slide has been added to the project",
        });
      }
    } catch (error) {
      console.error("Error adding slide:", error);

      // Show error notification
      toast({
        title: "Add slide failed",
        description: "Failed to add new slide",
        variant: "destructive",
      });
    } finally {
      // Reset loading state
      isAddingSlide.value = false;
    }
  };

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
  <div id="project-display-editor" class="grid grid-cols-12 gap-4 p-6">
    <!-- Back button in column 1 -->
    <NuxtLink
      :to="`/projects/${project.id}`"
      class="relative bottom-[-3.5rem] col-span-1 h-[40px] w-[40px]"
    >
      <svg class="h-auto w-full" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M40.31 18.275V22.455H7.31C9.4 25.15 11.38 27.735 13.8 30.925L20.73 40H15.065L0.27 20.42L15.065 0.839999H20.73L13.8 9.915C11.38 13.105 9.4 15.635 7.365 18.275H40.31Z"
          fill="white"
        />
      </svg>
    </NuxtLink>

    <!-- Add Slide button in columns 4-5 -->
    <button
      @click="handleAddSlide"
      :disabled="isAddingSlide"
      class="col-span-2 col-start-4 flex items-center gap-2"
      :class="{ 'cursor-not-allowed opacity-50': isAddingSlide }"
    >
      <span>{{ isAddingSlide ? "Adding..." : "Add Slide" }}</span>
      <svg
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.895 10.44V14.4H14.72V24.575H10.43V14.4H0.2V10.44H10.43V0.264999H14.72V10.44H24.895Z"
          fill="white"
        />
      </svg>
    </button>

    <!-- Editor slides positioned in columns -->
    <template v-if="projectContent">
      <div
        v-for="block in contentBlocks"
        :key="block.id"
        :id="`slide-${block.id}`"
        class="col-span-12 mb-4"
      >
        <EditorSlide
          :slide="block"
          :rotate="rotate"
          :isActive="isSlideActive(block.id)"
          cardClass="col-span-2 col-start-2"
          slideClass="col-span-9 col-start-4"
          @intersection="handleIntersection"
          @activate="handleActivateSlide"
          @update="handleUpdateSlide"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
  /* Add scroll margin to the slide containers */
  div[id^="slide-"] {
    scroll-margin-top: 1rem; /* Add 1rem space above when scrolled to */
  }
</style>
