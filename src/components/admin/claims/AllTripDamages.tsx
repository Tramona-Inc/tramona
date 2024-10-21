import { api } from "@/utils/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Spinner from "../../_common/Spinner";
import { Separator } from "@/components/ui/separator";

export default function AllclaimItems() {
  const { data: allclaimItems } = api.trips.getAllclaimItems.useQuery();
  console.log("sllTripes", allclaimItems);
  return (
    <Card>
      <CardHeader>All Trip damages</CardHeader>
      <CardContent>
        {allclaimItems ? (
          allclaimItems.length > 0 ? ( // Corrected condition
            allclaimItems.map((trip) => {
              return (
                <div key={trip.tripId}>
                  <div className="flex flex-row gap-x-4">
                    <div className="flex flex-col gap-y-1">
                      <h1 className="text-lg font-semibold">Trip</h1>
                      <div>Trip Id: {trip.tripId}</div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <h1 className="text-lg font-semibold">Amount</h1>
                      <div>Requested Amount: {trip.requestedAmount}</div>
                      <div>Outstanding Amount: {trip.outstandingAmount}</div>
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
