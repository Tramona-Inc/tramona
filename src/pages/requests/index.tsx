import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryIcon, Plus, TagIcon } from "lucide-react";
import Head from "next/head";
import NewRequestDialog from "@/components/requests/NewRequestDialog";
import RequestCard from "@/components/requests/RequestCard";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { RequestCardAction } from "@/components/requests/RequestCardAction";
import Spinner from "@/components/_common/Spinner";

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
  return requests ? (
    <div className="grid gap-4 lg:grid-cols-2">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request}>
          <RequestCardAction request={request} />
        </RequestCard>
      ))}
    </div>
  ) : (
    <Spinner />
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
        {requests?.activeRequests.length !== 0 ? (
          <RequestCards requests={requests?.activeRequests} />
        ) : (
          <div className="flex flex-col items-center gap-4 pt-32">
            <p className="text-center text-muted-foreground">
              No requests yet, make a request to get started
            </p>
            <NewRequestButton />
          </div>
        )}
      </TabsContent>
      <TabsContent value="inactiveRequests">
        {requests?.inactiveRequests.length !== 0 ? (
          <RequestCards requests={requests?.inactiveRequests} />
        ) : (
          <div className="flex flex-col items-center gap-4 pt-32">
            <p className="text-center text-muted-foreground">
              Your past requests will show up here
            </p>
          </div>
        )}
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
