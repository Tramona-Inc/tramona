import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryIcon, Loader2Icon, TagIcon } from "lucide-react";
import Head from "next/head";
import RequestCard from "@/components/requests/RequestCard";
import { api } from "@/utils/api";
import { useRequireRole } from "@/utils/auth-utils";
import AdminOfferDialog from "@/components/admin/AdminOfferDialog";

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

function AdminRequestsTabs() {
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

export default function Page() {
  useRequireRole(["admin"]);

  return (
    <>
      <Head>
        <title>Your Requests | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center">
            <h1 className="flex-1 py-4 text-3xl font-bold text-black">
              Incoming requests
            </h1>
          </div>
          <AdminRequestsTabs />
        </div>
      </div>
    </>
  );
}
