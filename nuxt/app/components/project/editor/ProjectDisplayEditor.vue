<script setup lang="ts">
  import type { Project } from "@prisma/client";

  const props = defineProps<{
    project: Project;
    projectContent: ProjectWithContentBlocks;
    rotate?: "horizontal" | "vertical";
  }>();

  // Use our active slide composable
  const { handleIntersection, isSlideActive } = useActiveSlide();
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
      <div v-for="block in projectContent.contentBlocks" :key="block.id">
        <EditorSlide
          :slide="block"
          :rotate="rotate"
          :isActive="isSlideActive(block.id)"
          @intersection="handleIntersection"
        />
      </div>
    </div>
  </div>
</template>
