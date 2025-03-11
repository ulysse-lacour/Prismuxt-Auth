<script setup lang="ts">
  /**
   * Projects Navigation Component
   *
   * Displays a list of projects in the sidebar
   * Provides dropdown actions for each project
   */
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from "@/components/ui/sidebar";
  import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-vue-next";
  import type { LucideIcon } from "lucide-vue-next";

  // Component props
  defineProps<{
    projects: {
      name: string;
      url: string;
      icon: LucideIcon;
    }[];
  }>();

  // Get sidebar state for responsive dropdown positioning
  const { isMobile } = useSidebar();
</script>

<template>
  <SidebarGroup class="group-data-[collapsible=icon]:hidden">
    <!-- Projects section label -->
    <SidebarGroupLabel>Projects</SidebarGroupLabel>

    <!-- Projects menu list -->
    <SidebarMenu>
      <!-- Individual project item -->
      <SidebarMenuItem v-for="item in projects" :key="item.name">
        <!-- Project link with icon -->
        <SidebarMenuButton as-child>
          <a :href="item.url">
            <component :is="item.icon" />
            <span>{{ item.name }}</span>
          </a>
        </SidebarMenuButton>

        <!-- Project actions dropdown -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <SidebarMenuAction show-on-hover>
              <MoreHorizontal />
              <span class="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>

          <!-- Dropdown menu content -->
          <DropdownMenuContent
            class="w-48 rounded-lg"
            :side="isMobile ? 'bottom' : 'right'"
            :align="isMobile ? 'end' : 'start'"
          >
            <!-- View project action -->
            <DropdownMenuItem>
              <Folder class="text-muted-foreground" />
              <span>View Project</span>
            </DropdownMenuItem>

            <!-- Share project action -->
            <DropdownMenuItem>
              <Forward class="text-muted-foreground" />
              <span>Share Project</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- Delete project action -->
            <DropdownMenuItem>
              <Trash2 class="text-muted-foreground" />
              <span>Delete Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <!-- More projects button -->
      <SidebarMenuItem>
        <SidebarMenuButton class="text-sidebar-foreground/70">
          <MoreHorizontal class="text-sidebar-foreground/70" />
          <span>More</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
