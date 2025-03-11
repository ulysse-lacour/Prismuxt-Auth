<script lang="ts" setup>
  import { Button } from "@/components/ui/button";
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  definePageMeta({
    layout: "auth",
  });

  const router = useRouter();

  // Composables
  const { processPortfolioData } = usePortfolioData();

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
      name: "",
      description: "",
    },
  });

  const portfolioStore = usePortfolioStore();

  // Rename the local update function to avoid conflict
  const submitCreatePortfolio = handleSubmit(async (values) => {
    try {
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

        router.push(`/portfolios/${updatedPortfolio.portfolio.slug}`);
      }

      toast({
        title: "Portfolio created",
        description: "Portfolio created successfully",
      });
    } catch (error) {
      console.error("Failed to create portfolio:", error);
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
    <div class="w-full space-y-6 rounded-lg border p-6 shadow-sm">
      <div class="space-y-2">
        <h2 class="text-2xl font-semibold">Add portfolio</h2>
        <p class="text-sm text-muted-foreground">Add a new portfolio to your dashboard.</p>
      </div>

      <form @submit="submitCreatePortfolio" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        <div class="flex justify-end pt-2">
          <Button type="submit" class="w-full sm:w-auto"> Create Portfolio </Button>
        </div>
      </form>
    </div>
  </div>
</template>
