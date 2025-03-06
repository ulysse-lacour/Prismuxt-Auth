<script lang="ts" setup>
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useProjectStore } from "~/stores/userProjects";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  definePageMeta({
    layout: "auth",
  });

  const { id } = useRoute().params;

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

      projectStore.updateProject({
        id: updatedProject.project.id,
        name: updatedProject.project.name,
      }); // Update the global state with the correct properties

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
      });
    }
  });
</script>

<template>
  <div>
    <h1>Edit {{ project?.project?.name ?? id }}</h1>
    <form @submit="submitUpdateProject">
      <FormField v-slot="{ field, errorMessage }" name="name">
        <FormItem>
          <FormLabel>Name:</FormLabel>
          <FormControl>
            <Input v-bind="field" v-model="field.value" type="text" placeholder="Name" />
          </FormControl>
          <FormMessage>{{ errorMessage }}</FormMessage>
        </FormItem>
      </FormField>

      <FormField v-slot="{ field, errorMessage }" name="description">
        <FormItem>
          <FormLabel>Description:</FormLabel>
          <FormControl>
            <Input v-bind="field" v-model="field.value" placeholder="Description" />
          </FormControl>
          <FormMessage>{{ errorMessage }}</FormMessage>
        </FormItem>
      </FormField>

      <FormField v-slot="{ field, errorMessage }" name="client">
        <FormItem>
          <FormLabel>Client:</FormLabel>
          <FormControl>
            <Input v-bind="field" v-model="field.value" type="text" placeholder="Client" />
          </FormControl>
          <FormMessage>{{ errorMessage }}</FormMessage>
        </FormItem>
      </FormField>

      <Button type="submit">Update Project</Button>
    </form>
  </div>
</template>
