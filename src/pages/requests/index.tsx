import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryIcon, Plus, TagIcon } from "lucide-react";
import Head from "next/head";
import NewRequestDialog from "@/components/requests/NewRequestDialog";
import RequestCard, {
  type DetailedRequest,
} from "@/components/requests/RequestCard";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { RequestCardAction } from "@/components/requests/RequestCardAction";
import Spinner from "@/components/_common/Spinner";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";

function NewRequestButton() {
  return (
    <NewRequestDialog>
      <Button className="pl-2">
        <Plus />
        New request
      </Button>
    </NewRequestDialog>
  );
}

function RequestGroup({
  groupId,
  requests,
}: {
  groupId: number;
  requests: DetailedRequest[];
}) {
  if (requests.length === 0) return null;

  if (requests.length === 1) {
    const request = requests[0]!;
    return (
      <RequestCard request={request}>
        <RequestCardAction request={request} />
      </RequestCard>
    );
  }

  return (
    <div className="col-span-full overflow-hidden rounded-xl bg-accent">
      <div className="flex items-center gap-2 px-4 pt-2">
        <p className="text-sm font-semibold uppercase text-zinc-600">
          {requests.length} Requests
        </p>
      </div>
      <div className="flex gap-2 overflow-x-auto p-2">
        {requests.map((request) => (
          <div key={request.id} className="min-w-96 *:h-full">
            <RequestCard request={request}>
              <RequestCardAction request={request} />
            </RequestCard>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestCards({
  requestGroups,
}: {
  requestGroups: { groupId: number; requests: DetailedRequest[] }[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {requestGroups.map(({ groupId, requests }) => (
        <RequestGroup key={groupId} groupId={groupId} requests={requests} />
      ))}
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
          count={requests?.activeRequestGroups.length ?? "blank"}
        >
          <TagIcon /> Current Requests
        </TabsTrigger>
        <TabsTrigger
          value="inactiveRequests"
          count={requests?.inactiveRequestGroups.length ?? "blank"}
        >
          <HistoryIcon /> Past Requests
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activeRequests">
        {requests ? (
          requests.activeRequestGroups.length !== 0 ? (
            <RequestCards requestGroups={requests.activeRequestGroups} />
          ) : (
            <div className="flex flex-col items-center gap-4 pt-32">
              <p className="text-center text-muted-foreground">
                No requests yet, make a request to get started
              </p>
              <NewRequestButton />
            </div>
          )
        ) : (
          <Spinner />
        )}
      </TabsContent>
      <TabsContent value="inactiveRequests">
        {requests ? (
          requests.inactiveRequestGroups.length !== 0 ? (
            <RequestCards requestGroups={requests.inactiveRequestGroups} />
          ) : (
            <div className="flex flex-col items-center gap-4 pt-32">
              <p className="text-center text-muted-foreground">
                Your past requests will show up here
              </p>
            </div>
          )
        ) : (
          <Spinner />
        )}
      </TabsContent>
    </Tabs>
  );
}

export default function Page() {
  useSession({ required: true });
  useMaybeSendUnsentRequests();

  return (
    <>
      <Head>
        <title>My Requests | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center">
            <h1 className="flex-1 py-4 text-3xl font-bold text-black">
              My Requests
            </h1>
            <NewRequestButton />
          </div>
          <RequestsTabs />
        </div>
      </div>
    </>
  );
}
