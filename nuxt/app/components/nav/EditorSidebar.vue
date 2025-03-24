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

  const data = {
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  // Handle slide update from SlideCard
  const handleSlideUpdate = (updatedSlide: ProjectContentBlock) => {
    emit("update", updatedSlide);
  };

  // Handle slide activation
  const handleSlideActivate = (slideId: string) => {
    emit("activate", slideId);
  };

  const emit = defineEmits(["update", "activate"]);
</script>

<template>
  <Sidebar v-bind="props">
    <!-- Sidebar header with collapse trigger -->
    <SidebarHeader>
      <SidebarTrigger />
    </SidebarHeader>

    <!-- Main navigation content -->
    <SidebarContent>
      <template v-for="slide in slides" :key="slide.id">
        <SlideCard
          :slide="slide"
          :isActive="activeSlideId === slide.id"
          @update:slide="handleSlideUpdate"
          @activate="handleSlideActivate"
        />
      </template>
    </SidebarContent>
  </Sidebar>
</template>

<style>
  .group\/sidebar-wrapper > div > div:nth-child(2) {
    padding-top: 8rem;
  }
</style>
