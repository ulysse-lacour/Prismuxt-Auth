<script setup lang="ts">
  import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
  import { toast } from "~/components/ui/toast";
  import type { Project, ProjectContentBlock } from "@prisma/client";

  const props = defineProps<{
    project: Project;
    projectContent: ProjectWithContentBlocks;
    rotate?: "horizontal" | "vertical";
  }>();

  // Use our active slide composable
  const { handleIntersection, isSlideActive, setActiveSlide, resetActiveSlide, activeSlideId } =
    useActiveSlide();

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

  // Handle slide activation from sidebar
  const handleSidebarSlideActivate = (slideId: string) => {
    setActiveSlide(slideId);
    handleActivateSlide(slideId);
  };

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

  // Handle slides update from EditorSidebar
  const handleSlidesUpdate = (updatedSlides: ProjectContentBlock[]) => {
    contentBlocks.value = updatedSlides;
  };
</script>

<template>
  <SidebarProvider>
    <!-- Main sidebar navigation component -->
    <EditorSidebar
      :slides="contentBlocks"
      :activeSlideId="activeSlideId"
      @activate="handleSidebarSlideActivate"
      @update="handleSlidesUpdate"
    />

    <!-- Main content area with header and content slot -->
    <SidebarInset class="px-4 pb-16">
      <!-- Header with mobile sidebar trigger -->
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <!-- Mobile sidebar trigger button -->
          <div class="md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </header>

      <!-- Page content -->
      <template v-if="projectContent">
        <div v-for="block in contentBlocks" :key="block.id" :id="`slide-${block.id}`" class="mb-4">
          <EditorSlide
            :slide="block"
            :rotate="rotate"
            :isActive="isSlideActive(block.id)"
            slideClass=""
            @intersection="handleIntersection"
            @activate="handleActivateSlide"
            @update="handleUpdateSlide"
          />
        </div>
      </template>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
  /* Add scroll margin to the slide containers */
  div[id^="slide-"] {
    scroll-margin-top: 1rem; /* Add 1rem space above when scrolled to */
  }
</style>
