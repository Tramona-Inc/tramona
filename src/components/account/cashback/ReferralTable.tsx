import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Referral } from "./referrals";
import { toast } from "@/components/ui/use-toast";

import { api } from "@/utils/api";
import { formatCurrency, formatDateMonthDayYear } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import { referralStatuses } from "./data";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ReferralTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const { mutate, isLoading } =
    api.referralCodes.sendCashbackRequest.useMutation({
      onSuccess: () => {
        toast({
          title: "Cashback requested!",
          description:
            "We've received your request to redeem your cashback. We will get back to you in 1-2 days!",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
          description: "Oops! Something went wrong, please try again",
        });
      },
    });

  const { data: fetchedRefEarnings } =
    api.referralCodes.getReferralEarnings.useQuery();

  function badgeColor(status: string) {
    const referralStatus = referralStatuses.find(
      (badge) => badge.value === status,
    );

    if (!referralStatus) {
      return null;
    }

    return <Badge variant={referralStatus.color}>{referralStatus.label}</Badge>;
  }

  return (
    <>
      <div className="grid grid-cols-1">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold lg:text-2xl">
              Cash Back on Referral
            </h1>
            <Button variant="link" className="text-primary lg:hidden">
              See all
            </Button>
          </div>

          <Button
            className="hidden lg:block"
            disabled={table.getSelectedRowModel().rows.length === 0}
            isLoading={isLoading}
            onClick={async () => {
              const selectedRows = table
                .getSelectedRowModel()
                .rows.map((row) => row.original) as Referral[];

              mutate({ transactions: selectedRows });
            }}
          >
            Request cashback
          </Button>
        </div>
        <div className="hidden space-y-4 lg:col-span-full lg:block">
          <div className="border">
            <Table>
              <TableHeader className="bg-zinc-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* mobile version of the table */}
        <div className="divide-y lg:hidden">
          {fetchedRefEarnings?.length ? (
            fetchedRefEarnings.map((row) => (
              <div key={row.id} className="grid grid-cols-2 py-2">
                <div>
                  <div>{badgeColor(row.earningStatus)}</div>
                  <h3 className="text-muted-foreground">
                    {formatDateMonthDayYear(row.createdAt)}
                  </h3>
                  <p className="font-semibold">{row.referee.name}</p>
                </div>
                <div className="text-end text-xl font-bold">
                  {formatCurrency(row.cashbackEarned)}
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-24 items-center justify-center">
              <p>No referrals yet.</p>
            </div>
          )}
        </div>

        <div className="lg:hidden">
          <Button
            className="w-full lg:w-auto"
            disabled={table.getSelectedRowModel().rows.length === 0}
            isLoading={isLoading}
            onClick={async () => {
              const selectedRows = table
                .getSelectedRowModel()
                .rows.map((row) => row.original) as Referral[];

              mutate({ transactions: selectedRows });
            }}
          >
            Request cashback
          </Button>
        </div>
      </div>
    </>
  );
}
