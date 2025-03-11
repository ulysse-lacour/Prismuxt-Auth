<script lang="ts" setup>
  // Shadcn UI components
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useProjectStore } from "~/stores/userProjects";
  import { Trash2 } from "lucide-vue-next";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  definePageMeta({
    layout: "auth",
  });

  const { id } = useRoute().params;
  const router = useRouter();
  const { processProjectData } = useProjectData();
  const isDeleteDialogOpen = ref(false);

  // Fetch project data
  const { data: project, refresh } = await useFetch(`/api/projects/single`, {
    params: { id },
    immediate: true, // Ensure fetch is immediate
  });

  // Define validation schema using zod
  const projectFormSchema = toTypedSchema(
    z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
      client: z.string().optional(),
    })
  );

  // Use useForm for form management
  const { handleSubmit, resetForm } = useForm({
    validationSchema: projectFormSchema,
    initialValues: {
      name: project.value?.project?.name || "",
      description: project.value?.project?.description || "",
      client: project.value?.project?.client || "",
    },
  });

  const projectStore = useProjectStore();

  // Rename the local update function to avoid conflict
  const submitUpdateProject = handleSubmit(async (values) => {
    try {
      const updatedProject = await $fetch(`/api/projects/single`, {
        method: "PUT",
        body: { id, ...values },
      });

      projectStore.updateProject(processProjectData(updatedProject.project)); // Update the global state with the correct properties

      await refresh(); // Refresh the data after update

      toast({
        title: "Project updated",
        description: "Project updated successfully",
      });
    } catch (error) {
      console.error("Failed to update project:", error);
      toast({
        title: "Project update failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });

  // Open delete confirmation dialog
  const openDeleteDialog = () => {
    isDeleteDialogOpen.value = true;
  };

  // Delete project after confirmation
  const deleteProject = async () => {
    try {
      const deletedProject = await $fetch(`/api/projects/single`, {
        method: "DELETE",
        body: { id },
      });

      // Close dialog
      isDeleteDialogOpen.value = false;

      // Update store
      projectStore.deleteProject(processProjectData(deletedProject.project));

      // Show success toast
      toast({
        title: "Project deleted",
        description: "Project deleted successfully",
      });

      // Navigate away from the deleted project
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete project:", error);
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
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">Project Settings</h2>
      <p class="text-sm text-muted-foreground">Update your project information and settings.</p>
    </div>

    <form @submit="submitUpdateProject" class="space-y-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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

      <div class="flex justify-between pt-2">
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
        <div>
          <Button type="submit" class="w-full sm:w-auto">Update Project</Button>
        </div>
      </div>
    </form>

    <!-- Delete confirmation dialog -->
    <AlertDialog v-model:open="isDeleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this project? This action cannot be undone and will
            remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="isDeleteDialogOpen = false">Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="deleteProject"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
