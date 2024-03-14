import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import AdminOfferDialog from "@/components/admin/AdminOfferDialog";
import DeleteRequestDialog from "@/components/admin/DeleteRequestDialog";
import RejectRequestDialog from "@/components/admin/RejectRequestDialog";
import RequestCard, {
  type RequestWithUser,
} from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

function IncomingRequestCards({
  requests,
}: {
  requests: RequestWithUser[] | undefined;
}) {
  return requests ? (
    <div className="grid gap-4 lg:grid-cols-2">
      {requests.map((request) => (
        <RequestCard withUser key={request.id} request={request}>
          <DeleteRequestDialog requestId={request.id}>
            <Button className="rounded-full" variant="outline">
              Delete
            </Button>
          </DeleteRequestDialog>
          <RejectRequestDialog request={request}>
            <Button className="rounded-full" variant="outline">
              Reject
            </Button>
          </RejectRequestDialog>
          <AdminOfferDialog request={request}>
            <Button className="rounded-full">Make an offer</Button>
          </AdminOfferDialog>
        </RequestCard>
      ))}
    </div>
  ) : (
    <Spinner />
  );
}

export default function IncomingRequests() {
  const { data: requests } = api.requests.getAll.useQuery();

  return (
    <DashboardLayout type="admin">
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-row items-center gap-5">
            <h1 className="py-4 text-3xl font-bold text-black">
              Incoming requests
            </h1>
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-sm font-semibold text-zinc-600 group-data-[state=active]:bg-primary/20 group-data-[state=active]:text-primary">
              {requests?.incomingRequests.length}
            </span>
          </div>

          {requests?.incomingRequests.length !== 0 ? (
            <IncomingRequestCards requests={requests?.incomingRequests} />
          ) : (
            <div className="flex flex-col items-center gap-4 pt-32">
              <p className="text-center text-muted-foreground">
                No incoming requests right now
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
