import { type Offer } from "@/server/db/schema";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Offers({ offers }: { offers: Offer[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>You have an offer</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Offers</DialogTitle>
            <DialogDescription>Add personal equest</DialogDescription>
          </DialogHeader>

          <section>
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex flex-row items-center justify-center"
              >
                <p>Offer Priced: ${offer.totalPrice}</p>
                <Link href={`/property/${offer.propertyId}`}>
                  <Button variant={"link"}>Link to Property</Button>
                </Link>
              </div>
            ))}
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
}
