<script setup lang="ts">
  /**
   * New Portfolio Page
   *
   * Provides a form for creating a new portfolio
   * Handles form validation and submission
   */
  import { Button } from "@/components/ui/button";
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  // Define page metadata
  definePageMeta({
    layout: "auth",
  });

  // Router for navigation
  const router = useRouter();

  // Composables
  const { processPortfolioData } = usePortfolioData();

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
   * Initialize form with validation and default values
   */
  const { handleSubmit, resetForm } = useForm({
    validationSchema: portfolioFormSchema,
    initialValues: {
      name: "",
      description: "",
    },
  });

  // Portfolio store for state management
  const portfolioStore = usePortfolioStore();

  /**
   * Handle form submission
   * Creates a new portfolio and updates the store
   */
  const submitCreatePortfolio = handleSubmit(async (values) => {
    try {
      // Send API request to create portfolio
      const updatedPortfolio = await $fetch(`/api/portfolio/create`, {
        method: "POST",
        body: { ...values },
      });

      // Update the global state with the portfolio data
      if (updatedPortfolio.portfolio) {
        // Process the updated portfolio data
        const processedData = processPortfolioData(updatedPortfolio.portfolio);

        // Update the portfolio store with the processed data
        portfolioStore.addPortfolio(processedData);

        // Navigate to the new portfolio page
        router.push(`/portfolios/${updatedPortfolio.portfolio.slug}`);
      }

      // Show success notification
      toast({
        title: "Portfolio created",
        description: "Portfolio created successfully",
      });
    } catch (error) {
      console.error("Failed to create portfolio:", error);

      // Show error notification
      toast({
        title: "Portfolio creation failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <!-- Portfolio creation form -->
    <div class="w-full space-y-6 rounded-lg border p-6 shadow-sm">
      <!-- Page header -->
      <div class="space-y-2">
        <h2 class="text-2xl font-semibold">Add portfolio</h2>
        <p class="text-sm text-muted-foreground">Add a new portfolio to your dashboard.</p>
      </div>

      <form @submit="submitCreatePortfolio" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  class="min-h-[100px] w-full resize-y"
                />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>
        </div>

        <!-- Form submit button -->
        <div class="flex justify-end pt-2">
          <Button type="submit" class="w-full sm:w-auto"> Create Portfolio </Button>
        </div>
      </form>
    </div>
  </div>
</template>
