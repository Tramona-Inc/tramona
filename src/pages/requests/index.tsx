import DashboardLayout from "@/components/_common/DashboardLayout/Guest";
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

function RequestCards({
  requests,
}: {
  requests: DetailedRequest[] | undefined;
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
