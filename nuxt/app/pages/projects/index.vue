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
  import DataTableFacetedFilter from "~/components/DataTableFacetedFilter.vue";
  import DataTablePagination from "~/components/DataTablePagination.vue";
  import { useProjectData } from "~/composables/useJsonDateConverter";
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
  } from "lucide-vue-next";
  import { computed, h, ref, shallowRef, watch } from "vue";
  import type { Project } from "@prisma/client";
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

  const { fetchAllProjects } = useProjectManagement();
  const { allProjects } = await fetchAllProjects();

  const columns: ColumnDef<Project>[] = [
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
        return h(DropdownMenu, null, () => [
          h(DropdownMenuTrigger, { asChild: true }, () =>
            h(Button, { variant: "ghost", class: "h-8 w-8 p-0" }, () => [
              h("span", { class: "sr-only" }, "Open menu"),
              h(MoreHorizontal, { class: "h-4 w-4" }),
            ])
          ),
          h(DropdownMenuContent, { align: "end" }, () => [
            h(DropdownMenuItem, null, () => "Edit"),
            h(DropdownMenuItem, { class: "text-destructive" }, () => "Delete"),
          ]),
        ]);
      },
    },
  ];

  const sorting = useState<SortingState>("projects-sorting", () => []);
  const columnFilters = useState<ColumnFiltersState>("projects-filters", () => []);
  const columnVisibility = useState<VisibilityState>("projects-visibility", () => ({}));
  const rowSelection = useState("projects-selection", () => ({}));
  const expanded = useState<ExpandedState>("projects-expanded", () => ({}));

  const table = useVueTable({
    data: allProjects,
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

  const clientOptions = computed(() => {
    if (!allProjects) return [];
    const clients = new Set(allProjects.map((project) => project.client));
    return Array.from(clients).map((client) => ({
      label: client,
      value: client,
      icon: Building2,
    }));
  });

  const statusOptions = [
    {
      label: "Active",
      value: "active",
      icon: CheckCircle2,
    },
    {
      label: "In Progress",
      value: "in_progress",
      icon: CircleDot,
    },
    {
      label: "On Hold",
      value: "on_hold",
      icon: Clock,
    },
  ];
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
                v-if="table.getColumn('status')"
                :column="table.getColumn('status')"
                title="Status"
                :options="statusOptions"
              />
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
  </div>
</template>
