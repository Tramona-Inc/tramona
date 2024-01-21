import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryIcon, Loader2Icon, Plus, TagIcon } from "lucide-react";
import Head from "next/head";
import NewRequestDialog from "@/components/requests/NewRequestDialog";
import RequestCard from "@/components/requests/RequestCard";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { RequestCardAction } from "@/components/requests/RequestCardAction";

function NewRequestButton() {
  return (
    <NewRequestDialog>
      <Button className="flex gap-2 pl-2">
        <Plus /> New request
      </Button>
    </NewRequestDialog>
  );
}

function RequestCards({
  requests,
}: {
  requests: React.ComponentProps<typeof RequestCard>["request"][] | undefined;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {requests?.map((request) => (
        <RequestCard key={request.id} request={request}>
          <RequestCardAction request={request} />
        </RequestCard>
      )) ?? (
        <Loader2Icon className="col-span-full mx-auto mt-16 size-12 animate-spin text-accent" />
      )}
    </div>
  );
}

function RequestsTabs() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  return (
    <Tabs defaultValue="activeRequests" className="space-y-4">
      <TabsList>
        <TabsTrigger
          value="activeRequests"
          count={requests?.activeRequests.length ?? "blank"}
        >
          <TagIcon /> Current Requests
        </TabsTrigger>
        <TabsTrigger
          value="inactiveRequests"
          count={requests?.inactiveRequests.length ?? "blank"}
        >
          <HistoryIcon /> Past Requests
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activeRequests">
        <RequestCards requests={requests?.activeRequests} />
      </TabsContent>
      <TabsContent value="inactiveRequests">
        <RequestCards requests={requests?.inactiveRequests} />
      </TabsContent>
    </Tabs>
  );
}

export default function Page() {
  useSession({ required: true });

  return (
    <>
      <Head>
        <title>Your Requests | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center">
            <h1 className="flex-1 py-4 text-3xl font-bold text-black">
              Your Requests
            </h1>
            <NewRequestButton />
          </div>
          <RequestsTabs />
        </div>
      </div>
    </>
  );
}
