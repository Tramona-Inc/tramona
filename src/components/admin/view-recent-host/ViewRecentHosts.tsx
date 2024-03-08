import type { AppRouter } from "@/server/api/root";
import { api } from "@/utils/api";
import { type inferRouterOutputs } from "@trpc/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";

export type HostsInfo =
  inferRouterOutputs<AppRouter>["host"]["getHostsInfo"][number];

export default function ViewRecentHosts() {
  const { data } = api.host.getHostsInfo.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>View recent hosts</CardTitle>
        <CardDescription>Shows recently created host</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">
        <DataTable data={data ?? []} columns={columns} />
      </CardContent>
    </Card>
  );
}
