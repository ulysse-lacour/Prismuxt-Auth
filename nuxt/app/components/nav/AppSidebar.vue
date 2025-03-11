<script setup lang="ts">
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
  } from "@/components/ui/sidebar";
  import { useUserDataStore } from "~/stores/userData";
  import { useProjectStore } from "~/stores/userProjects";
  import { Briefcase, FolderKanban } from "lucide-vue-next";
  import type { SidebarProps } from "@/components/ui/sidebar";
  import type { LucideIcon } from "lucide-vue-next";

  const props = withDefaults(defineProps<SidebarProps>(), {
    collapsible: "icon",
  });

  interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }

  // Fetch current user data
  const { data: userData } = await useFetch("/api/account/current-user");

  // Set projects store
  const { processProjectData } = useProjectData();
  const projectStore = useProjectStore();
  projectStore.setProjects(processProjectData(userData.value?.user?.projects || []));

  // Set portfolios store
  const { processPortfolioData } = usePortfolioData();
  const portfolioStore = usePortfolioStore();
  portfolioStore.setPortfolios(processPortfolioData(userData.value?.user?.portfolios || []));

  // Set user data store
  const { processUserData } = useUserData();
  const userDataStore = useUserDataStore();
  userDataStore.setUser(processUserData(userData.value?.user || {}));

  // Transform navigation data into menu items
  const items = computed<NavItem[]>(() => {
    const route = useRoute();

    return [
      {
        title: "Projects",
        url: "/projects",
        icon: FolderKanban,
        isActive: route.path.startsWith("/projects"),
        items: projectStore.projects.map((project) => ({
          title: project.name,
          url: `/projects/${project.id}`,
        })),
      },
      {
        title: "Portfolios",
        url: "/portfolios",
        icon: Briefcase,
        isActive: route.path.startsWith("/portfolios"),
        items: portfolioStore.portfolios.map((portfolio) => ({
          title: portfolio.name,
          url: `/portfolios/${portfolio.slug}`,
        })),
      },
    ];
  });
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarTrigger />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="items" />
      <!-- <NavProjects :projects="data.projects" /> -->
    </SidebarContent>
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
  </Sidebar>
</template>
