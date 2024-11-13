import { type RouterOutputs, api } from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";

export type HostsInfo = RouterOutputs["hosts"]["getHostInfo"][number];

export default function ViewRecentHosts() {
  const { data } = api.hosts.getHostInfo.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>View recent hosts</CardTitle>
        <CardDescription>Shows recently created hosts</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">
        <DataTable data={data ?? []} columns={columns} />
      </CardContent>
    </Card>
  );
}
