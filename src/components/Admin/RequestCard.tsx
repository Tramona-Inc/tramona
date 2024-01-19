import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { type Request } from "@/server/db/schema/tables/requests";
import AdminFormOffer from "./AdminFormOffer";
import { api } from "@/utils/api";
import OfferInfo from "./Offers";
import { Button } from "../ui/button";
import Icons from "../ui/icons";
import { toast } from "../ui/use-toast";

type Props = {
  children?: React.ReactNode;
  request: Request;
};

export default function RequestCard({ children, request }: Props) {
  const [open, setOpen] = useState(false);

  const { data: offers, isLoading: isLoadingOffers } =
    api.offers.getByRequestId.useQuery({
      id: request.id,
    });

  const utils = api.useUtils(); // To allow to invalidate the data useContext depracated

  const { mutate } = api.requests.delete.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast({
        title: "Request created sucessfully",
        variant: "default",
      });
      void utils.requests.getAll.invalidate(); // will revalidate the tasks array to see if there are any changes
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card key={request.id}>
      <CardHeader>
        <CardTitle className="capitalize">{request.location}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between">
          <div className="space-y-2">
            <p>Price: ${request.maxTotalPrice}</p>
            <p>Location: {request.location}</p>
            {/* <p>Check-in: {request.checkIn}</p>
                  <p>Check-out: {request.checkOut}</p> */}
            <p>Guests: {request.numGuests}</p>
            <p>Beds: {request.minNumBeds}</p>
            <p>Bedrooms: {request.minNumBedrooms}</p>
            <p>Propety Type: {request.propertyType}</p>

            <div className="flex gap-5">
              <AdminFormOffer requestId={request.id} />

              {/* Display if offer exist*/}
              {isLoadingOffers ? (
                <h1>Loading...</h1> // TODO: Add loading spiner
              ) : (
                offers && offers.length > 0 && <OfferInfo offers={offers} />
              )}
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant={"destructive"}>
                <Icons iconName={"trash"} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  request!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => mutate({ id: request.id })}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>

      <CardFooter>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Notes</AccordionTrigger>
            <AccordionContent>{request.note}</AccordionContent>
          </AccordionItem>
        </Accordion>
        {children}
      </CardFooter>
    </Card>
  );
}
