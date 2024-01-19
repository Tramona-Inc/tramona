import React from "react";
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
import { type Request } from "@/server/db/schema/tables/requests";
import AdminFormOffer from "./AdminFormOffer";
import { api } from "@/utils/api";
import OfferInfo from "./Offers";

type Props = {
  children?: React.ReactNode;
  request: Request;
};

export default function RequestCard({ children, request }: Props) {
  const { data: offers } = api.offers.getByRequestId.useQuery({
    id: request.id,
  });

  return (
    <Card key={request.id}>
      <CardHeader>
        <CardTitle className="capitalize">{request.location}</CardTitle>
      </CardHeader>
      <CardContent>
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
            {offers && offers.length > 0 && <OfferInfo offers={offers} />}
          </div>
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
