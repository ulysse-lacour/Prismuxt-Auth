<script setup lang="ts">
  // import {
  //   Breadcrumb,
  //   BreadcrumbItem,
  //   BreadcrumbLink,
  //   BreadcrumbList,
  //   BreadcrumbPage,
  //   BreadcrumbSeparator,
  // } from "@/components/ui/breadcrumb";
  // import { Separator } from "@/components/ui/separator";

  import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <div class="md:hidden">
            <SidebarTrigger />
          </div>
          <!-- <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#"> Building Your Application </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> -->
        </div>
      </header>
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
