<script setup lang="ts">
  /**
   * Error Dialog Component
   *
   * Reusable dialog for displaying error messages
   * Used across forms to show validation and submission errors
   */
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";

  // Component props
  interface Props {
    open: boolean;
    title?: string;
    message: string;
    actionLabel?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: "Oups...",
    actionLabel: "OK",
  });

  // Emit events for controlling dialog visibility
  const emit = defineEmits(["update:open"]);

  // Close dialog handler
  const closeDialog = () => {
    emit("update:open", false);
  };
</script>

<template>
  <AlertDialog :open="open" @update:open="emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ message }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction @click="closeDialog">{{ actionLabel }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
