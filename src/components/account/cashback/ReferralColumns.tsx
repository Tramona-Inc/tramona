/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { referralStatuses } from "./data";
import { DataTableColumnHeader } from "./ReferralColumnHeaders";
import { formatCurrency } from "@/utils/utils";
import { formatDate } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import type { RouterOutputs } from "@/utils/api";

type ReferralTransaction =
  RouterOutputs["referralCodes"]["getAllEarningsByReferralCode"][number];

export const referralColumns: ColumnDef<ReferralTransaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {formatDate(row.getValue("createdAt"), "MM/dd/yyyy")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
  },
  {
    accessorKey: "referee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referee Name" />
    ),
    cell: ({ row }) => {
      const referee: { name: string } = row.getValue("referee");

      return <div>{referee.name}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "earningStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = referralStatuses.find(
        (status) => status.value === row.original.earningStatus,
      );

      if (!status) {
        return null;
      }

      return (
        <Badge variant={status.color}>
          <span className="px-2 py-1">{status.label}</span>
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
  },
  {
    accessorKey: "offer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const offer: { travelerOfferedPrice: number } = row.getValue("offer");
      return <div>{formatCurrency(offer.travelerOfferedPrice)}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
  },
  {
    accessorKey: "cashbackEarned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cash Back" />
    ),
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("cashbackEarned"))}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
  },
];
