<script setup lang="ts">
  import type { ProjectContent } from "@prisma/client";

  const props = defineProps<{
    projectContent: ProjectWithContentBlocks;
  }>();

  console.log(props.projectContent.contentBlocks);
</script>

<template>
  <div>
    <h1>Project Display Editor</h1>

    <div v-if="projectContent">
      <h2>{{ projectContent.title }}</h2>
      <p>{{ projectContent.description }}</p>

      <div>
        <h3>Content Blocks</h3>
        <div v-for="block in projectContent.contentBlocks" :key="block.id">
          <h4>{{ block.title }}</h4>
          <p>{{ block.type }}</p>
          <pre>{{ block.content }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
