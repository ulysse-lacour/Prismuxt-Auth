<script setup lang="ts">
  /**
   * New Project Form
   *
   * Provides a form for creating a new project
   * Handles form validation and submission
   */
  import { Button } from "@/components/ui/button";
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useProjectStore } from "~/stores/userProjects";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  // Router for navigation
  const router = useRouter();

  // Composables
  const { processProjectData } = useProjectData();

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
   * Initialize form with validation and default values
   */
  const { handleSubmit, resetForm } = useForm({
    validationSchema: projectFormSchema,
    initialValues: {
      name: "",
      description: "",
      client: "",
    },
  });

  // Project store for state management
  const projectStore = useProjectStore();

  /**
   * Handle form submission
   * Creates a new project and updates the store
   */
  const submitCreateProject = handleSubmit(async (values) => {
    try {
      // Send API request to create project
      const updatedProject = await $fetch(`/api/projects/create`, {
        method: "POST",
        body: { ...values },
      });

      // Update the global state with the new project
      projectStore.addProject(processProjectData(updatedProject.project));

      // Show success notification
      toast({
        title: "Project created",
        description: "Project created successfully",
      });

      // Navigate to the new project page
      router.push(`/projects/${updatedProject.project.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);

      // Show error notification
      toast({
        title: "Project creation failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });
</script>

<template>
  <div class="w-full max-w-4xl space-y-6 rounded-lg border p-6 shadow-sm">
    <!-- Page header -->
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">Add project</h2>
      <p class="text-sm text-muted-foreground">Add a new project to your dashboard.</p>
    </div>

    <!-- Project creation form -->
    <form @submit="submitCreateProject" class="space-y-4">
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

      <!-- Form submit button -->
      <div class="flex justify-end pt-2">
        <Button type="submit" class="w-full sm:w-auto"> Create Project </Button>
      </div>
    </form>
  </div>
</template>
