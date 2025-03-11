<script lang="ts" setup>
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { Trash2 } from "lucide-vue-next";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  const { slug } = useRoute().params;
  const router = useRouter();
  const isDeleteDialogOpen = ref(false);

  // Composables
  const { processPortfolioData } = usePortfolioData();

  // Fetch portfolio data
  const { data: portfolio, refresh: refreshPortfolio } = await useFetch(`/api/portfolio/single`, {
    params: { slug },
    immediate: true, // Ensure fetch is immediate
  });

  // Process portfolio data if needed
  if (portfolio.value?.portfolio) {
    processPortfolioData(portfolio.value.portfolio);
  }

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

      // Update the global state with the portfolio data
      if (updatedPortfolio.portfolio) {
        // Process the updated portfolio data with updateStore set to false
        const processedData = processPortfolioData(updatedPortfolio.portfolio);

        // Update the portfolio store with the processed data
        portfolioStore.updatePortfolio(processedData);
      }

      await refreshPortfolio(); // Refresh the data after update

      toast({
        title: "Portfolio updated",
        description: "Portfolio updated successfully",
      });
    } catch (error) {
      console.error("Failed to update portfolio:", error);
      toast({
        title: "Portfolio update failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });

  // Open delete confirmation dialog
  const openDeleteDialog = () => {
    isDeleteDialogOpen.value = true;
  };

  // Delete portfolio after confirmation
  const deletePortfolio = async () => {
    try {
      const deletedPortfolio = await $fetch(`/api/portfolio/single`, {
        method: "DELETE",
        body: { slug },
      });

      // Close dialog
      isDeleteDialogOpen.value = false;

      // Update store with processed data to ensure correct types
      if (deletedPortfolio.portfolio) {
        const processedData = {
          ...deletedPortfolio.portfolio,
          createdAt: new Date(deletedPortfolio.portfolio.createdAt),
          updatedAt: new Date(deletedPortfolio.portfolio.updatedAt),
        };
        portfolioStore.deletePortfolio(processedData);
      }

      // Show success toast
      toast({
        title: "Portfolio deleted",
        description: "Portfolio deleted successfully",
      });

      // Navigate away from the deleted portfolio
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete portfolio:", error);
      toast({
        title: "Portfolio deletion failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };
</script>

<template>
  <div class="w-full space-y-6 rounded-lg border p-6 shadow-sm">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">Portfolio Settings</h2>
      <p class="text-sm text-muted-foreground">Update your portfolio information and settings.</p>
    </div>

    <form @submit="submitUpdatePortfolio" class="space-y-4">
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
          <Button type="submit" class="w-full sm:w-auto">Update Portfolio</Button>
        </div>
      </div>
    </form>

    <!-- Delete confirmation dialog -->
    <AlertDialog v-model:open="isDeleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Portfolio</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this portfolio? This action cannot be undone and will
            remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="isDeleteDialogOpen = false">Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="deletePortfolio"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<style></style>
