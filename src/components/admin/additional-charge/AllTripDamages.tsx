import { api } from "@/utils/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Spinner from "../../_common/Spinner";
import { Separator } from "@/components/ui/separator";

export default function AllTripDamages() {
  const { data: allTripDamages } = api.trips.getAllTripDamages.useQuery();
  console.log("sllTripes", allTripDamages);
  return (
    <Card>
      <CardHeader>All Trip damages</CardHeader>
      <CardContent>
        {allTripDamages ? (
          allTripDamages.length > 0 ? ( // Corrected condition
            allTripDamages.map((trip) => {
              return (
                <div key={trip.tripId}>
                  <div className="flex flex-row gap-x-4">
                    <div className="flex flex-col gap-y-1">
                      <h1 className="text-lg font-semibold">Trip</h1>
                      <div>Trip ID: {trip.tripId}</div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <h1 className="text-lg font-semibold">Amount</h1>
                      <div>Amount: {trip.amount}</div>
                      <div>
                        {trip.paymentCompleteAt ? (
                          <div>
                            {" "}
                            Payment completed at {trip.createdAt.toDateString()}
                          </div>
                        ) : (
                          <div> Payment not completed </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <h1 className="text-lg font-semibold">Reason</h1>
                      <div>{trip.description}</div>
                    </div>
                  </div>
                  <Separator className="my-2" />
                </div>
              );
            })
          ) : (
            <div>No Trip Damages found</div>
          )
        ) : (
          <Spinner />
        )}
      </CardContent>
    </Card>
  );
}
