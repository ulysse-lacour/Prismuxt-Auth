<script setup lang="ts">
  /**
   * Auth layout component
   *
   * Provides the authenticated application layout with sidebar navigation
   * Used for all authenticated routes in the application
   */
  import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
</script>

<template>
  <SidebarProvider>
    <!-- Main sidebar navigation component -->
    <AppSidebar />

    <!-- Main content area with header and content slot -->
    <SidebarInset class="px-4 pb-16">
      <!-- Header with mobile sidebar trigger -->
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <!-- Mobile sidebar trigger button -->
          <div class="md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </header>

      <!-- Page content -->
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
