<script lang="ts" setup>
  import type { ProjectContentBlock } from "@prisma/client";

  const props = defineProps<{
    block: ProjectContentBlock;
  }>();
</script>

<template>
  <div>
    <h1>Block Editor</h1>

    <pre>{{ block }}</pre>
  </div>
</template>

<style></style>
