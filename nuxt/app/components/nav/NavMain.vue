<script setup lang="ts">
  /**
   * Main Navigation Component
   *
   * Displays the main navigation menu with collapsible sections
   * Used in the sidebar to show projects and portfolios
   */
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
    useSidebar,
  } from "@/components/ui/sidebar";
  import { ChevronRight } from "lucide-vue-next";
  import type { LucideIcon } from "lucide-vue-next";

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

  // Component props
  const props = defineProps<{
    items: NavItem[];
  }>();

  // Sidebar state and controls
  const { isMobile, state, toggleSidebar } = useSidebar();

  /**
   * Track open state for each collapsible navigation section
   */
  const openStates = ref<Record<string, boolean>>({});

  // Initialize open states based on isActive property
  props.items.forEach((item) => {
    openStates.value[item.title] = item.isActive || false;
  });

  /**
   * Handle click on collapsible trigger
   * Expands sidebar if collapsed and toggles section visibility
   *
   * @param {string} itemTitle - Title of the clicked navigation item
   */
  const handleTriggerClick = (itemTitle: string) => {
    if (state.value === "collapsed") {
      // If sidebar is collapsed, expand it and ensure the item is open
      toggleSidebar();
      openStates.value[itemTitle] = true;
    } else {
      // If sidebar is already expanded, toggle the item's open state
      openStates.value[itemTitle] = !openStates.value[itemTitle];
    }
  };
</script>

<template>
  <SidebarGroup>
    <!-- Navigation group label -->
    <SidebarGroupLabel>Content</SidebarGroupLabel>

    <!-- Main navigation menu -->
    <SidebarMenu>
      <!-- Collapsible section for each navigation item -->
      <Collapsible
        v-for="item in items"
        :key="item.title"
        as-child
        :open="openStates[item.title]"
        class="group/collapsible"
      >
        <SidebarMenuItem>
          <!-- Collapsible trigger with icon and label -->
          <CollapsibleTrigger as-child @click.prevent="handleTriggerClick(item.title)">
            <SidebarMenuButton :tooltip="item.title">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <!-- Collapsible content with sub-items -->
          <CollapsibleContent>
            <SidebarMenuSub>
              <!-- Sub-item for each child navigation item -->
              <SidebarMenuSubItem
                v-for="subItem in item.items"
                :key="subItem.title"
                :class="subItem.className"
                class="relative"
              >
                <SidebarMenuSubButton as-child>
                  <NuxtLink :to="subItem.url" class="flex items-center gap-2">
                    <component :is="subItem.icon" v-if="subItem.icon" class="h-4 w-4" />
                    <span>{{ subItem.title }}</span>
                  </NuxtLink>
                </SidebarMenuSubButton>
                <!-- <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <SidebarMenuAction>
                      <MoreHorizontal />
                      <span class="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    class="w-48 rounded-lg"
                    :side="isMobile ? 'bottom' : 'right'"
                    :align="isMobile ? 'end' : 'start'"
                  >
                    <DropdownMenuItem>
                      <Folder class="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward class="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 class="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> -->
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
