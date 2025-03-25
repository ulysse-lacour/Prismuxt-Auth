<script lang="ts" setup>
  import type { ProjectContentBlock } from "@prisma/client";

  const props = defineProps<{
    block: ProjectContentBlock;
  }>();
</script>

<template>
  <div>
    <pre>{{ block }}</pre>
  </div>
</template>

<style></style>
