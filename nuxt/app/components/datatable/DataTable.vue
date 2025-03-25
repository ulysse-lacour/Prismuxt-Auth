<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
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
  import { Icon } from "#components";
  import { Filter, X } from "lucide-vue-next";
  import draggable from "vuedraggable";
  import type {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    SortingState,
    Table as TableType,
    VisibilityState,
  } from "@tanstack/vue-table";

  interface Props {
    data: any[];
    columns: ColumnDef<any>[];
    searchKey?: string;
    pageSize?: number;
    table?: TableType<any>;
    onReorder?: (newOrder: any[]) => void;
  }

  const props = withDefaults(defineProps<Props>(), {
    searchKey: "name",
    pageSize: 10,
  });

  const emit = defineEmits<{
    (e: "delete", id: string): void;
    (e: "edit", id: string): void;
  }>();

  const sorting = ref<SortingState>([]);
  const columnFilters = ref<ColumnFiltersState>([]);
  const columnVisibility = ref<VisibilityState>({});
  const rowSelection = ref({});
  const expanded = ref<ExpandedState>({});

  // Make data reactive
  const tableData = computed(() => props.data);

  const table =
    props.table ||
    useVueTable({
      data: tableData,
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
          pageSize: props.pageSize,
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

  // Expose the table instance to the parent component
  defineExpose({
    table,
  });

  const isFiltered = computed(() => table.getState().columnFilters.length > 0);

  // Helper function for state updates
  function valueUpdater<T>(updaterOrValue: T | ((old: T) => T), ref: Ref<T>) {
    ref.value =
      typeof updaterOrValue === "function"
        ? (updaterOrValue as (old: T) => T)(ref.value)
        : updaterOrValue;
  }

  const handleDragChange = (evt: any) => {
    if (props.onReorder) {
      props.onReorder(tableData.value);
    }
  };
</script>

<template>
  <div class="w-full">
    <div class="flex flex-col gap-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter..."
            :model-value="table.getColumn(searchKey)?.getFilterValue() as string"
            @update:model-value="table.getColumn(searchKey)?.setFilterValue($event)"
            class="h-8 w-[150px] lg:w-[250px]"
          />
          <slot name="filters" />
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
        <template v-if="table.getRowModel().rows?.length">
          <draggable
            v-model="tableData"
            item-key="id"
            tag="tbody"
            handle=".drag-handle"
            @change="handleDragChange"
          >
            <template #item="{ element }">
              <TableRow>
                <TableCell v-for="column in table.getAllColumns()" :key="column.id">
                  <template v-if="column.id === 'dragHandle'">
                    <div class="drag-handle cursor-move">
                      <Icon name="lucide:grip-vertical" class="h-4 w-4 text-muted-foreground" />
                    </div>
                  </template>
                  <template v-else>
                    <FlexRender
                      :render="column.columnDef.cell"
                      :props="{
                        row: {
                          original: element,
                          getValue: (key: string) => element[key],
                        },
                        column,
                        table,
                        renderValue: () => {
                          const value = element[column.id];
                          if (typeof value === 'function') {
                            return value(element);
                          }
                          return value;
                        },
                      }"
                    />
                  </template>
                </TableCell>
              </TableRow>
            </template>
          </draggable>
        </template>
        <tbody v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              <slot name="empty"> No results found. </slot>
            </TableCell>
          </TableRow>
        </tbody>
      </Table>
    </div>

    <DataTablePagination :table="table" />
  </div>
</template>
