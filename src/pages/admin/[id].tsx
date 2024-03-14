import Spinner from "@/components/_common/Spinner";
import AdminOfferDialog from "@/components/admin/AdminOfferDialog";
import RevokeOfferDialog from "@/components/admin/RevokeOfferDialog";
import RequestCard from "@/components/requests/RequestCard";
import OfferCard from "@/components/requests/[id]/OfferCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const requestId = parseInt(router.query.id as string);

  const { data: offers } = api.offers.getByRequestIdWithProperty.useQuery(
    { id: requestId },
    {
      enabled: router.isReady,
    },
  );

  const { data: requests } = api.requests.getAll.useQuery();

  const request = requests?.pastRequests.find(({ id }) => id === requestId);

  const offerCount = offers?.length;

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 bg-primary">
          <div className="relative top-1/2 h-1/2 bg-background sm:rounded-t-3xl"></div>
        </div>
        <div className="px-4 py-16">
          <div className="mx-auto max-w-xl">
            {request ? (
              <RequestCard isAdminDashboard request={request} />
            ) : (
              <Card className="h-56" />
            )}
          </div>
        </div>
        <Link
          href="/admin/past-requests"
          className="absolute left-4 top-4 rounded-full px-4 py-2 font-medium text-white hover:bg-white/10"
        >
          &larr; Back
        </Link>
      </div>
      <div className="px-4 pb-64">
        <div className="mx-auto max-w-5xl">
          <h1 className="flex flex-1 items-center gap-2 py-4 text-3xl font-bold text-black">
            Current offers
          </h1>
          {request && offers ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  requestId={requestId}
                  checkIn={request.checkIn} checkOut={request.checkOut}
                >
                  <RevokeOfferDialog
                    requestId={request.id}
                    requestCheckIn={request.checkIn}
                    requestCheckOut={request.checkOut}
                    offerId={offer.id}
                    propertyAddress={offer.property.address!}
                    userPhoneNumber={request.madeByUser.phoneNumber!}
                    propertyName={offer.property.name}
                    offerCount={offerCount!}
                  >
                    <Button variant="outline" className="rounded-full">
                      Revoke offer
                    </Button>
                  </RevokeOfferDialog>
                  <AdminOfferDialog request={request} offer={offer}>
                    <Button className="rounded-full">Edit offer</Button>
                  </AdminOfferDialog>
                </OfferCard>
              ))}
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </>
  );
}
