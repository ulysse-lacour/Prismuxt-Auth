<script setup lang="ts">
  import { Briefcase, FolderKanban, Frame, Map, PieChart, Plus } from "lucide-vue-next";
  import type { SidebarProps } from "../../components/ui/sidebar";
  import type { ProjectContentBlock } from "@prisma/client";
  import type { LucideIcon } from "lucide-vue-next";
  import type { HTMLAttributes } from "vue";

  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
  } from "../../components/ui/sidebar";

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
    }>(),
    {
      collapsible: "icon",
    }
  );

  const emit = defineEmits(["update", "activate"]);

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
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarTrigger />
    </SidebarHeader>
    <SidebarContent class="p-4">
      <template v-for="slide in slides" :key="slide.id">
        <SlideCard
          :slide="slide"
          :isActive="activeSlideId === slide.id"
          :rotate="rotate"
          @update:slide="handleSlideUpdate"
          @activate="handleSlideActivate"
        />
      </template>
    </SidebarContent>
  </Sidebar>
</template>

<style>
  /* No custom styles needed */
</style>
