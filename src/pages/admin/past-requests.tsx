import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import AdminOfferDialog from "@/components/admin/AdminOfferDialog";
import DeleteRequestDialog from "@/components/admin/DeleteRequestDialog";
import RequestCard, {
  type RequestWithUser,
} from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import Head from "next/head";
import Link from "next/link";

function PastRequestCards({
  requests,
}: {
  requests: RequestWithUser[] | undefined;
}) {
  return requests ? (
    <div className="grid gap-4 lg:grid-cols-2">
      {requests.map((request) => (
        <RequestCard isAdminDashboard key={request.id} request={request}>
          <DeleteRequestDialog requestId={request.id}>
            <Button className="rounded-full" variant="outline">
              Delete
            </Button>
          </DeleteRequestDialog>
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

export default function Page() {
  const { data: requests } = api.requests.getAll.useQuery();

  return (
    <DashboardLayout type="admin">
      <Head>
        <title>Past Requests | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-row items-center gap-5">
            <h1 className="py-4 text-3xl font-bold text-black">
              Past requests
            </h1>
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-sm font-semibold text-zinc-600 empty:hidden group-data-[state=active]:bg-primary/20 group-data-[state=active]:text-primary">
              {requests?.pastRequests.length}
            </span>
          </div>

          {requests?.pastRequests.length !== 0 ? (
            <PastRequestCards requests={requests?.pastRequests} />
          ) : (
            <div className="flex flex-col items-center gap-4 pt-32">
              <p className="text-center text-muted-foreground">
                Requests with offers will show up here
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
