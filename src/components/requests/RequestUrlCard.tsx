import { type RouterOutputs } from "@/utils/api";
import { getFmtdFilters, getRequestStatus } from "@/utils/formatters";
import {
  formatCurrency,
  formatDateRange,
  formatInterval,
  getNumNights,
  plural,
} from "@/utils/utils";
import { CalendarIcon, FilterIcon, MapPinIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import RequestGroupAvatars from "./RequestCardGroupAvatars";

export type DetailedRequest = RouterOutputs["requests"]["getMyRequests"][
  | "activeRequestGroups"
  | "inactiveRequestGroups"][number]["requests"][number];

export type RequestWithUser = RouterOutputs["requests"]["getAll"][
  | "incomingRequests"
  | "pastRequests"][number];

export default function RequestUrlCard({
  request,
  isAdminDashboard,
  children,
}: React.PropsWithChildren<
  | { request: DetailedRequest; isAdminDashboard?: false | undefined }
  | { request: RequestWithUser; isAdminDashboard: true }
>) {

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
    <Card key={sample_request.id} className="mx-auto max-w-4xl">
      <CardContent className="flex flex-col md:flex-row bg-white p-4">
        <div className="md:w-3/5 space-y-4">
          <Badge variant="gray" className="mb-2 inline-block">
            Unconfirmed
          </Badge>
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
          <button className="w-full md:w-11/12 rounded-full bg-black py-2 text-white hover:bg-gray-800 mt-4 md:mt-0">
            Resend confirmation
          </button>
        </div>
      </CardContent>
      <CardFooter>{children}</CardFooter>
    </Card>
  );
  
}

export function RequestCardBadge({
  request,
}: {
  request: DetailedRequest | RequestWithUser;
}) {
  switch (getRequestStatus(request)) {
    case "pending":
      const msAgo = Date.now() - request.createdAt.getTime();
      const showTimeAgo = msAgo > 1000 * 60 * 60;
      const fmtdTimeAgo = showTimeAgo ? `(${formatInterval(msAgo)})` : "";
      return <Badge variant="yellow">Pending {fmtdTimeAgo}</Badge>;
    case "accepted":
      return (
        <Badge variant="green">
          {plural(request.numOffers, "offer")}
          {"hostImages" in request && request.hostImages.length > 0 && (
            <div className="flex items-center -space-x-2">
              {request.hostImages.map((imageUrl) => (
                <Image
                  key={imageUrl}
                  src={imageUrl}
                  alt=""
                  width={22}
                  height={22}
                  className="inline-block"
                />
              ))}
            </div>
          )}
        </Badge>
      );
    case "rejected":
      return <Badge variant="red">Rejected</Badge>;
    case "booked":
      return <Badge variant="blue">Booked</Badge>;
  }
}
