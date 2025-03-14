<script setup lang="ts">
  /**
   * Portfolio Projects Component
   *
   * Displays and manages projects in a portfolio
   * Allows adding and removing projects
   */

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
  // Composables
  import { usePortfolioManagement } from "@/composables/usePortfolioManagement";
  // Utils
  import { cn } from "@/lib/utils";
  // Stores
  import { useCurrentPortfolioStore } from "@/stores/currentPortfolio";
  import { toTypedSchema } from "@vee-validate/zod";
  // Icons
  import { Check, ChevronsUpDown, Edit, Search, Trash } from "lucide-vue-next";
  // Form
  import { useForm } from "vee-validate";
  import * as z from "zod";

  // Define project type interface
  interface ProjectWithLinkStatus {
    id: string;
    name: string;
    isLinked: boolean;
    portfolioProjects?: any[];
    [key: string]: any;
  }

  // Define props
  const props = defineProps({
    portfolioData: {
      type: Object,
      required: true,
    },
    projects: {
      type: Array as PropType<ProjectWithLinkStatus[]>,
      required: true,
      default: () => [],
    },
    slug: {
      type: String,
      required: true,
    },
  });

  // Create a local ref for projects data with proper typing
  const localProjects = ref<ProjectWithLinkStatus[]>(props.projects);

  // Watch for changes in props.projects
  watch(
    () => props.projects,
    (newProjects) => {
      localProjects.value = newProjects;
    },
    { immediate: true }
  );

  // Composables
  const { addProjectToPortfolio, removeProjectFromPortfolio, fetchAllProjects } =
    usePortfolioManagement();

  //  Current portfolio projects
  const currentPortfolioStore = useCurrentPortfolioStore();
  const currentPortfolio = computed(() => currentPortfolioStore.currentPortfolio);

  // Set current portfolio from props
  onMounted(() => {
    if (props.portfolioData) {
      currentPortfolioStore.setCurrentPortfolio(props.portfolioData.portfolio);
    }
  });

  /**
   * Filter projects not linked to the portfolio
   */
  const unlinkedProjects = computed(() =>
    localProjects.value.filter((project) => !project.isLinked)
  );

  /**
   * Structure projects for the dropdown
   */
  const availableProjects = computed(() =>
    unlinkedProjects.value.map((project) => ({
      value: project.id,
      label: project.name,
    }))
  );

  // UI state
  const selectedProject = ref({
    value: "",
    label: "",
  });
  const projectToDelete = ref(null);
  const isDeleteDialogOpen = ref(false);

  /**
   * Define validation schema using zod
   * Validates form fields before submission
   */
  const formSchema = toTypedSchema(
    z.object({
      relatedProject: z.string({
        required_error: "Please select a project.",
      }),
    })
  );

  /**
   * Initialize form with validation
   */
  const { handleSubmit, setFieldValue } = useForm({
    validationSchema: formSchema,
    initialValues: {
      relatedProject: "",
    },
  });

  /**
   * Handle form submission to add project to portfolio
   */
  const onSubmit = handleSubmit(async (values) => {
    try {
      await addProjectToPortfolio(props.slug, values.relatedProject);

      // Reset form values
      selectedProject.value = { value: "", label: "" };
      setFieldValue("relatedProject", "");

      // Refresh the projects list
      const { projects: refreshedProjects } = await fetchAllProjects(props.slug);
      if (refreshedProjects.value) {
        localProjects.value = refreshedProjects.value;
      }

      // Show success toast
      toast({
        title: "Project added",
        description: "Project has been added to your portfolio",
      });
    } catch (error) {
      console.error("Failed to add project:", error);
      toast({
        title: "Failed to add project",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });

  /**
   * Open delete confirmation dialog
   * @param {string} id - ID of the project to delete
   */
  const openDeleteDialog = (id) => {
    projectToDelete.value = id;
    isDeleteDialogOpen.value = true;
  };

  /**
   * Delete project from portfolio after confirmation
   */
  const deleteProject = async () => {
    if (!projectToDelete.value) return;

    try {
      // Use the composable to remove project from portfolio
      await removeProjectFromPortfolio(props.slug, projectToDelete.value);

      // Close dialog
      isDeleteDialogOpen.value = false;

      // Refresh the projects list
      const { projects: refreshedProjects } = await fetchAllProjects(props.slug);
      if (refreshedProjects.value) {
        localProjects.value = refreshedProjects.value;
      }

      // Show success toast
      toast({
        title: "Project removed",
        description: "Project has been removed from your portfolio",
      });
    } catch (error) {
      console.error("Failed to remove project:", error);
      toast({
        title: "Failed to remove project",
        description: "Please try again",
        variant: "destructive",
      });
      isDeleteDialogOpen.value = false;
    }
  };
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
        <!-- Project card for each project in portfolio -->
        <div
          v-for="portfolioProject in currentPortfolio.portfolioProjects"
          :key="portfolioProject.id"
          class="flex items-center justify-between gap-4 rounded-lg border p-4 shadow-sm"
        >
          <h3 class="text-lg font-medium">{{ portfolioProject.project.name }}</h3>
          <div class="flex items-center gap-2">
            <!-- Edit project button -->
            <NuxtLink :to="`/projects/${portfolioProject.project.id}`">
              <Button variant="outline" size="icon">
                <Edit class="size-4" />
              </Button>
            </NuxtLink>

            <!-- Remove project button -->
            <Button
              variant="outline"
              size="icon"
              class="hover:bg-red-500 hover:text-white"
              @click="openDeleteDialog(portfolioProject.id)"
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
            <!-- Project selection dropdown -->
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
                <!-- Search input for projects -->
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

                <!-- Project options -->
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

        <!-- Submit button -->
        <Button type="submit" class="mt-4" :disabled="!availableProjects?.length">
          Add Project
        </Button>

        <!-- Message when no projects are available -->
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
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            @click="deleteProject"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
