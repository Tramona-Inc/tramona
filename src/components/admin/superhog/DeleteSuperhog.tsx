import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/utils/api";
import { generateTimeStamp } from "@/utils/utils";
import { ReservationInterface } from "@/server/api/routers/superhogRouter";
import Spinner from "@/components/_common/Spinner";
import {
  CircleCheckBigIcon,
  CircleOffIcon,
  FlagIcon,
  TrashIcon,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { reducer } from "../../ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteSuperhog() {
  const {
    data,
    isLoading,
  }: { data: ReservationInterface[] | undefined; isLoading: boolean } =
    api.superhog.getAllVerifications.useQuery();

  const deleteVerificationMutation =
    api.superhog.deleteVerification.useMutation({
      onSuccess: () => {
        console.log("Successfully deleted verification");
      },
      onError: (error) => {
        console.log(
          "Failed to delete verification this is the onError on client side",
        );
        console.log(error);
      },
    });

  const content = data ? (
    data.length < 1 ? (
      <p className="flex h-[400px] items-center justify-center text-center">
        Currently there are no verification forms
      </p>
    ) : (
      data.map((reservation, index) => {
        return (
          <Card className="" key={index}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex flex-col gap-y-1">
                <h1 className="font-bold">{reservation.nameOfVerifiedUser}</h1>
                <div className="flex flex-row items-center gap-x-1 text-xs  font-semibold text-primary">
                  Status: <div>{reservation.superhogStatus} </div>
                  <div>
                    {reservation.superhogStatus === "Approved" ? (
                      <CircleCheckBigIcon
                        size={15}
                        className="text-green-500"
                      />
                    ) : reservation.superhogStatus === "Flagged" ? (
                      <FlagIcon
                        size={16}
                        className="text-yellow-500"
                      ></FlagIcon>
                    ) : reservation.superhogStatus === "Rejected" ? (
                      <CircleOffIcon size={16} className="text-red-500" />
                    ) : (
                      <div>{reservation.superhogStatus}</div>
                    )}
                  </div>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger>
                  <TrashIcon className="hover:scale-105" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from both our and
                      superhog servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        try {
                          deleteVerificationMutation.mutate({
                            metadata: {
                              echoToken: uuidv4(),
                              timeStamp: generateTimeStamp(),
                            },
                            verification: {
                              verificationId:
                                reservation.superhogVerificationId,
                            },
                            reservation: {
                              reservationId: reservation.superhogReservationId,
                            },
                          });
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                    >
                      {/** some inputs */}
                      <AlertDialogAction
                        type="submit"
                        className="bg-destructive hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
            <CardContent className="flex flex-col items-stretch text-sm">
              <div className="mb-3 flex-col text-left text-xs">
                <div className="text-sm font-semibold tracking-tight text-primary">
                  Property Address
                </div>
                {reservation.propertyAddress}
                <div>
                  {reservation.propertyTown}, {reservation.propertyCountryIso}
                </div>
              </div>
              <div className="my-2 text-sm tracking-tight text-muted-foreground">
                <div className="text-primary">Check-in / Check-out</div>
                {reservation.checkIn.slice(5)} - {reservation.checkOut.slice(5)}
              </div>
              <div className="my-1 flex flex-col font-semibold tracking-tight">
                Verification ID
                <div className="text-xs font-normal text-muted-foreground">
                  {reservation.superhogVerificationId}
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
