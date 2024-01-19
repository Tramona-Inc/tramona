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

type Props = {
  children?: React.ReactNode;
  request: Request;
};

export default function RequestCard({ children, request }: Props) {
  return (
    <Card key={request.id}>
      <CardHeader>
        <CardTitle>{request.location}</CardTitle>
      </CardHeader>
      <CardContent>
        <h1>Price: ${request.maxTotalPrice}</h1>
        <h1>Location: {request.location}</h1>
        {/* <h1>Check-in: {request.checkIn}</h1>
              <h1>Check-out: {request.checkOut}</h1> */}
        <h1>Guests: {request.numGuests}</h1>
        <h1>Beds: {request.minNumBeds}</h1>
        <h1>Bedrooms: {request.minNumBedrooms}</h1>
        <h1>Propety Type: {request.propertyType}</h1>
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
