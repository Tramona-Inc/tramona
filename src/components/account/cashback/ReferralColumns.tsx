/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { referralStatuses } from "./data";
import type { Referral } from "./referrals";
import { DataTableColumnHeader } from "./ReferralColumnHeaders";
import { formatCurrency } from "@/utils/utils";
import { formatDate } from "date-fns";

export const referralColumns: ColumnDef<Referral>[] = [
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
    accessorKey: "refereeId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referee Name" />
    ),
    cell: ({ row }) => {
      const referee: { name: string } = row.getValue("refereeId");

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
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => <div>${row.getValue("amount")}</div>,
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
