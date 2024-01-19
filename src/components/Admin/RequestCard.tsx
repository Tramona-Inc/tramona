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
import { Button } from "../ui/button";
import AdminFormOffer from "./AdminFormOffer";

type Props = {
  children?: React.ReactNode;
  request: Request;
};

export default function RequestCard({ children, request }: Props) {
  return (
    <Card key={request.id}>
      <CardHeader>
        <CardTitle className="capitalize">{request.location}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row justify-between">
        <div>
          <p>Price: ${request.maxTotalPrice}</p>
          <p>Location: {request.location}</p>
          {/* <p>Check-in: {request.checkIn}</p>
                <p>Check-out: {request.checkOut}</p> */}
          <p>Guests: {request.numGuests}</p>
          <p>Beds: {request.minNumBeds}</p>
          <p>Bedrooms: {request.minNumBedrooms}</p>
          <p>Propety Type: {request.propertyType}</p>
        </div>
        <div>
          {/* // TODO: Link to offer  */}
          <AdminFormOffer requestId={request.id} />
          {/* <Button>View Offer</Button> */}
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
