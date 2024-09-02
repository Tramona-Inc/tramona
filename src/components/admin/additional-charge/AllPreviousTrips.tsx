import { api } from "@/utils/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Spinner from "../../_common/Spinner";
import { formatDateRange } from "@/utils/utils";
import { Separator } from "@/components/ui/separator";

export default function AllPreviousTrips() {
  const { data: allPreviousTrips } =
    api.trips.getAllPreviousTripsWithDetails.useQuery();

  return (
    <Card>
      <CardHeader> All Previous Trips</CardHeader>
      <CardContent>
        {allPreviousTrips ? (
          allPreviousTrips.map((trip) => {
            return (
              <div key={trip.id + Math.random()}>
                <div className="flex flex-row gap-x-4">
                  <div className="flex flex-col gap-y-1">
                    <h1 className="text-lg font-semibold">Trip</h1>
                    <div> Trip ID: {trip.id} </div>
                    <div> Property ID: {trip.property.id} </div>
                    <div>
                      <p>
                        Trip Date:{" "}
                        {formatDateRange(trip.checkIn, trip.checkOut)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1 border-x-2 px-3">
                    <h1 className="text-lg font-semibold">User</h1>
                    <div> User ID: {trip.group.owner.id} </div>
                    <div>Username: {trip.group.owner.name}</div>
                  </div>
                  <div className="flex flex-col gap-y-1 border-r-2 pr-3">
                    <h1 className="text-lg font-semibold">Trip Cost</h1>
                    <div> Trip Offer ID: {trip.offerId} </div>
                    <div> Trips Total Cost: {trip.totalPriceAfterFees} </div>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <h1 className="text-lg font-semibold">Stripe</h1>
                    <h3 className="text-xs text-zinc-500">
                      {" "}
                      For security Reason we will have to remove stripe info in
                      the future{" "}
                    </h3>
                    <div> SetupIntentID {trip.group.owner.setupIntentId} </div>
                    <div>
                      {" "}
                      Stripe Customer ID {
                        trip.group.owner.stripeCustomerId
                      }{" "}
                    </div>
                  </div>
                </div>
                <Separator className="my-2" />
              </div>
            );
          })
        ) : (
          <Spinner />
        )}
      </CardContent>
    </Card>
  );
}
