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
  import DataTable from "~/components/datatable/DataTable.vue";
  import DataTableFacetedFilter from "~/components/datatable/DataTableFacetedFilter.vue";
  import { toast } from "~/components/ui/toast";
  import { usePortfolioManagement } from "~/composables/usePortfolioManagement";
  import { ArrowUpDown, Building2, MoreHorizontal } from "lucide-vue-next";
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
  const portfolioToDelete = ref<string | null>(null);
  const tablePortfolios = ref<PortfolioDetails[]>([]);
  const dataTable = ref();

  const { fetchAllPortfolios, deletePortfolio } = usePortfolioManagement();
  const { allPortfolios } = await fetchAllPortfolios();
  tablePortfolios.value = allPortfolios;

  function valueUpdater<T>(updaterOrValue: T | ((old: T) => T), ref: Ref<T>) {
    if (typeof updaterOrValue === "function") {
      ref.value = (updaterOrValue as (old: T) => T)(ref.value);
    } else {
      ref.value = updaterOrValue;
    }
  }

  const sorting = ref<SortingState>([]);
  const columnFilters = ref<ColumnFiltersState>([]);
  const columnVisibility = ref<VisibilityState>({});
  const rowSelection = ref({});
  const expanded = ref<ExpandedState>({});

  interface FilterOption {
    label: string;
    value: string;
    icon?: Component;
  }

  const projectOptions = computed<FilterOption[]>(() => {
    if (!tablePortfolios.value) return [];

    // Get all unique project names from portfolioProjects
    const projectNames = new Set(
      tablePortfolios.value
        .flatMap((portfolio) => portfolio.portfolioProjects)
        .map((portfolioProject) => portfolioProject.project.name)
    );

    return Array.from(projectNames).map((projectName) => ({
      label: projectName,
      value: projectName,
      icon: Building2,
    }));
  });

  const columns: ColumnDef<PortfolioDetails>[] = [
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
      accessorKey: "portfolioProjects",
      header: ({ column }) => {
        return h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => ["Projects", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
        );
      },
      cell: ({ row }) => {
        const projects = row.getValue("portfolioProjects") as any[];
        return h(
          "div",
          { class: "flex flex-wrap gap-1" },
          projects.map((portfolioProject) =>
            h(Badge, { variant: "secondary" }, () => portfolioProject.project.name)
          )
        );
      },
      filterFn: (row, id, value) => {
        const projects = row.getValue(id) as any[];
        if (!projects) return false;
        const projectNames = projects.map((portfolioProject) => portfolioProject.project.name);
        return value.some((val: string) => projectNames.includes(val));
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
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const portfolio = row.original;
        return h(DropdownMenu, null, () => [
          h(DropdownMenuTrigger, null, () =>
            h(Button, { variant: "ghost", class: "h-8 w-8 p-0" }, () =>
              h(MoreHorizontal, { class: "h-4 w-4" })
            )
          ),
          h(DropdownMenuContent, { align: "end" }, () => [
            h(
              DropdownMenuItem,
              {
                onClick: () => router.push(`/portfolios/${portfolio.slug}`),
              },
              () => "Edit"
            ),
            h(
              DropdownMenuItem,
              {
                onClick: () => openDeleteDialog(portfolio.slug),
                class: "text-destructive focus:text-destructive",
              },
              () => "Delete"
            ),
          ]),
        ]);
      },
    },
  ];

  const table = useVueTable<PortfolioDetails>({
    data: tablePortfolios,
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
        pageSize: 10,
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

  const handleDeletePortfolio = async (portfolioSlug: string) => {
    try {
      await deletePortfolio(portfolioSlug);
      // Refresh the portfolios list
      const { allPortfolios: updatedPortfolios } = await fetchAllPortfolios();
      tablePortfolios.value = updatedPortfolios;

      // Close dialog
      isDeleteDialogOpen.value = false;
      portfolioToDelete.value = null;

      // Show success toast
      toast({
        title: "Portfolio deleted",
        description: "Portfolio deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete portfolio:", error);

      // Show error notification
      toast({
        title: "Portfolio deletion failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (portfolioSlug: string) => {
    portfolioToDelete.value = portfolioSlug;
    isDeleteDialogOpen.value = true;
  };
</script>

<template>
  <div class="w-full">
    <ClientOnly>
      <DataTable
        ref="dataTable"
        :data="tablePortfolios"
        :columns="columns"
        :table="table"
        search-key="name"
        :page-size="10"
      >
        <template #filters>
          <DataTableFacetedFilter
            v-if="dataTable?.table.getColumn('portfolioProjects')"
            :column="dataTable.table.getColumn('portfolioProjects')"
            title="Projects"
            :options="projectOptions"
          />
        </template>
        <template #empty>
          No portfolios found. Create your first portfolio to get started.
        </template>
      </DataTable>
    </ClientOnly>

    <!-- Delete Confirmation Dialog -->
    <DeleteConfirmDialog
      v-model:open="isDeleteDialogOpen"
      title="Delete Portfolio"
      description="Are you sure you want to delete this portfolio? This action cannot be undone and will remove all associated data."
      @confirm="portfolioToDelete && handleDeletePortfolio(portfolioToDelete)"
    />
  </div>
</template>
