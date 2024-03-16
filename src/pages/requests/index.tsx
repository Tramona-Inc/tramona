import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import NewRequestDialog from "@/components/requests/NewRequestDialog";
import RequestCard, {
  type DetailedRequest,
} from "@/components/requests/RequestCard";
import { RequestCardAction } from "@/components/requests/RequestCardAction";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { useEffect, useMemo, useState } from "react";
import { useInterval } from "@/utils/useInterval";
import { usePrevious } from "@uidotdev/usehooks";
import { HistoryIcon, Plus, TagIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";

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
  groupId: _, // well use it soon
  requests,
  isWaiting,
  startTimer,
}: {
  groupId: number;
  requests: DetailedRequest[];
  isWaiting: boolean;
  startTimer: () => void;
}) {
  if (requests.length === 0) return null;

  if (requests.length === 1) {
    const request = requests[0]!;
    return (
      <RequestCard request={request}>
        <RequestCardAction
          request={request}
          isWaiting={isWaiting}
          onClick={startTimer}
        />
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
              <RequestCardAction
                request={request}
                isWaiting={isWaiting}
                onClick={startTimer}
              />
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
  const [isWaiting, setIsWaiting] = useState(false);
  const utils = api.useUtils();

  const requests = useMemo(
    () => requestGroups.map((group) => group.requests).flat(),
    [requestGroups],
  );

  const previousRequests = usePrevious(requests);
  const newlyApprovedRequests =
    requests && previousRequests
      ? requests.filter(
          (req) =>
            req.hasApproved &&
            !previousRequests.find((req2) => req2.id === req.id)?.hasApproved,
        )
      : [];

  useEffect(() => {
    if (newlyApprovedRequests.length > 0) {
      setIsWaiting(false);
    }
  }, [newlyApprovedRequests.length]);

  // Start the interval to invalidate requests every 10 seconds
  useInterval(
    () => void utils.requests.getMyRequests.invalidate(),
    isWaiting ? 10 * 1000 : null,
  ); // 10 seconds

  function startTimer() {
    setIsWaiting(true);
    setTimeout(() => setIsWaiting(false), 3 * 60 * 1000); // 3 minutes
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {requestGroups.map(({ groupId, requests }) => (
        <RequestGroup
          key={groupId}
          groupId={groupId}
          requests={requests}
          isWaiting={isWaiting}
          startTimer={startTimer}
        />
      ))}
    </div>
  );
}

function RequestsTabs() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  return (
    <Tabs defaultValue="activeRequestGroups" className="space-y-4">
      <TabsList>
        <TabsTrigger
          value="activeRequestGroups"
          count={requests?.activeRequestGroups.length ?? "blank"}
        >
          <TagIcon /> Current Requests
        </TabsTrigger>
        <TabsTrigger
          value="inactiveRequestGroups"
          count={requests?.inactiveRequestGroups.length ?? "blank"}
        >
          <HistoryIcon /> Past Requests
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activeRequestGroups">
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
      <TabsContent value="inactiveRequestGroups">
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

      <DashboardLayout type="guest">
        <div className="container col-span-10 px-4 pb-64 pt-5 2xl:col-span-11">
          <div className="mx-auto">
            <div className="flex items-center">
              <h1 className="flex-1 py-4 text-4xl font-bold text-black">
                My Requests
              </h1>
              <NewRequestButton />
            </div>
            <RequestsTabs />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
