<script setup lang="ts">
  /**
   * Project settings form
   *
   * Displays and manages a specific project identified by its ID
   * Provides form for updating project details and option to delete the project
   */

  import ProjectTagSelector from "@/components/project/ProjectTagSelector.vue";
  import { Button } from "@/components/ui/button";
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { useProjectManagement } from "@/composables/useProjectManagement";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { Trash2 } from "lucide-vue-next";
  import { useForm } from "vee-validate";
  import * as z from "zod";
  import type { Project } from "@prisma/client";

  // Route parameters and navigation
  const route = useRoute();
  const router = useRouter();
  const { id } = route.params;
  const projectId = typeof id === "string" ? id : "";

  // UI state
  const isDeleteDialogOpen = ref(false);

  // Composables
  const { fetchProject, updateProject, deleteProject } = useProjectManagement();

  // Fetch project data
  const { project } = await fetchProject(projectId);

  /**
   * Define validation schema using zod
   * Validates form fields before submission
   */
  const projectFormSchema = toTypedSchema(
    z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
      client: z.string().optional(),
    })
  );

  /**
   * Initialize form with validation and project data
   */
  const { handleSubmit, resetForm } = useForm({
    validationSchema: projectFormSchema,
    initialValues: {
      name: project.value?.project?.name || "",
      description: project.value?.project?.description || "",
      client: project.value?.project?.client || "",
    },
  });

  /**
   * Handle project update form submission
   * Updates project data and refreshes the view
   */
  const submitUpdateProject = handleSubmit(async (values) => {
    try {
      const { updatedProject } = await updateProject(projectId, {
        id: projectId,
        ...values,
      } as Project);

      // Show success notification
      toast({
        title: "Project updated",
        description: "Project updated successfully",
      });
    } catch (error) {
      console.error("Failed to update project:", error);

      // Show error notification
      toast({
        title: "Project update failed",
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
   * Delete project after confirmation
   * Removes project and navigates away
   */
  const deleteCurrentProject = async () => {
    try {
      const { deletedProject } = await deleteProject(projectId);

      // Close dialog
      isDeleteDialogOpen.value = false;

      // Show success toast
      toast({
        title: "Project deleted",
        description: "Project deleted successfully",
      });

      // Navigate away from the deleted project
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete project:", error);

      // Show error notification
      toast({
        title: "Project deletion failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };
</script>

<template>
  <div class="w-full max-w-4xl space-y-6 rounded-lg border p-6 shadow-sm">
    <!-- Page header -->
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">Project Settings</h2>
      <p class="text-sm text-muted-foreground">Update your project information and settings.</p>
    </div>

    <!-- Project update form -->
    <form @submit="submitUpdateProject" class="space-y-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- Project name field -->
        <FormField v-slot="{ field, errorMessage }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                v-model="field.value"
                type="text"
                placeholder="Enter project name"
                class="w-full"
              />
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>

        <!-- Client name field -->
        <FormField v-slot="{ field, errorMessage }" name="client">
          <FormItem>
            <FormLabel>Client</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                v-model="field.value"
                type="text"
                placeholder="Enter client name"
                class="w-full"
              />
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>
      </div>

      <!-- Project description field -->
      <FormField v-slot="{ field, errorMessage }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              v-bind="field"
              v-model="field.value"
              placeholder="Enter project description"
              class="min-h-[100px] w-full resize-y"
            />
          </FormControl>
          <FormMessage>{{ errorMessage }}</FormMessage>
        </FormItem>
      </FormField>

      <!-- Project Tags Section -->
      <div class="mt-4 border-t pt-4">
        <ProjectTagSelector :project-id="projectId" />
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
          <Button type="submit" class="w-full sm:w-auto">Update Project</Button>
        </div>
      </div>
    </form>

    <!-- Using DeleteConfirmDialog component -->
    <DeleteConfirmDialog
      v-model:open="isDeleteDialogOpen"
      title="Delete Project"
      description="Are you sure you want to delete this project? This action cannot be undone and will remove all associated data."
      @confirm="deleteCurrentProject"
    />
  </div>
</template>
