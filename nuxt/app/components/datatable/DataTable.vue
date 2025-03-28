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
  const tableData = ref(props.data);

  // Watch for changes in props.data
  watch(
    () => props.data,
    (newData) => {
      tableData.value = newData;
    },
    { deep: true }
  );

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

  const draggedRow = ref<any>(null);

  const handleDragStart = (row: any) => {
    draggedRow.value = row;
  };

  const handleDragEnd = () => {
    draggedRow.value = null;
  };

  const handleDrop = async (targetRow: any) => {
    if (!draggedRow.value || !props.onReorder) return;

    try {
      const newData = [...tableData.value];
      const draggedIndex = newData.findIndex((item) => item.id === draggedRow.value.original.id);
      const targetIndex = newData.findIndex((item) => item.id === targetRow.original.id);

      // Remove dragged item and insert at new position
      const [draggedItem] = newData.splice(draggedIndex, 1);
      newData.splice(targetIndex, 0, draggedItem);

      // Update local data
      tableData.value = newData;

      // Notify parent of reorder
      const newOrder = newData.map((item) => item.id);
      await props.onReorder(newOrder);
    } catch (error) {
      console.error("Failed to reorder:", error);
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

        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <template v-if="cell.column.id === 'dragHandle'">
                    <div
                      class="drag-handle cursor-move"
                      draggable="true"
                      @dragstart="handleDragStart(row)"
                      @dragend="handleDragEnd"
                      @dragover.prevent
                      @drop="handleDrop(row)"
                    >
                      <Icon name="lucide:grip-vertical" class="h-4 w-4 text-muted-foreground" />
                    </div>
                  </template>
                  <template v-else>
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </template>
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
</template>
