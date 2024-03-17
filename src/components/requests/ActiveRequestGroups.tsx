import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";
import { NewRequestButton } from "../../pages/requests";
import { RequestCards } from "@/components/requests/RequestCards";

export default function ActiveRequestGroups() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  if (!requests) return <Spinner />;

  return requests.activeRequestGroups.length !== 0 ? (
    <RequestCards requestGroups={requests.activeRequestGroups} />
  ) : (
    <div className="flex flex-col items-center gap-4 pt-32">
      <p className="text-center text-muted-foreground">
        No requests yet, make a request to get started!
      </p>
      <NewRequestButton />
    </div>
  );
}
