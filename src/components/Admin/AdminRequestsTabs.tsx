import AdminOfferDialog from "@/components/admin/AdminOfferDialog";
import RequestCard from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { HistoryIcon, Loader2Icon, TagIcon } from "lucide-react";

function AdminRequestCards({
  requests,
}: {
  requests: React.ComponentProps<typeof RequestCard>["request"][] | undefined;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {requests?.map((request) => (
        <RequestCard key={request.id} request={request}>
          <AdminOfferDialog request={request}>
            <Button className="rounded-full">Make an offer</Button>
          </AdminOfferDialog>
        </RequestCard>
      )) ?? (
        <Loader2Icon className="col-span-full mx-auto mt-16 size-12 animate-spin text-accent" />
      )}
    </div>
  );
}

export default function AdminRequestsTabs() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  return (
    <Tabs defaultValue="activeRequests" className="space-y-4">
      <TabsList>
        <TabsTrigger
          value="activeRequests"
          count={requests?.activeRequests.length ?? "blank"}
        >
          <TagIcon /> Incoming Requests
        </TabsTrigger>
        <TabsTrigger
          value="inactiveRequests"
          count={requests?.inactiveRequests.length ?? "blank"}
        >
          <HistoryIcon /> Past Requests
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activeRequests">
        {requests?.activeRequests.length !== 0 ? (
          <AdminRequestCards requests={requests?.activeRequests} />
        ) : (
          <div className="flex flex-col items-center gap-4 pt-32">
            <p className="text-center text-muted-foreground">
              No incoming requests right now
            </p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="inactiveRequests">
        {requests?.inactiveRequests.length !== 0 ? (
          <AdminRequestCards requests={requests?.inactiveRequests} />
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
