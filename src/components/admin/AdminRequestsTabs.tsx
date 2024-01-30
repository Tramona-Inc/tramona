import AdminOfferDialog from "@/components/admin/AdminOfferDialog";
import RequestCard from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type DetailedRequest } from "@/server/api/routers/requestsRouter";
import { api } from "@/utils/api";
import { HistoryIcon, InboxIcon } from "lucide-react";
import Spinner from "../_common/Spinner";

function IncomingRequestCards({
  requests,
}: {
  requests: DetailedRequest[] | undefined;
}) {
  return requests ? (
    <div className="grid gap-4 lg:grid-cols-2">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request}>
          <AdminOfferDialog request={request}>
            <Button className="rounded-full">Make an offer</Button>
          </AdminOfferDialog>
        </RequestCard>
      ))}
    </div>
  ) : (
    <Spinner />
  );
}

function PastRequestCards({
  requests,
}: {
  requests: DetailedRequest[] | undefined;
}) {
  return requests ? (
    <div className="grid gap-4 lg:grid-cols-2">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request}>
          <AdminOfferDialog request={request}>
            <Button className="rounded-full">Make another offer</Button>
          </AdminOfferDialog>
        </RequestCard>
      ))}
    </div>
  ) : (
    <Spinner />
  );
}

export default function AdminRequestsTabs() {
  const { data: requests } = api.requests.getAll.useQuery();

  return (
    <Tabs defaultValue="incomingRequests" className="space-y-4">
      <TabsList>
        <TabsTrigger
          value="incomingRequests"
          count={requests?.incomingRequests.length ?? "blank"}
        >
          <InboxIcon /> Incoming Requests
        </TabsTrigger>
        <TabsTrigger
          value="pastRequests"
          count={requests?.pastRequests.length ?? "blank"}
        >
          <HistoryIcon /> Past Requests
        </TabsTrigger>
      </TabsList>
      <TabsContent value="incomingRequests">
        {requests?.incomingRequests.length !== 0 ? (
          <IncomingRequestCards requests={requests?.incomingRequests} />
        ) : (
          <div className="flex flex-col items-center gap-4 pt-32">
            <p className="text-center text-muted-foreground">
              No incoming requests right now
            </p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="pastRequests">
        {requests?.pastRequests.length !== 0 ? (
          <PastRequestCards requests={requests?.pastRequests} />
        ) : (
          <div className="flex flex-col items-center gap-4 pt-32">
            <p className="text-center text-muted-foreground">
              Requests with offers will show up here
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
