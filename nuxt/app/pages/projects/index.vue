<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { Checkbox } from "@/components/ui/checkbox";
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Input } from "@/components/ui/input";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    FlexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
  } from "@tanstack/vue-table";
  import { toast } from "~/components/ui/toast";
  import { useProjectManagement } from "~/composables/useProjectManagement";
  import {
    ArrowUpDown,
    Building2,
    CheckCircle2,
    ChevronDown,
    CircleDot,
    Clock,
    Filter,
    MoreHorizontal,
    X,
  } from "lucide-vue-next";
  import { computed, h, ref } from "vue";
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

  const { fetchAllProjects, deleteProject } = useProjectManagement();
  const { allProjects } = await fetchAllProjects();
  tableProjects.value = allProjects;

  //   console.log(allProjects);

  const columns: ColumnDef<ProjectWithTags>[] = [
    {
      id: "select",
      header: "Select",
      cell: ({ row }) =>
        h(Checkbox, {
          modelValue: row.getIsSelected(),
          "onUpdate:modelValue": (value) => row.toggleSelected(!!value),
          ariaLabel: "Select row",
        }),
      enableSorting: false,
      enableHiding: false,
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
        return h("span", null, [...projectTags].join(", "));
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
      id: "actions",
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
</script>

<template>
  <div class="w-full">
    <ClientOnly>
      <div>
        <div class="flex flex-col gap-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex flex-1 items-center space-x-2">
              <Input
                placeholder="Filter projects..."
                :model-value="table.getColumn('name')?.getFilterValue() as string"
                @update:model-value="table.getColumn('name')?.setFilterValue($event)"
                class="h-8 w-[150px] lg:w-[250px]"
              />
              <DataTableFacetedFilter
                v-if="table.getColumn('client')"
                :column="table.getColumn('client')"
                title="Client"
                :options="clientOptions"
              />
              <DataTableFacetedFilter
                v-if="table.getColumn('projectTags')"
                :column="table.getColumn('projectTags')"
                title="Tags"
                :options="tagsOptions"
              />
              <Button
                v-if="isFiltered"
                variant="ghost"
                class="h-8 px-2 lg:px-3"
                @click="table.resetColumnFilters()"
              >
                Reset
                <X class="ml-2 h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="outline" size="sm" class="ml-auto h-8">
                    <Filter class="mr-2 h-4 w-4" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
                    :key="column.id"
                    class="capitalize"
                    :model-value="column.getIsVisible()"
                    @update:model-value="(value) => column.toggleVisibility(!!value)"
                  >
                    {{ column.id }}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                <TableHead v-for="header in headerGroup.headers" :key="header.id">
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="table.getRowModel().rows?.length">
                <template v-for="row in table.getRowModel().rows" :key="row.id">
                  <TableRow :data-state="row.getIsSelected() && 'selected'">
                    <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                      <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="row.getIsExpanded()">
                    <TableCell :colspan="row.getAllCells().length">
                      {{ JSON.stringify(row.original) }}
                    </TableCell>
                  </TableRow>
                </template>
              </template>

              <TableRow v-else>
                <TableCell :colspan="columns.length" class="h-24 text-center">
                  No projects found. Create your first project to get started.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <DataTablePagination :table="table" />
      </div>
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
