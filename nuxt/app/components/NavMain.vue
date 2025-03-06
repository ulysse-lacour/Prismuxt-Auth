<script setup lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
  import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
  } from "@/components/ui/sidebar";
  import { useProjectStore } from "~/stores/projectStore";
  import { Briefcase, ChevronRight, FolderKanban } from "lucide-vue-next";
  import type { LucideIcon } from "lucide-vue-next";

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

  // Fetch menu items
  const { data: menuItems } = await useFetch("/api/user-nav-menu");

  // Set projects store
  const projectStore = useProjectStore();
  projectStore.setProjects(menuItems.value?.projects || []);

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
          title: project.title,
          url: project.url,
        })),
      },
      {
        title: "Portfolios",
        url: "/portfolios",
        icon: Briefcase,
        isActive: route.path.startsWith("/portfolios"),
        items: menuItems.value?.portfolios || [],
      },
    ];
  });
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible
        v-for="item in items"
        :key="item.title"
        as-child
        :default-open="item.isActive"
        class="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton :tooltip="item.title">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                <SidebarMenuSubButton as-child>
                  <NuxtLink :to="subItem.url">
                    <span>{{ subItem.title }}</span>
                  </NuxtLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
