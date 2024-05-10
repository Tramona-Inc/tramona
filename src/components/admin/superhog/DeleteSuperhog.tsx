import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/utils/api";
import { ReservationInterface } from "@/server/api/routers/superhogRouter";
import Spinner from "@/components/_common/Spinner";
import { TrashIcon } from "lucide-react";

export default function DeleteSuperhog() {
  const {
    data,
    isLoading,
  }: { data: ReservationInterface[] | undefined; isLoading: boolean } =
    api.superhog.getAllVerifications.useQuery();

  const content = data ? (
    data.length < 1 ? (
      <p className="flex h-[400px] items-center justify-center text-center">
        Currently there are no verification forms
      </p>
    ) : (
      data.map((reservation, index) => {
        return (
          <Card className="" key={index}>
            <CardHeader className="flex flex-row justify-between">
              {reservation.nameOfVerifiedUser}{" "}
              <TrashIcon className="hover:scale-105" />
            </CardHeader>
            <CardContent className="flex flex-col items-stretch text-sm">
              <div>{reservation.superhogVerificationId}</div>
              <div>{}</div>
              <div>
                <p>Property Address</p>
                <div className="flex flex-col gap-y-2">
                  {reservation.propertyAddress}
                  {reservation.propertyTown}
                  {reservation.propertyCountryIso}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })
    )
  ) : null;

  console.log(data);
  return (
    <Card className="m-12 px-10">
      <CardHeader className="my-5 text-3xl font-bold text-primary">
        Delete Superhog verification
      </CardHeader>
      <CardContent>
        <p className="my-3 font-semibold">
          Select a verification report to delete
        </p>
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
