<script setup lang="ts">
  /**
   * Delete Confirmation Dialog Component
   *
   * A reusable dialog for confirming deletion actions
   * Provides consistent UI for delete confirmations across the application
   */

  // Props for the component
  const props = defineProps<{
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    itemName?: string;
  }>();

  // Emit events for the component
  const emit = defineEmits<{
    "update:open": [value: boolean];
    confirm: [];
    cancel: [];
  }>();

  // Default values for props
  const title = computed(() => props.title || "Confirm Deletion");
  const description = computed(
    () =>
      props.description ||
      `Are you sure you want to delete ${props.itemName ? `"${props.itemName}"` : "this item"}? This action cannot be undone.`
  );
  const confirmText = computed(() => props.confirmText || "Delete");
  const cancelText = computed(() => props.cancelText || "Cancel");

  // Handle dialog close
  const handleClose = () => {
    emit("update:open", false);
  };

  // Handle confirm action
  const handleConfirm = () => {
    emit("confirm");
    handleClose();
  };

  // Handle cancel action
  const handleCancel = () => {
    emit("cancel");
    handleClose();
  };
</script>

<template>
  <AlertDialog :open="open" @update:open="emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancel">{{ cancelText }}</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
