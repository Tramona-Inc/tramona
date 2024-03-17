import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import NewRequestDialog from "@/components/requests/NewRequestDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { HistoryIcon, Plus, TagIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ActiveRequestGroups from "../../components/requests/ActiveRequestGroups";
import InactiveRequestGroups from "../../components/requests/InactiveRequestGroups";

export function NewRequestButton() {
  return (
    <NewRequestDialog>
      <Button className="pl-2">
        <Plus />
        New request
      </Button>
    </NewRequestDialog>
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
        <ActiveRequestGroups />
      </TabsContent>
      <TabsContent value="inactiveRequestGroups">
        <InactiveRequestGroups />
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
