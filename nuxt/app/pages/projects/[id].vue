<script lang="ts" setup>
  import { Button } from "@/components/ui/button";
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useProjectStore } from "~/stores/userProjects";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  definePageMeta({
    layout: "auth",
  });

  const { id } = useRoute().params;
  const { processProjectData } = useProjectData();

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

      <div class="flex justify-end pt-2">
        <Button type="submit" class="w-full sm:w-auto"> Update Project </Button>
      </div>
    </form>
  </div>
</template>
