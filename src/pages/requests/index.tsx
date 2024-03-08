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
import { useEffect, useState } from "react";
import { useInterval } from "@/utils/useInterval";
import { usePrevious } from "@uidotdev/usehooks";
import DashboardLayout from "@/components/_common/DashboardLayout";

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

function RequestCards({
  requests,
}: {
  requests: DetailedRequest[] | undefined;
}) {
  const [isWaiting, setIsWaiting] = useState(false);
  const utils = api.useUtils();

  const previousRequests = usePrevious(requests);

  useEffect(() => {
    if (!requests || !previousRequests) return;
    const newlyApprovedRequests = requests.filter(
      (req) =>
        req.hasApproved &&
        !previousRequests.find((req2) => req2.id === req.id)?.hasApproved,
    );
    if (newlyApprovedRequests.length > 0) {
      setIsWaiting(false);
    }
  }, [requests]);

  // Start the interval to invalidate requests every 10 seconds
  useInterval(
    () => void utils.requests.getMyRequests.invalidate(),
    isWaiting ? 10 * 1000 : null,
  ); // 10 seconds

  const handleResendConfirmation = () => {
    // Start the timer for 3 minutes
    setIsWaiting(true);
    setTimeout(
      () => {
        setIsWaiting(false);
      },
      3 * 60 * 1000,
    ); // 3 minutes
  };

  return requests ? (
    <div className="grid gap-4 lg:grid-cols-2">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request}>
          <RequestCardAction
            key={request.id}
            request={request}
            onClick={handleResendConfirmation}
            isWaiting={isWaiting}
          />
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
  useMaybeSendUnsentRequests();

  return (
    <>
      <Head>
        <title>My Requests | Tramona</title>
      </Head>

      <DashboardLayout>
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
