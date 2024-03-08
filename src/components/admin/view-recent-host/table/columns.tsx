import { type ColumnDef } from "@tanstack/react-table";

// import { labels, priorities, statuses } from "../data/data"
import { Checkbox } from "@/components/ui/checkbox";
import { type HostsInfo } from "../ViewRecentHosts";
import { DataTableColumnHeader } from "./data-table-column-header";
// import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<HostsInfo>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "userId",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="User id" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("userId")}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] capitalize">{row.getValue("type")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone number" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] max-md:break-all">
        {row.getValue("phoneNumber")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] max-md:break-all">{row.getValue("email")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "profileUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profile Url" />
    ),
    cell: ({ row }) => (
      <div className="w-[125px] truncate">{row.getValue("profileUrl")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
