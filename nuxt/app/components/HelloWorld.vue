<template>
  <div class="p-4">
    <p class="text-lg">{{ message || "Hello, world!" }}</p>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    message?: string;
  }>();
</script>
