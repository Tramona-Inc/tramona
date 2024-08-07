import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/utils/api";
import { type ReservationInterface } from "@/server/api/routers/superhogRouter";
import EditReservationCard from "./EditReservationCard";

import Spinner from "@/components/_common/Spinner";

export default function EditSuperhogForm() {
  const {
    data,
    isLoading,
  }: { data: ReservationInterface[] | undefined; isLoading: boolean } =
    api.superhog.getAllVerifications.useQuery();

  console.log("data", data);
  const content = data ? (
    data.length < 1 ? (
      <p className="flex h-[400px] items-center justify-center text-center">
        Currently there are no verification forms
      </p>
    ) : (
      data.map((reservation, index) => {
        return <EditReservationCard reservation={reservation} key={index} />;
      })
    )
  ) : null;

  return (
    <Card className="m-12 px-10">
      <CardHeader className="my-5 text-3xl font-bold text-primary">
        Edit Superhog verifications dates
      </CardHeader>
      <CardContent>
        <p className="my-3 font-semibold">
          Select the dates of a verification report to edit
        </p>
        <Card className="my-4 bg-red-50">
          <CardContent>
            <div className="font-bold">
              Warning: Changing insurance dates will change the actual trip
              date...{" "}
            </div>
          </CardContent>
        </Card>
        <div className=" ">
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-2 gap-4">{content}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
