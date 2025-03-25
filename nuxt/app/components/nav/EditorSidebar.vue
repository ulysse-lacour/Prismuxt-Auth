<script setup lang="ts">
  import { useSidebar } from "@/components/ui/sidebar/utils";
  import { nextTick, watch } from "vue";
  import type { ProjectContentBlock } from "@prisma/client";
  import type { HTMLAttributes } from "vue";

  import { Sidebar, SidebarContent, SidebarHeader } from "../../components/ui/sidebar";

  /**
   * Editor Sidebar Component
   *
   * Sidebar for the editor
   * Displays TODO
   */

  const props = withDefaults(
    defineProps<{
      slides: ProjectContentBlock[];
      rotate?: "horizontal" | "vertical";
      side?: "left" | "right";
      variant?: "sidebar" | "floating" | "inset";
      collapsible?: "offcanvas" | "icon" | "none";
      class?: HTMLAttributes["class"];
      activeSlideId?: string | null;
      projectContentId: string;
      projectId: string;
    }>(),
    {
      collapsible: "icon",
    }
  );

  const { open } = useSidebar();

  const emit = defineEmits(["update", "activate", "addSlide"]);

  // Watch for active slide changes to scroll in sidebar
  watch(
    () => props.activeSlideId,
    (newId) => {
      if (newId && open.value) {
        nextTick(() => {
          const slideCard = document.getElementById(`sidebar-slide-${newId}`);
          if (slideCard) {
            slideCard.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        });
      }
    }
  );

  // Handle slide update from SlideCard
  const handleSlideUpdate = (updatedSlide: ProjectContentBlock) => {
    // Find the index of the slide to update
    const slideIndex = props.slides.findIndex((block) => block.id === updatedSlide.id);

    if (slideIndex !== -1) {
      // Create a new array with the updated slide
      const updatedSlides = [...props.slides];
      updatedSlides[slideIndex] = updatedSlide;

      // Emit the update to the parent
      emit("update", updatedSlides);
    }
  };

  // Handle slide activation
  const handleSlideActivate = (slideId: string) => {
    emit("activate", slideId);
  };

  // Handle add slide request
  const handleAddSlide = () => {
    emit("addSlide");
  };
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader class="py-0">
      <EditorSidebarTrigger @addSlide="handleAddSlide" />
    </SidebarHeader>
    <SidebarContent class="p-4">
      <template v-if="open" v-for="slide in slides" :key="slide.id">
        <div :id="`sidebar-slide-${slide.id}`">
          <SlideCard
            :slide="slide"
            :isActive="activeSlideId === slide.id"
            :rotate="rotate"
            @update:slide="handleSlideUpdate"
            @activate="handleSlideActivate"
          />
        </div>
      </template>
    </SidebarContent>
  </Sidebar>
</template>

<style>
  /* No custom styles needed */
</style>
