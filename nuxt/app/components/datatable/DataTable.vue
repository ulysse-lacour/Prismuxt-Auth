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
  import { ArrowUpDown, Filter, MoreHorizontal, X } from "lucide-vue-next";
  import { computed, h, ref } from "vue";
  import type {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    SortingState,
    VisibilityState,
  } from "@tanstack/vue-table";

  import DataTableFacetedFilter from "./DataTableFacetedFilter.vue";
  import DataTablePagination from "./DataTablePagination.vue";

  interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    defaultPageSize?: number;
    defaultColumnVisibility?: VisibilityState;
    defaultSorting?: SortingState;
    defaultColumnFilters?: ColumnFiltersState;
    defaultExpanded?: ExpandedState;
    defaultRowSelection?: Record<string, boolean>;
  }

  interface DataTableEmits<TData> {
    (e: "rowClick", row: TData): void;
    (e: "edit", row: TData): void;
    (e: "delete", row: TData): void;
  }

  const props = defineProps<DataTableProps<any>>();
  const emit = defineEmits<DataTableEmits<any>>();

  const sorting = ref<SortingState>(props.defaultSorting || []);
  const columnFilters = ref<ColumnFiltersState>(props.defaultColumnFilters || []);
  const columnVisibility = ref<VisibilityState>(props.defaultColumnVisibility || {});
  const rowSelection = ref(props.defaultRowSelection || {});
  const expanded = ref<ExpandedState>(props.defaultExpanded || {});

  const table = useVueTable({
    data: props.data,
    columns: props.columns,
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
        pageSize: props.defaultPageSize || 10,
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

  const isFiltered = computed(() => table.getState().columnFilters.length > 0);
</script>

<template>
  <div class="w-full">
    <div>
      <div class="flex flex-col gap-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Filter..."
              :model-value="table.getColumn('name')?.getFilterValue() as string"
              @update:model-value="table.getColumn('name')?.setFilterValue($event)"
              class="h-8 w-[150px] lg:w-[250px]"
            />
            <slot name="filters" :table="table" />
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
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <template v-for="row in table.getRowModel().rows" :key="row.id">
                <TableRow
                  :data-state="row.getIsSelected() && 'selected'"
                  @click="emit('rowClick', row.original)"
                >
                  <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </TableCell>
                </TableRow>
                <TableRow v-if="row.getIsExpanded()">
                  <TableCell :colspan="row.getAllCells().length">
                    <slot name="expanded" :row="row.original" />
                  </TableCell>
                </TableRow>
              </template>
            </template>

            <TableRow v-else>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                <slot name="empty"> No results found. </slot>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <DataTablePagination :table="table" />
    </div>
  </div>
</template>
