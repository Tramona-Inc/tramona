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
import { formatCurrency, formatDateMonthDayYear } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import { referralStatuses } from "./data";
import Link from "next/link";
interface ReferralRowData {
  id: number;
  createdAt: Date;
  referralCode: string;
  refereeId: string;
  offerId: number;
  earningStatus: "pending" | "paid" | "cancelled" | null;
  cashbackEarned: number;
  hostFeesSaved: number | null;
  referee: {
    name: string | null;
    firstName: string | null;
  };
  offer: {
    travelerOfferedPriceBeforeFees: number;
  };
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ReferralTable<TData extends ReferralRowData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // const [rowSelection, setRowSelection] = React.useState({});
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
      // rowSelection,
      columnFilters,
    },
    enableRowSelection: false,
    // onRowSelectionChange: setRowSelection,
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

  function badgeColor(status: string) {
    const referralStatus = referralStatuses.find(
      (badge) => badge.value === status,
    );

    if (!referralStatus) {
      return null;
    }

    return <Badge variant={referralStatus.color}>{referralStatus.label}</Badge>;
  }

  // function handleRequestCashback() {
  //   const allRows = table
  //     .getRowModel()
  //     .rows.map((row) => row.original) as ReferralTransaction[];

  //   mutate({ transactions: allRows });
  // }

  return (
    <>
      <div className="grid grid-cols-1 space-y-2">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold lg:text-2xl">
              Cash Back on Referral
            </h1>
            <Link
              href="/account/all-referrals"
              className="text-primary underline lg:hidden"
            >
              See all
            </Link>
          </div>
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
                {table.getRowModel().rows.length ? (
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
        <div className="mx-4 divide-y lg:hidden">
          {data.length ? (
            data.slice(0, 3).map((row: TData) => (
              <div key={row.id} className="grid grid-cols-2 py-2">
                <div>
                  <div>{badgeColor(row.earningStatus!)}</div>
                  <h3 className="text-muted-foreground">
                    {formatDateMonthDayYear(row.createdAt)}
                  </h3>
                  <p className="font-semibold">
                    {row.referee.name ?? row.referee.firstName}
                  </p>
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
      </div>
    </>
  );
}
