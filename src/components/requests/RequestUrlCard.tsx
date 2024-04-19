import { type RouterOutputs } from "@/utils/api";
import {
  formatCurrency,
  formatDateRange,
} from "@/utils/utils";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

// todo - add props, make it into dialog
export default function RequestUrlCard() {

  const sample_request = {
    id: "1",
    location: "Driftwood Beach Waterfront Estate 5 bedroom 5 bath",
    checkIn: new Date("2024-03-25"),
    checkOut: new Date("2024-03-29"),
    numGuests: 3,
    numNights: 5,
    originalPricePerNight: 120000,
    cleaningFee: 35000,
    serviceFee: 89647,
    taxes: 79368,
    total: 804015,
    hasApproved: false,
    rating: 5,
    reviews: 30,
    imageUrl: "/assets/images/landing-page/how_it_works.jpeg",
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <CardContent className="flex flex-col md:flex-row bg-white p-4">
        <div className="md:w-3/5 space-y-4">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="shrink-0 text-zinc-500" />
            <h2 className="text-xl md:text-2xl font-semibold">{sample_request.location}</h2>
          </div>
          <div className="flex items-center space-x-4 text-lg">
            <CalendarIcon className="shrink-0 text-zinc-500" size={20} />
            <span className="text-black">
              {formatDateRange(sample_request.checkIn, sample_request.checkOut)}
            </span>
            <UsersIcon className="shrink-0 text-zinc-500" size={20} />
            <span>{sample_request.numGuests} guests</span>
          </div>
          <div className="text-gray-500">
            Entire home ·{" "}
            <span className="text-black">
              ★ {sample_request.rating} ({sample_request.reviews} reviews)
            </span>
          </div>
          <div className="border-b border-t border-gray-200 py-4">
            <p className="text-lg font-bold">Price details</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>{`${formatCurrency(sample_request.originalPricePerNight)} x ${sample_request.numNights} nights`}</p>
                <p className="font-bold">{formatCurrency(sample_request.originalPricePerNight * sample_request.numNights)}</p>
              </div>
              <div className="flex justify-between">
                <p className="underline">Cleaning fee</p>
                <p className="font-bold">{formatCurrency(sample_request.cleaningFee)}</p>
              </div>
              <div className="flex justify-between">
                <p className="underline">Airbnb service fee</p>
                <p className="font-bold">{formatCurrency(sample_request.serviceFee)}</p>
              </div>
              <div className="flex justify-between">
                <p className="underline">Taxes</p>
                <p className="font-bold">{formatCurrency(sample_request.taxes)}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <p>Total (USD)</p>
            <p>{formatCurrency(sample_request.total)}</p>
          </div>
        </div>
        <div className="md:w-2/5 flex flex-col items-center md:items-end justify-between mt-4 md:mt-0 px-4">
          <Image
            src={sample_request.imageUrl}
            alt=""
            width={250}
            height={250}
            className="rounded-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
  
}