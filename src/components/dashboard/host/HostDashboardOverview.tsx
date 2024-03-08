import { api } from "@/utils/api";

export default function DashboardOverview() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  return (
    <div className="col-span-10 2xl:col-span-11">
      <h1>Host Dashboard Page</h1>
    </div>
  );
}
