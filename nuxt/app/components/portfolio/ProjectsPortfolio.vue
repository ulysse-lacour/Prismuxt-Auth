<script setup lang="ts">
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
  import {
    Combobox,
    ComboboxAnchor,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxList,
    ComboboxTrigger,
  } from "@/components/ui/combobox";
  import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { toast } from "@/components/ui/toast";
  // Utils
  import { cn } from "@/lib/utils";
  import { toTypedSchema } from "@vee-validate/zod";
  // Stores
  import { useCurrentPortfolioStore } from "~/stores/currentPortfolio";
  // Icons
  import { Check, ChevronsUpDown, Edit, Search, Trash } from "lucide-vue-next";
  // Form
  import { useForm } from "vee-validate";
  import * as z from "zod";

  // Route
  const { slug } = useRoute().params;

  // Stores & Composables
  const currentPortfolioStore = useCurrentPortfolioStore();
  const { processPortfolioData } = usePortfolioData();

  // Fetch portfolio data
  const { data: portfolio, refresh: refreshPortfolio } = await useFetch(`/api/portfolio/single`, {
    params: { slug },
    immediate: true, // Ensure fetch is immediate
  });

  // Set the current portfolio in the store with proper date conversion
  if (portfolio.value?.portfolio) {
    currentPortfolioStore.setCurrentPortfolio(processPortfolioData(portfolio.value.portfolio));
  }

  const currentPortfolio = computed(() => currentPortfolioStore.currentPortfolio);

  // Fetch all projects for the dropdown
  const { data: projects, refresh: refreshProjects } = await useFetch(
    `/api/portfolio/all-projects`,
    {
      params: { slug },
    }
  );

  // Get not linked to portfolio projects
  const unlinkedProjects = computed(() => projects.value?.filter((project) => !project.isLinked));

  // Structure projects for the dropdown
  const availableProjects = computed(() =>
    unlinkedProjects.value?.map((project) => ({
      value: project.id,
      label: project.name,
    }))
  );

  // Selected project
  const selectedProject = ref({
    value: "",
    label: "",
  });

  // Project to delete
  const projectToDelete = ref(null);
  const isDeleteDialogOpen = ref(false);

  // Form schema
  const formSchema = toTypedSchema(
    z.object({
      relatedProject: z.string({
        required_error: "Please select a project.",
      }),
    })
  );

  // Form
  const { handleSubmit, setFieldValue } = useForm({
    validationSchema: formSchema,
    initialValues: {
      relatedProject: "",
    },
  });

  // Submit form
  const onSubmit = handleSubmit(async (values) => {
    console.log(values);

    try {
      // Add project to portfolio
      const updatedPortfolio = await $fetch(`/api/portfolio/add-project`, {
        method: "PUT",
        body: { slug, ...values },
      });

      // Reset form values
      selectedProject.value = { value: "", label: "" };

      // Set the current portfolio in the store with proper date conversion
      if (updatedPortfolio.portfolio) {
        currentPortfolioStore.setCurrentPortfolio(processPortfolioData(updatedPortfolio.portfolio));
      }

      // Refresh projects list
      await refreshProjects();
      await refreshPortfolio();

      // Show success toast
      toast({
        title: "Project added successfully",
        description: "The project has been added to your portfolio.",
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "Error adding project",
        description: "There was an error adding the project to your portfolio.",
        variant: "destructive",
      });
    }
  });

  // Open delete confirmation dialog
  const openDeleteDialog = (id) => {
    projectToDelete.value = id;
    isDeleteDialogOpen.value = true;
  };

  // Delete project
  const deleteProject = async () => {
    if (!projectToDelete.value) return;

    try {
      // Remove project from portfolio
      const updatedPortfolio = await $fetch(`/api/portfolio/remove-project`, {
        method: "PUT",
        body: { slug, relatedProject: projectToDelete.value },
      });

      // Set the current portfolio in the store with proper date conversion
      if (updatedPortfolio.portfolio) {
        currentPortfolioStore.updateCurrentPortfolio(
          processPortfolioData(updatedPortfolio.portfolio)
        );
      }

      // Refresh projects list
      await refreshProjects();
      await refreshPortfolio();

      // Close dialog
      isDeleteDialogOpen.value = false;
      projectToDelete.value = null;

      // Show success toast
      toast({
        title: "Project removed successfully",
        description: "The project has been removed from your portfolio.",
      });
    } catch (error) {
      console.error("Error removing project:", error);
      // Show error toast
      toast({
        title: "Error removing project",
        description: "There was an error removing the project from your portfolio.",
        variant: "destructive",
      });
    }
  };

  console.log(availableProjects.value);
</script>

<template>
  <div class="flex w-full flex-col gap-8 rounded-lg border p-6 shadow-sm md:flex-row">
    <!-- Display current projects section -->
    <div class="mb-8 w-full max-w-2xl">
      <h2 class="mb-4 text-2xl font-semibold">Current Projects</h2>
      <div
        v-if="currentPortfolio?.portfolioProjects?.length > 0"
        class="grid grid-cols-1 gap-4 xl:grid-cols-2"
      >
        <div
          v-for="portfolioProject in currentPortfolio.portfolioProjects"
          :key="portfolioProject.id"
          class="flex items-center justify-between gap-4 rounded-lg border p-4 shadow-sm"
        >
          <h3 class="text-lg font-medium">{{ portfolioProject.project.name }}</h3>
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/projects/${portfolioProject.project.id}`">
              <Button variant="outline" size="icon">
                <Edit class="size-4" />
              </Button>
            </NuxtLink>

            <Button
              variant="outline"
              size="icon"
              @click="openDeleteDialog(portfolioProject.id)"
              class="hover:bg-red-500 hover:text-white"
            >
              <Trash class="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <p v-else class="text-muted-foreground">No projects in this portfolio yet.</p>
    </div>

    <!-- Add project form -->
    <div class="w-full">
      <h2 class="text-2xl font-semibold">Add Project to Portfolio</h2>
      <form @submit="onSubmit">
        <FormField name="relatedProject">
          <FormItem class="flex flex-col">
            <Combobox v-model="selectedProject" by="label" :disabled="!availableProjects?.length">
              <FormControl>
                <ComboboxAnchor as-child>
                  <ComboboxTrigger as-child>
                    <Button
                      variant="outline"
                      class="justify-between"
                      :disabled="!availableProjects?.length"
                    >
                      {{ selectedProject?.label ? selectedProject?.label : "Select project" }}

                      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </ComboboxTrigger>
                </ComboboxAnchor>
              </FormControl>

              <ComboboxList>
                <div class="relative w-full max-w-sm items-center">
                  <ComboboxInput
                    class="h-10 rounded-none border-0 border-b pl-9 focus-visible:ring-0"
                    placeholder="Select project..."
                  />
                  <span class="absolute inset-y-0 start-0 flex items-center justify-center px-3">
                    <Search class="size-4 text-muted-foreground" />
                  </span>
                </div>

                <ComboboxEmpty> No project found. </ComboboxEmpty>

                <ComboboxGroup>
                  <ComboboxItem
                    v-for="project in availableProjects"
                    :key="project.value"
                    :value="project"
                    @select="
                      () => {
                        setFieldValue('relatedProject', project.value);
                      }
                    "
                  >
                    {{ project.label }}

                    <ComboboxItemIndicator>
                      <Check :class="cn('ml-auto h-4 w-4')" />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>

            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" class="mt-4" :disabled="!availableProjects?.length">
          Add Project
        </Button>

        <p v-if="!availableProjects?.length" class="mt-2 text-sm text-muted-foreground">
          No available projects to add. Create a new project first.
        </p>
      </form>
    </div>

    <!-- Delete confirmation dialog -->
    <AlertDialog v-model:open="isDeleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Project</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this project from your portfolio? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="isDeleteDialogOpen = false">Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="deleteProject"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
