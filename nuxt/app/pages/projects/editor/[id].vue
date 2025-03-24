<script setup lang="ts">
  /**
   * Project Display Editor Page
   *
   * Page for managing the display of a specific project identified by its ID
   */

  // Define page metadata
  definePageMeta({
    layout: "editor",
  });

  // Composables
  const { fetchProjectForEditor, fetchProjectLanguages } = useProjectManagement();
  const { processData } = useJsonToDate();
  const { processProjectContentData } = useProjectContentData();
  const { processProjectData } = useProjectData();

  // Route parameters
  const route = useRoute();
  const id = route.params.id as string;

  // Fetch data with await to ensure server-side rendering
  const [languagesResponse, projectResponse] = await Promise.all([
    fetchProjectLanguages(id),
    fetchProjectForEditor(id),
  ]);

  // Extract data from responses
  const { languages } = languagesResponse;
  const { project } = projectResponse;

  // Store the current language code in a ref
  const currentLanguageCode = ref("en");

  // Store the current rotation in a ref
  const currentRotation = ref<"horizontal" | "vertical">("horizontal");

  // Find the initial project content (default to English)
  const initialContent = project.project.projectContents.find(
    (content) => content.language.code === "en"
  );

  // If the initial content is not found, create an empty project content
  const emptyProjectContent = {
    projectContent: {
      contentBlocks: [],
    },
  };

  // Set the selected language based on initial content
  const selectedLanguage = ref(initialContent?.language.code || "en");

  // Initialize the current language code
  currentLanguageCode.value = selectedLanguage.value;

  // Create a computed property that finds the content based on the current language code
  const projectContent = computed(() => {
    return (
      project.project.projectContents.find(
        (content) => content.language.code === currentLanguageCode.value
      ) || emptyProjectContent
    );
  });

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    // Update the current language code
    currentLanguageCode.value = newLanguage;

    // Scroll to the top of the page when language changes
    // This helps reset the view and prevents issues with active slide detection
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 10);
  };

  // Watch for changes in selectedLanguage
  watch(selectedLanguage, (newValue) => {
    handleLanguageChange(newValue);
  });
</script>

<template>
  <div>
    <header class="flex min-h-16 shrink-0 items-center justify-between gap-2 p-6 py-8">
      <h1 class="text-6xl">{{ project.project.name }}</h1>
      <div class="flex gap-6">
        <LanguageSelector
          :languages="processData({ languages })"
          v-model:selectedLanguage="selectedLanguage"
        />
        <RotateSelector v-model:rotate="currentRotation" />
      </div>
    </header>

    <ProjectDisplayEditor
      :project="processProjectData(project.project)"
      :project-content="processProjectContentData(projectContent)"
      :rotate="currentRotation"
    />
  </div>
</template>
