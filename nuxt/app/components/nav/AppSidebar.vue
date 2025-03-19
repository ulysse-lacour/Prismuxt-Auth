<script setup lang="ts">
  import { Briefcase, FolderKanban, Plus } from "lucide-vue-next";
  import type { SidebarProps } from "../../components/ui/sidebar";
  import type { LucideIcon } from "lucide-vue-next";

  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
  } from "../../components/ui/sidebar";
  import { useUserDataStore } from "../../stores/userData";
  import { useProjectStore } from "../../stores/userProjects";

  /**
   * App Sidebar Component
   *
   * Main navigation sidebar for the application
   * Displays projects, portfolios, and user navigation
   */

  // Component props with defaults
  const props = withDefaults(defineProps<SidebarProps>(), {
    collapsible: "icon",
  });

  /**
   * Navigation item interface
   */
  interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      className?: string;
    }[];
  }

  /**
   * Fetch current user data from API
   */
  const { data: userData } = await useFetch("/api/account/current-user");

  // Initialize stores with user data
  const { processProjectData } = useProjectData();
  const projectStore = useProjectStore();
  projectStore.setProjects(processProjectData(userData.value?.user?.projects || []));

  const { processPortfolioData } = usePortfolioData();
  const portfoliosStore = usePortfoliosStore();
  portfoliosStore.setPortfolios(processPortfolioData(userData.value?.user?.portfolios || []));

  const { processUserData } = useUserData();
  const userDataStore = useUserDataStore();
  userDataStore.setUser(processUserData(userData.value?.user || {}));

  /**
   * Transform navigation data into menu items
   * Includes projects and portfolios with active state based on current route
   */
  const items = computed<NavItem[]>(() => {
    const route = useRoute();

    return [
      {
        title: "Projects",
        url: "/projects",
        icon: FolderKanban,
        isActive: route.path.startsWith("/projects"),
        items: [
          ...projectStore.projects.map((project) => ({
            title: project.name,
            url: `/projects/${project.id}`,
          })),
          {
            title: "New",
            url: "/projects/create",
            icon: Plus,
          },
        ],
      },
      {
        title: "Portfolios",
        url: "/portfolios",
        icon: Briefcase,
        isActive: route.path.startsWith("/portfolios"),
        items: [
          ...portfoliosStore.portfolios.map((portfolio) => ({
            title: portfolio.name,
            url: `/portfolios/${portfolio.slug}`,
          })),
          {
            title: "New",
            url: "/portfolios/create",
            icon: Plus,
          },
        ],
      },
    ];
  });

  // const data = {
  //   projects: [
  //     {
  //       name: "Design Engineering",
  //       url: "#",
  //       icon: Frame,
  //     },
  //     {
  //       name: "Sales & Marketing",
  //       url: "#",
  //       icon: PieChart,
  //     },
  //     {
  //       name: "Travel",
  //       url: "#",
  //       icon: Map,
  //     },
  //   ],
  // };
</script>

<template>
  <Sidebar v-bind="props">
    <!-- Sidebar header with collapse trigger -->
    <SidebarHeader>
      <SidebarTrigger />
    </SidebarHeader>

    <!-- Main navigation content -->
    <SidebarContent>
      <NavMain :items="items" />
      <!-- <NavProjects :projects="data.projects" /> -->
    </SidebarContent>

    <!-- User navigation in footer -->
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
  </Sidebar>
</template>
