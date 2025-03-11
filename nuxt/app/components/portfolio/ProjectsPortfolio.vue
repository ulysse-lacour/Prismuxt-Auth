<script setup lang="ts">
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
  import { cn } from "@/lib/utils";
  import { toTypedSchema } from "@vee-validate/zod";
  import { useCurrentPortfolioStore } from "~/stores/currentPortfolio";
  import { Check, ChevronsUpDown, Search } from "lucide-vue-next";
  import { useForm } from "vee-validate";
  import { h, ref } from "vue";
  import * as z from "zod";

  const { slug } = useRoute().params;
  const currentPortfolioStore = useCurrentPortfolioStore();

  const { data: projects, refresh: refreshProjects } = await useFetch(
    `/api/portfolio/all-projects`,
    {
      params: { slug },
    }
  );

  console.log(projects);

  const unlinkedProjects = computed(() => projects.value?.filter((project) => !project.isLinked));

  const availableProjects = computed(() =>
    unlinkedProjects.value?.map((project) => ({
      value: project.id,
      label: project.name,
    }))
  );

  const selectedProject = ref({
    value: "",
    label: "",
  });

  const formSchema = toTypedSchema(
    z.object({
      relatedProject: z.string({
        required_error: "Please select a project.",
      }),
    })
  );

  const { handleSubmit, setFieldValue } = useForm({
    validationSchema: formSchema,
    initialValues: {
      relatedProject: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    console.log(values);

    try {
      const updatedPortfolio = await $fetch(`/api/portfolio/add-project`, {
        method: "PUT",
        body: { slug, ...values },
      });

      console.log(updatedPortfolio);

      // Reset form values
      selectedProject.value = { value: "", label: "" };

      // Set the current portfolio in the store with proper date conversion
      if (updatedPortfolio.portfolio) {
        const portfolioData = updatedPortfolio.portfolio;

        // Convert date strings to Date objects
        const portfolioWithDates = {
          ...portfolioData,
          createdAt: new Date(portfolioData.createdAt),
          updatedAt: new Date(portfolioData.updatedAt),
          // Process portfolioProjects if they exist
          portfolioProjects: (portfolioData.portfolioProjects || []).map((pp) => ({
            ...pp,
            createdAt: pp.createdAt ? new Date(pp.createdAt) : new Date(),
            updatedAt: pp.updatedAt ? new Date(pp.updatedAt) : new Date(),
            project: {
              ...pp.project,
              createdAt: new Date(pp.project.createdAt),
              updatedAt: new Date(pp.project.updatedAt),
            },
          })),
        };

        // Refresh portfolio
        currentPortfolioStore.setCurrentPortfolio(portfolioWithDates);
      }

      // Refresh projects list
      await refreshProjects();

      toast({
        title: "Project added successfully",
        description: "The project has been added to your portfolio.",
      });
    } catch (error) {
      console.error("Error adding project:", error);
      toast({
        title: "Error adding project",
        description: "There was an error adding the project to your portfolio.",
        variant: "destructive",
      });
    }
  });
</script>

<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-semibold">Add Project to Portfolio</h2>
    <form class="space-y-6" @submit="onSubmit">
      <FormField name="relatedProject">
        <FormItem class="flex flex-col">
          <FormLabel>Project</FormLabel>
          <Combobox v-model="selectedProject" by="label">
            <FormControl>
              <ComboboxAnchor as-child>
                <ComboboxTrigger as-child>
                  <Button variant="outline" class="justify-between">
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

          <FormDescription> Select a project to add to the portfolio. </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="mt-4"> Add Project </Button>
    </form>
  </div>
</template>
