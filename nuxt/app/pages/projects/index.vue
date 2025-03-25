<script setup lang="ts">
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
  } from "@tanstack/vue-table";
  import { Icon } from "#components";
  import { toast } from "~/components/ui/toast";
  import { useProjectManagement } from "~/composables/useProjectManagement";
  import { ArrowUpDown, Building2, MoreHorizontal } from "lucide-vue-next";
  import type {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    SortingState,
    VisibilityState,
  } from "@tanstack/vue-table";

  definePageMeta({
    layout: "auth",
  });

  const router = useRouter();
  const isDeleteDialogOpen = ref(false);
  const projectToDelete = ref<string | null>(null);
  const tableProjects = ref<ProjectWithTags[]>([]);
  const dataTable = ref();

  const { fetchAllProjects, deleteProject, reorderProjects } = useProjectManagement();
  const { allProjects } = await fetchAllProjects();
  tableProjects.value = allProjects;

  //   console.log(allProjects);

  const columns: ColumnDef<ProjectWithTags>[] = [
    {
      id: "dragHandle",
      enableHiding: false,
      enableSorting: false,
      enableColumnFilter: false,
      cell: () => {
        return h("div", { class: "drag-handle cursor-move" }, () =>
          h(Icon, { name: "lucide:grip-vertical", class: "h-4 w-4 text-muted-foreground" })
        );
      },
    },
    {
      accessorKey: "order",
      header: ({ column }) => {
        return h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => ["Order", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => ["Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
        );
      },
    },
    {
      accessorKey: "projectTags",
      header: ({ column }) => {
        return h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => ["Tags", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
        );
      },
      cell: ({ row }) => {
        const tags = row.getValue("projectTags") as any[];
        const projectTags = new Set(tags.map((projectTag) => projectTag.tag.name));
        return h(
          "div",
          { class: "flex flex-wrap gap-1" },
          [...projectTags].map((tag) => h(Badge, { variant: "secondary" }, () => tag))
        );
      },
      filterFn: (row, id, value) => {
        const tags = row.getValue(id) as any[];
        if (!tags) return false;
        const projectTags = tags.map((projectTag) => projectTag.tag.name);
        return value.some((val: string) => projectTags.includes(val));
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => ["Description", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
        );
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "client",
      header: ({ column }) => {
        return h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => ["Client", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => ["Created At", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return h("span", null, date.toLocaleDateString("en-GB"));
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => ["Updated At", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("updatedAt") as Date;
        return h("span", null, date.toLocaleDateString("en-GB"));
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const projectId = row.original.id;
        return h(DropdownMenu, null, () => [
          h(DropdownMenuTrigger, { asChild: true }, () =>
            h(Button, { variant: "ghost", class: "h-8 w-8 p-0" }, () => [
              h("span", { class: "sr-only" }, "Open menu"),
              h(MoreHorizontal, { class: "h-4 w-4" }),
            ])
          ),
          h(DropdownMenuContent, { align: "end" }, () => [
            h(
              DropdownMenuItem,
              {
                onClick: () => router.push(`/projects/${projectId}`),
              },
              () => "Edit"
            ),
            h(
              DropdownMenuItem,
              {
                class: "text-destructive",
                onClick: () => openDeleteDialog(projectId),
              },
              () => "Delete"
            ),
          ]),
        ]);
      },
    },
  ];

  const sorting = ref<SortingState>([]);
  const columnFilters = ref<ColumnFiltersState>([]);
  const columnVisibility = ref<VisibilityState>({});
  const rowSelection = ref({});
  const expanded = ref<ExpandedState>({});

  const table = useVueTable<ProjectWithTags>({
    data: tableProjects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
    onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
    initialState: {
      pagination: {
        pageSize: 2,
      },
      columnVisibility: {
        description: false,
      },
    },
    state: {
      get sorting() {
        return sorting.value;
      },
      get columnFilters() {
        return columnFilters.value;
      },
      get columnVisibility() {
        return columnVisibility.value;
      },
      get rowSelection() {
        return rowSelection.value;
      },
      get expanded() {
        return expanded.value;
      },
    },
  });

  // Set initial column visibility
  table.getColumn("description")?.toggleVisibility(false);

  interface FilterOption {
    label: string;
    value: string;
    icon?: Component;
  }

  const clientOptions = computed<FilterOption[]>(() => {
    if (!tableProjects.value) return [];
    const clients = new Set(
      tableProjects.value
        .map((project) => project.client)
        .filter((client): client is string => Boolean(client))
    );
    return Array.from(clients).map((client) => ({
      label: client,
      value: client,
      icon: Building2,
    }));
  });

  const tagsOptions = computed<FilterOption[]>(() => {
    if (!tableProjects.value) return [];

    const allProjectsTags = tableProjects.value.map((project) => project.projectTags);

    // Flatten array of arrays and get unique tag names
    const projectsTags = new Set(
      allProjectsTags
        .flat() // Flatten array of project tags
        .filter(Boolean) // Remove any null/undefined values
        .map((projectTag) => projectTag.tag.name)
    );

    return Array.from(projectsTags).map((tag) => ({
      label: tag,
      value: tag,
      icon: Building2,
    }));
  });

  const isFiltered = computed(() => table.getState().columnFilters.length > 0);

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      // Refresh the projects list
      const { allProjects: updatedProjects } = await fetchAllProjects();
      tableProjects.value = updatedProjects;

      // Close dialog
      isDeleteDialogOpen.value = false;
      projectToDelete.value = null;

      // Show success toast
      toast({
        title: "Project deleted",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete project:", error);

      // Show error notification
      toast({
        title: "Project deletion failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (projectId: string) => {
    projectToDelete.value = projectId;
    isDeleteDialogOpen.value = true;
  };

  const handleReorder = async (newOrder: string[]) => {
    try {
      console.log("Reordering projects:", newOrder); // Debug log
      // Get the full project objects in the new order
      const reorderedProjects = newOrder
        .map((id) => tableProjects.value.find((project) => project.id === id))
        .filter((project): project is ProjectWithTags => project !== undefined);

      await reorderProjects(reorderedProjects);
      // Refresh the projects list after reordering
      const { allProjects: updatedProjects } = await fetchAllProjects();
      tableProjects.value = updatedProjects;

      toast({
        title: "Projects reordered",
        description: "The order of projects has been updated successfully",
      });
    } catch (error) {
      console.error("Failed to reorder projects:", error);
      toast({
        title: "Failed to reorder projects",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };
</script>

<template>
  <div class="w-full">
    <ClientOnly>
      <DataTable
        ref="dataTable"
        :data="tableProjects"
        :columns="columns"
        :table="table"
        search-key="name"
        :page-size="10"
        @reorder="handleReorder"
      >
        <template #filters>
          <DataTableFacetedFilter
            v-if="dataTable?.table.getColumn('client')"
            :column="dataTable.table.getColumn('client')"
            title="Client"
            :options="clientOptions"
          />
          <DataTableFacetedFilter
            v-if="dataTable?.table.getColumn('projectTags')"
            :column="dataTable.table.getColumn('projectTags')"
            title="Tags"
            :options="tagsOptions"
          />
        </template>
        <template #empty> No projects found. Create your first project to get started. </template>
      </DataTable>
    </ClientOnly>

    <!-- Delete Confirmation Dialog -->
    <DeleteConfirmDialog
      v-model:open="isDeleteDialogOpen"
      title="Delete Project"
      description="Are you sure you want to delete this project? This action cannot be undone and will remove all associated data."
      @confirm="projectToDelete && handleDeleteProject(projectToDelete)"
    />
  </div>
</template>
