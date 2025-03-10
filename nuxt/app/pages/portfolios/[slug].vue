<script lang="ts" setup>
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { usePortfolioStore } from "~/stores/userPortfolio";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  definePageMeta({
    layout: "auth",
  });

  const { slug } = useRoute().params;

  // Fetch portfolio data
  const { data: portfolio, refresh } = await useFetch(`/api/portfolio/single`, {
    params: { slug },
    immediate: true, // Ensure fetch is immediate
  });

  // Define validation schema using zod
  const portfolioFormSchema = toTypedSchema(
    z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
    })
  );

  // Use useForm for form management
  const { handleSubmit, resetForm } = useForm({
    validationSchema: portfolioFormSchema,
    initialValues: {
      name: portfolio.value?.portfolio?.name || "",
      description: portfolio.value?.portfolio?.description || "",
    },
  });

  const portfolioStore = usePortfolioStore();

  // Rename the local update function to avoid conflict
  const submitUpdatePortfolio = handleSubmit(async (values) => {
    try {
      const updatedPortfolio = await $fetch(`/api/portfolio/single`, {
        method: "PUT",
        body: { slug, ...values },
      });

      portfolioStore.updatePortfolio({
        slug: updatedPortfolio.portfolio.slug,
        name: updatedPortfolio.portfolio.name,
      }); // Update the global state with the correct properties

      await refresh(); // Refresh the data after update

      toast({
        title: "Portfolio updated",
        description: "Portfolio updated successfully",
      });
    } catch (error) {
      console.error("Failed to update portfolio:", error);
      toast({
        title: "Portfolio update failed",
        description: "Please try again",
      });
    }
  });
</script>

<template>
  <div>
    <h1>Edit {{ portfolio?.portfolio?.name ?? slug }}</h1>
    <form @submit="submitUpdatePortfolio">
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

      <Button type="submit">Update Portfolio</Button>
    </form>
  </div>
</template>
