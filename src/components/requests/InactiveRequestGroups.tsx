import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";
import { RequestCards } from "@/components/requests/RequestCards";

export default function InactiveRequestGroups() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  if (!requests) return <Spinner />;

  return requests.activeRequestGroups.length !== 0 ? (
    <RequestCards requestGroups={requests.inactiveRequestGroups} />
  ) : (
    <div className="flex flex-col items-center gap-4 pt-32">
      <p className="text-center text-muted-foreground">
        Your past requests will show up here
      </p>
    </div>
  );
}
