<script setup lang="ts">
  /**
   * Portfolio General Settings Component
   *
   * Provides a form for updating portfolio information and settings
   * Handles portfolio update and deletion functionality
   */
  import { Button } from "@/components/ui/button";
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { Trash2 } from "lucide-vue-next";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  // Define props
  const props = defineProps({
    portfolioData: {
      type: Object,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  });

  // Route parameters and navigation
  const router = useRouter();

  // UI state
  const isDeleteDialogOpen = ref(false);

  // Composables
  const { updatePortfolio, deletePortfolio: removePortfolio } = usePortfolioManagement();

  /**
   * Define validation schema using zod
   * Validates form fields before submission
   */
  const portfolioFormSchema = toTypedSchema(
    z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
    })
  );

  /**
   * Initialize form with validation and portfolio data
   */
  const { handleSubmit, resetForm } = useForm({
    validationSchema: portfolioFormSchema,
    initialValues: {
      name: props.portfolioData.portfolio.name || "",
      description: props.portfolioData.portfolio.description || "",
    },
  });

  /**
   * Handle portfolio update form submission
   * Updates portfolio data and refreshes the view
   */
  const submitUpdatePortfolio = handleSubmit(async (values) => {
    try {
      // Use the composable to update the portfolio
      await updatePortfolio(props.slug, values);

      // Show success notification
      toast({
        title: "Portfolio updated",
        description: "Portfolio settings have been updated successfully",
      });
    } catch (error) {
      console.error("Failed to update portfolio:", error);

      // Show error notification
      toast({
        title: "Update failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });

  /**
   * Open delete confirmation dialog
   */
  const openDeleteDialog = () => {
    isDeleteDialogOpen.value = true;
  };

  /**
   * Delete portfolio after confirmation
   * Removes portfolio and navigates away
   */
  const deletePortfolio = async () => {
    try {
      // Use the composable to delete the portfolio
      await removePortfolio(props.slug);

      // Close dialog
      isDeleteDialogOpen.value = false;

      // Show success toast
      toast({
        title: "Portfolio deleted",
        description: "Your portfolio has been deleted successfully",
      });

      // Navigate away
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete portfolio:", error);

      // Show error notification
      toast({
        title: "Delete failed",
        description: "Please try again",
        variant: "destructive",
      });

      // Close dialog
      isDeleteDialogOpen.value = false;
    }
  };
</script>

<template>
  <div class="w-full space-y-6 rounded-lg border p-6 shadow-sm">
    <!-- Page header -->
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">Portfolio Settings</h2>
      <p class="text-sm text-muted-foreground">Update your portfolio information and settings.</p>
    </div>

    <!-- Portfolio update form -->
    <form class="space-y-4" @submit="submitUpdatePortfolio">
      <div class="grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        <!-- Portfolio name field -->
        <FormField v-slot="{ field, errorMessage }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                v-model="field.value"
                type="text"
                placeholder="Enter portfolio name"
                class="w-full"
              />
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>

        <!-- Portfolio description field -->
        <FormField v-slot="{ field, errorMessage }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                v-bind="field"
                v-model="field.value"
                placeholder="Enter portfolio description"
                class="min-h-[100px] w-full resize-none"
              />
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>
      </div>

      <!-- Form action buttons -->
      <div class="flex justify-between pt-2">
        <!-- Delete button -->
        <div>
          <Button
            type="button"
            variant="destructive"
            class="flex items-center gap-2"
            @click="openDeleteDialog"
          >
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>

        <!-- Update button -->
        <div>
          <Button type="submit" class="w-full sm:w-auto">Update Portfolio</Button>
        </div>
      </div>
    </form>

    <!-- Using DeleteConfirmDialog component -->
    <DeleteConfirmDialog
      v-model:open="isDeleteDialogOpen"
      title="Delete Portfolio"
      description="Are you sure you want to delete this portfolio? This action cannot be undone and will remove all associated data."
      @confirm="deletePortfolio"
    />
  </div>
</template>

<style></style>
