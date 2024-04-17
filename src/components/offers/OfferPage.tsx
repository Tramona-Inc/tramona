import UserAvatar from "@/components/_common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
//import { GoogleMap, Circle } from "@react-google-maps/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api, type RouterOutputs } from "@/utils/api";
import {
  cn,
  formatCurrency,
  formatDateMonthDay,
  getDiscountPercentage,
  getNumNights,
  getTramonaFeeTotal,
  plural,
} from "@/utils/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import "leaflet/dist/leaflet.css";
import { CheckIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../_common/Spinner";
import { useMediaQuery } from "../_utils/useMediaQuery";
import HowToBookDialog from "../requests/[id]/OfferCard/HowToBookDialog";
import { AspectRatio } from "../ui/aspect-ratio";
import OfferPhotos from "./OfferPhotos";

const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  {
    ssr: false, // Disable server-side rendering for this component
  },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  {
    ssr: false,
  },
);
const Circle = dynamic(
  () => import("react-leaflet").then((module) => module.Circle),
  {
    ssr: false,
  },
);

export type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];

export default function OfferPage({
  offer: { property, request, ...offer },
}: {
  offer: OfferWithDetails;
}) {
  let isBooked = false;

  const { data, isLoading } =
    api.offers.getStripePaymentIntentAndCheckoutSessionId.useQuery({
      id: offer.id,
    });

  if (data?.checkoutSessionId !== null && data?.paymentIntentId !== null) {
    isBooked = true;
  }

  const { data: coordinateData } = api.offers.getCoordinates.useQuery({
    location: property.address!,
  });
  const isMobile = useMediaQuery("(max-width: 640px)");

  const isAirbnb =
    property.airbnbUrl === null || property.airbnbUrl === "" ? false : true;

  // const lisa = false; // temporary until we add payments
  const hostName = property.host?.name ?? property.hostName;
  const offerNightlyPrice =
    offer.totalPrice / getNumNights(request.checkIn, request.checkOut);

  const discountPercentage = getDiscountPercentage(
    property.originalNightlyPrice ?? 0,
    offerNightlyPrice,
  );

  const checkInDate = formatDateMonthDay(request.checkIn);
  const checkOutDate = formatDateMonthDay(request.checkOut);
  const numNights = getNumNights(request.checkIn, request.checkOut);

  const originalTotal = property.originalNightlyPrice
    ? property.originalNightlyPrice * numNights
    : 0;

  const tramonaServiceFee = getTramonaFeeTotal(
    originalTotal - offer.totalPrice,
  );

  // const tax = (offer.totalPrice + tramonaServiceFee) * TAX_PERCENTAGE;

  const tax = 0;

  const renderSeeMoreButton = property.imageUrls.length > 4;

  const [indexOfSelectedImage, setIndexOfSelectedImage] = useState<number>(0);
  const firstImageUrl: string = property.imageUrls?.[0] ?? "";
  return (
    <div className="space-y-4">
      <Link
        href={isBooked ? "/requests" : `/requests/${request.id}`}
        className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
      >
        &larr; Back to all offers
      </Link>
      <div className="relative grid min-h-[400px] grid-cols-4 grid-rows-2 gap-2 overflow-clip rounded-xl bg-background">
        <Dialog>
          {isMobile ? (
            // Only render the first image on small screens
            <div className="">
              <DialogTrigger
                key={0}
                onClick={() => setIndexOfSelectedImage(0)}
                className="hover:opacity-90"
              >
                <Image
                  src={firstImageUrl}
                  alt=""
                  fill
                  objectFit="cover"
                  className=""
                />
              </DialogTrigger>
            </div>
          ) : (
            property.imageUrls.slice(0, 5).map((imageUrl, index) => (
              <div
                key={index}
                className={`relative col-span-1 row-span-1 ${
                  index === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <DialogTrigger
                  key={index}
                  onClick={() => setIndexOfSelectedImage(index)}
                  className="hover:opacity-90"
                >
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    objectFit="cover"
                    className=""
                  />
                </DialogTrigger>
              </div>
            ))
          )}
          <DialogContent className="max-w-screen flex items-center justify-center bg-transparent ">
            <div className="  screen-full flex justify-center">
              <OfferPhotos
                propertyImages={property.imageUrls}
                indexOfSelectedImage={indexOfSelectedImage}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* If there are more than 5 images, render the "See more photos" button */}
        {renderSeeMoreButton && (
          <div className="absolute bottom-2 right-2">
            <Dialog>
              <DialogTrigger className="rounded-lg bg-white px-4 py-2 text-black shadow-md hover:bg-gray-100">
                See ({property.imageUrls.length}) photos
              </DialogTrigger>

              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>More Photos</DialogTitle>
                </DialogHeader>
                {/* //dialog within a dialog */}
                <Dialog>
                  <div className="grid-row-4 grid min-h-[1000px] grid-cols-2 gap-2 rounded-xl">
                    {property.imageUrls.map((imageUrl, index) => (
                      <DialogTrigger
                        key={index}
                        className={` hover:opacity-90 ${
                          index === 0 || index % 3 === 0
                            ? "col-span-2 row-span-2"
                            : property.imageUrls.length - 1 == index &&
                                index % 4 === 0
                              ? "col-span-2 row-span-2"
                              : "col-span-1 row-span-1"
                        }`}
                      >
                        <div
                          key={index}
                          onClick={() => setIndexOfSelectedImage(index)}
                        >
                          <AspectRatio ratio={3 / 2}>
                            <Image
                              src={imageUrl}
                              alt=""
                              fill
                              objectFit="cover"
                              className="h-full w-full"
                            />
                          </AspectRatio>
                        </div>
                      </DialogTrigger>
                    ))}
                  </div>
                  <DialogContent className="max-w-screen flex items-center justify-center bg-transparent ">
                    <div className="  screen-full flex justify-center">
                      <OfferPhotos
                        propertyImages={property.imageUrls}
                        indexOfSelectedImage={indexOfSelectedImage}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-[2] space-y-6">
          <h1 className="items-center text-lg font-semibold sm:text-3xl">
            {property.name}{" "}
            <Badge className=" -translate-y-1 bg-primary text-white">
              {discountPercentage}% off
            </Badge>
          </h1>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1">
              {property.numRatings > 0 && (
                <Badge variant="secondary" icon={<StarFilledIcon />}>
                  {property.avgRating} ({property.numRatings})
                </Badge>
              )}
              <Badge variant="secondary">
                {plural(property.numBedrooms, "bedroom")}
              </Badge>
              <Badge variant="secondary">
                {plural(property.numBeds, "bed")}
              </Badge>
              {property.numBathrooms && (
                <Badge variant="secondary">
                  {plural(property.numBathrooms, "bathroom")}
                </Badge>
              )}
              <Badge variant="secondary">{property.roomType}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {property.amenities?.map((amenity) => (
                <Badge variant="secondary" key={amenity}>
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <section>
            <div className="flex items-center gap-2">
              <UserAvatar
                name={hostName}
                email={property.host?.email}
                image={property.host?.image}
              />
              <div className="-space-y-1.5">
                <p className="text-sm text-muted-foreground">Hosted by</p>
                <p className="text-lg font-semibold">{hostName}</p>
              </div>
            </div>
          </section>
          <section>
            <div className="z-20 max-w-2xl rounded-lg bg-zinc-200 px-4 py-2 text-zinc-700">
              <div className="line-clamp-3 break-words">{property.about}</div>
              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger className="text-foreground underline underline-offset-2">
                    Read more
                  </DialogTrigger>

                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>About this property</DialogTitle>
                    </DialogHeader>
                    <p className="whitespace-break-spaces break-words">
                      {property.about}
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>
          <section className="space-y-1">
            {coordinateData && (
              <div className="relative z-10">
                <MapContainer
                  center={[
                    coordinateData.coordinates.lat,
                    coordinateData.coordinates.lng,
                  ]}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ height: "400px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Circle
                    center={[
                      coordinateData.coordinates.lat,
                      coordinateData.coordinates.lng,
                    ]}
                    radius={200} // Adjust radius as needed
                    pathOptions={{ color: "red" }} // Customize circle color and other options
                  />
                </MapContainer>
              </div>
            )}
          </section>
        </div>
        <div className="flex-1">
          <div className="rounded-t-lg bg-black py-2 text-center font-bold text-white">
            {discountPercentage}% OFF
          </div>
          <Card className="rounded-t-none">
            <Card>
              <div className="flex justify-around">
                <div>
                  <p>Check-in</p>
                  <p className="font-bold">{checkInDate}</p>
                </div>
                <div>
                  <p>Check-out</p>
                  <p className="font-bold">{checkOutDate}</p>
                </div>
              </div>
            </Card>
            <div className="space-y-4 border-y py-4 text-muted-foreground">
              <p className="text-xl font-bold text-black">Price Details</p>
              <div className="-space-y-1 text-black">
                <div className="flex justify-between py-2">
                  <p className="underline">
                    {formatCurrency(offerNightlyPrice)} &times; {numNights}{" "}
                    nights
                  </p>
                  <div className="flex">
                    <p className="text-zinc-400 line-through">
                      {formatCurrency(originalTotal)}
                    </p>
                    <p className="ms-1">{formatCurrency(offer.totalPrice)}</p>
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <p className="underline">Tramona service fee</p>
                  <p>{formatCurrency(tramonaServiceFee)}</p>
                </div>
                {/* <div className="flex justify-between py-2">
                  <p className="underline">Taxes</p>
                  <p>{formatCurrency(tax)}</p>
                </div> */}
              </div>
            </div>
            <div className="flex justify-between py-2">
              <p className="underline">Total (USD)</p>
              <p className="font-bold">
                {formatCurrency(offer.totalPrice + tramonaServiceFee + tax)}
              </p>
            </div>
            {!isLoading ? (
              <HowToBookDialog
                isBooked={isBooked}
                listingId={offer.id}
                propertyName={property.name}
                originalNightlyPrice={property.originalNightlyPrice ?? 0}
                airbnbUrl={property.airbnbUrl ?? ""}
                checkIn={request.checkIn}
                checkOut={request.checkOut}
                requestId={request.id}
                offer={{ property, ...offer }}
                totalPrice={offer.totalPrice}
                offerNightlyPrice={offerNightlyPrice}
                isAirbnb={isAirbnb}
              >
                <Button
                  size="lg"
                  className="w-full rounded-full"
                  disabled={isBooked}
                >
                  {isBooked ? (
                    <>
                      <CheckIcon className="size-5" />
                      Booked
                    </>
                  ) : (
                    <>Confirm Booking</>
                  )}
                </Button>
              </HowToBookDialog>
            ) : (
              <Spinner />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
