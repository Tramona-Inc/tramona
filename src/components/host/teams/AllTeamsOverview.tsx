import React from "react";
import { api, RouterOutputs } from "@/utils/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
} from "@tanstack/react-table";
import UserAvatar from "@/components/_common/UserAvatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { toast } from "@/components/ui/use-toast";

type HostTeam = RouterOutputs["hostTeams"]["getMyHostTeams"][number];

function AllTeamsOverview() {
  const { currentHostTeamId, setCurrentHostTeam } = useHostTeamStore();
  const { data: hostTeams = [] } = api.hostTeams.getMyHostTeams.useQuery();

  const columns: ColumnDef<HostTeam>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Team Name",
        cell: ({ row }) => (
          <span className="text-lg font-semibold">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const myRole = row.original.members.find(
            (member) => member.userId,
            row.original.curUserId,
          )?.role;
          return <span>{myRole}</span>;
        }, // Changed from row.original.name to row.original.role
      },
      {
        accessorKey: "teamMembers",
        header: "Team Members",
        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                {" "}
                <Button
                  variant="wrapper"
                  className="-space-x-2"
                  tooltip="See all team members"
                  tooltipOptions={{ side: "left" }}
                >
                  {row.original.members.map((member) => (
                    <UserAvatar
                      key={member.user.id}
                      size="sm"
                      name={member.user.name}
                      email={member.user.email}
                      image={member.user.image}
                    />
                  ))}
                </Button>
              </TooltipTrigger>
              <TooltipContent>See all members</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex flex-row justify-end space-x-2">
            <Button
              className="w-24 text-sm"
              variant="primary"
              disabled={row.original.id === currentHostTeamId}
              onClick={() => {
                setCurrentHostTeam(row.original.id);
                toast({
                  title: "Team Switch Successful",
                });
              }}
            >
              {row.original.id === currentHostTeamId ? "Selected" : "Select"}
            </Button>
          </div>
        ),
      },
    ],
    [currentHostTeamId, setCurrentHostTeam],
  );

  const table = useReactTable({
    data: hostTeams,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.id === "actions" ? "text-right" : ""}
                  >
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === "actions" ? "text-right" : ""
                      }
                    >
                      {typeof cell.column.columnDef.cell === "function"
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.column.columnDef.cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No teams found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AllTeamsOverview;
