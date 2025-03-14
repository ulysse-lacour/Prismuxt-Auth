<script setup lang="ts">
  /**
   * New Portfolio Form
   *
   * Provides a form for creating a new portfolio
   * Handles form validation and submission
   */
  import { Button } from "@/components/ui/button";
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { usePortfolioManagement } from "@/composables/usePortfolioManagement";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  // Router for navigation
  const router = useRouter();

  // Composables
  const { createPortfolio } = usePortfolioManagement();

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

  /**
   * Handle form submission
   * Creates a new portfolio and updates the store
   */
  const submitCreatePortfolio = handleSubmit(async (values) => {
    try {
      // Use the composable to create the portfolio
      const { createdPortfolio } = await createPortfolio(values);

      // Show success message
      if (createdPortfolio?.portfolio) {
        toast({
          title: "Portfolio Created",
          description: `Your portfolio "${values.name}" has been created successfully.`,
        });

        // Navigate to the new portfolio page
        router.push(`/portfolios/${createdPortfolio.portfolio.slug}`);
      }
    } catch (error) {
      console.error("Error creating portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to create portfolio. Please try again.",
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

      <form class="space-y-4" @submit="submitCreatePortfolio">
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
