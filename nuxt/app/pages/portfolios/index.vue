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
  const tablePortfolios = ref<PortfolioWithProjects[]>([]);
  const dataTable = ref();

  const { fetchAllPortfolios, deletePortfolio } = usePortfolioManagement();
  const { portfolios } = await fetchAllPortfolios();
  tablePortfolios.value = portfolios;

  const columns: ColumnDef<PortfolioWithProjects>[] = [
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
      id: "actions",
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
                onClick: () => router.push(`/portfolios/${portfolio.id}`),
              },
              () => "Edit"
            ),
            h(
              DropdownMenuItem,
              {
                onClick: () => openDeleteDialog(portfolio.id),
                class: "text-destructive focus:text-destructive",
              },
              () => "Delete"
            ),
          ]),
        ]);
      },
    },
  ];

  const handleDeletePortfolio = async (portfolioId: string) => {
    try {
      await deletePortfolio(portfolioId);
      // Refresh the portfolios list
      const { portfolios: updatedPortfolios } = await fetchAllPortfolios();
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

  const openDeleteDialog = (portfolioId: string) => {
    portfolioToDelete.value = portfolioId;
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
        search-key="name"
        :page-size="10"
      >
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
