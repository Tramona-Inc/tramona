import { CircleCheckBigIcon, CircleOffIcon, FlagIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PencilIcon } from "lucide-react";
import { type ReservationInterface } from "@/server/api/routers/superhogRouter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormDescription,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { generateTimeStamp } from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
const formSchema = z.object({
  metadata: z.object({
    timeStamp: z.string(),
    echoToken: z.string(),
  }),
  verification: z.object({
    verificationId: z.string(),
  }),
  reservation: z.object({
    reservationId: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function EditReservationCard({
  reservation,
}: {
  reservation: ReservationInterface;
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const defaultRequestValues = {
    metadata: {
      timeStamp: generateTimeStamp(),
      echoToken: uuidv4(),
    },
    verification: {
      verificationId: reservation.superhogVerificationId,
    },
    reservation: {
      reservationId: reservation.superhogReservationId,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
    },
  };
  const { mutateAsync } = api.superhog.updateVerification.useMutation({
    onSuccess: () => {
      toast({
        title: "Reservation Updated",
        description: "The reservation has been updated successfully",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast({
          title: "The reservation has not been updated successfully",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const form = useForm<FormSchema>({
    defaultValues: defaultRequestValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormSchema) => {
    mutateAsync(data)
      .then(() => {
        toast({
          title: "Reservation Updated",
          description: "The reservation has been updated successfully",
        });
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast({
            title: "The reservation has not been updated successfully",
            description: error.message,
            variant: "destructive",
          });
        }
      });
  };
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="font-bold">{reservation.nameOfVerifiedUser}</h1>
          <div className="flex flex-row items-center gap-x-1 text-xs font-semibold text-primary">
            Status: <div>{reservation.superhogStatus} </div>
            <div>
              {reservation.superhogStatus === "Approved" ? (
                <CircleCheckBigIcon size={15} className="text-green-500" />
              ) : reservation.superhogStatus === "Flagged" ? (
                <FlagIcon size={16} className="text-yellow-500"></FlagIcon>
              ) : reservation.superhogStatus === "Rejected" ? (
                <CircleOffIcon size={16} className="text-red-500" />
              ) : (
                <div>{reservation.superhogStatus}</div>
              )}
            </div>
          </div>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <PencilIcon className="hover:scale-105" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Edit {reservation.nameOfVerifiedUser}&apos;s check-in dates
              </DialogTitle>
              <DialogDescription className="text-sm">
                Make changes to the request here. Click update when you&aposre
                done and we will send it to superhog.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="reservation.checkIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>year/mm/dd</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reservation.checkOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>year/mm/dd</FormDescription>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    Update Dates
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
}
