<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-vue-next";
  import { computed } from "vue";
  import type { Table } from "@tanstack/vue-table";

  interface DataTablePaginationProps {
    table: Table<ProjectWithTags>;
  }
  const props = defineProps<DataTablePaginationProps>();

  const pageSize = computed({
    get: () => `${props.table.getState().pagination.pageSize}`,
    set: (value) => {
      if (value) {
        props.table.setPageSize(Number(value));
      }
    },
  });
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ props.table.getFilteredSelectedRowModel().rows.length }} of
      {{ props.table.getFilteredRowModel().rows.length }} row(s) selected.
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <Select v-model="pageSize">
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="pageSize" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="size in [2, 5, 10, 20, 30, 40, 50]" :key="size" :value="`${size}`">
              {{ size }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {{ props.table.getState().pagination.pageIndex + 1 }} of
        {{ props.table.getPageCount() }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="!props.table.getCanPreviousPage()"
          @click="props.table.setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <ChevronsLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="!props.table.getCanPreviousPage()"
          @click="props.table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="!props.table.getCanNextPage()"
          @click="props.table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRight class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="!props.table.getCanNextPage()"
          @click="props.table.setPageIndex(props.table.getPageCount() - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <ChevronsRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
