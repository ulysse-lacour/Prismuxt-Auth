<script setup lang="ts">
  /**
   * Form Card Component
   *
   * Reusable card layout for forms
   * Used across authentication and other form pages
   */

  // Component props
  interface Props {
    title: string;
    description?: string;
    maxWidth?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    description: "",
    maxWidth: "max-w-sm",
  });
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <!-- Form card -->
    <Card :class="['mx-auto', maxWidth]">
      <CardHeader>
        <CardTitle class="text-2xl">{{ title }}</CardTitle>
        <CardDescription v-if="description">{{ description }}</CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Form content passed via slot -->
        <slot></slot>
      </CardContent>

      <!-- Optional footer content -->
      <CardFooter v-if="$slots.footer">
        <slot name="footer"></slot>
      </CardFooter>
    </Card>
  </div>
</template>
