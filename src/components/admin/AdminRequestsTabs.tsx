import AdminOfferDialog from "@/components/admin/AdminOfferDialog";
import RequestCard from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { HistoryIcon, InboxIcon } from "lucide-react";
import Spinner from "../_common/Spinner";
import { type RequestWithUser } from "../requests/RequestCard";
import RejectRequestDialog from "./RejectRequestDialog";
import Link from "next/link";

function IncomingRequestCards({
  requests,
}: {
  requests: RequestWithUser[] | undefined;
}) {
  return requests ? (
    <div className="grid gap-4 lg:grid-cols-2">
      {requests.map((request) => (
        <RequestCard withUser key={request.id} request={request}>
          <RejectRequestDialog requestId={request.id}>
            <Button className="rounded-full" variant="outline">
              Reject
            </Button>
          </RejectRequestDialog>
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
  requests: RequestWithUser[] | undefined;
}) {
  return requests ? (
    <div className="grid gap-4 lg:grid-cols-2">
      {requests.map((request) => (
        <RequestCard withUser key={request.id} request={request}>
          <Button className="rounded-full" variant="outline" asChild>
            <Link href={`/admin/${request.id}`}>Edit offers</Link>
          </Button>
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
