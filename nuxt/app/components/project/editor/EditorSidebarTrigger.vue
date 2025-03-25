<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { useSidebar } from "@/components/ui/sidebar/utils";
  import { cn } from "@/lib/utils";
  import { PanelLeft, Plus } from "lucide-vue-next";
  import type { HTMLAttributes } from "vue";

  const props = defineProps<{
    class?: HTMLAttributes["class"];
  }>();

  const emit = defineEmits<{
    (e: "addSlide"): void;
  }>();

  const { toggleSidebar, open } = useSidebar();

  // Handle add slide click
  const handleAddClick = () => {
    emit("addSlide");
  };
</script>

<template>
  <div class="flex items-center justify-between gap-4 px-2">
    <Button
      v-if="open"
      variant="ghost"
      size="sm"
      class="flex items-center gap-2"
      @click="handleAddClick"
    >
      <Plus class="h-4 w-4" />
      <span>Add slide</span>
    </Button>
    <Button data-sidebar="trigger" variant="ghost" size="icon" @click="toggleSidebar">
      <PanelLeft />
      <span class="sr-only">Toggle Sidebar</span>
    </Button>
  </div>
</template>
