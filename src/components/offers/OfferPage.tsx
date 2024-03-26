import UserAvatar from "@/components/_common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
//import { GoogleMap, Circle } from "@react-google-maps/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ALL_PROPERTY_SAFETY_ITEMS } from "@/server/db/schema";
import { type RouterOutputs, api } from "@/utils/api";
import { TAX_PERCENTAGE } from "@/utils/constants";
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
import { CheckIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../_common/Spinner";
import HowToBookDialog from "../requests/[id]/OfferCard/HowToBookDialog";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
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

  const isAirbnb =
    property.airbnbUrl === null || property.airbnbUrl === "" ? false : true;

  // const lisa = false; // temporary until we add payments
  const hostName = property.host?.name ?? property.hostName;
  const lackingSafetyItems = ALL_PROPERTY_SAFETY_ITEMS.filter(
    (i) => !property.safetyItems.includes(i),
  );
  const offerNightlyPrice =
    offer.totalPrice / getNumNights(request.checkIn, request.checkOut);

  const discountPercentage = getDiscountPercentage(
    property.originalNightlyPrice,
    offerNightlyPrice,
  );

  const checkInDate = formatDateMonthDay(request.checkIn);
  const checkOutDate = formatDateMonthDay(request.checkOut);
  const numNights = getNumNights(request.checkIn, request.checkOut);

  const originalTotal = property.originalNightlyPrice * numNights;

  const tramonaServiceFee = getTramonaFeeTotal(
    originalTotal - offer.totalPrice,
  );

  // const tax = (offer.totalPrice + tramonaServiceFee) * TAX_PERCENTAGE;

  const tax = 0;

  const renderSeeMoreButton = property.imageUrls.length > 5;

  return (
    <div className="space-y-4">
      <Link
        href={isBooked ? "/requests" : `/requests/${request.id}`}
        className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
      >
        &larr; Back to all offers
      </Link>
      <div className="relative">
        <div className="grid h-[420.69px] grid-cols-4 grid-rows-2 gap-2 overflow-clip rounded-xl">
          {/* Render the first 5 images */}
          {property.imageUrls.slice(0, 5).map((imageUrl, index) => (
            <div
              key={index}
              className={`relative col-span-1 row-span-1 bg-accent ${index === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              <Image src={imageUrl} alt="" fill objectFit="cover" />
            </div>
          ))}
        </div>
        {/* If there are more than 5 images, render the "See more photos" button */}
        {renderSeeMoreButton && (
          <div className="absolute bottom-2 right-2">
            <Dialog>
              <DialogTrigger className="rounded-lg bg-white px-4 py-2 text-black shadow-md hover:bg-gray-100">
                See more photos
              </DialogTrigger>

              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>More Photos</DialogTitle>
                </DialogHeader>
                <div className="grid-rows-auto grid min-h-[1000px] grid-cols-2 gap-2 rounded-xl">
                  {property.imageUrls.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={`relative bg-accent ${
                        index === 0 || index === 3
                          ? "col-span-2 row-span-2"
                          : "col-span-1 row-span-1"
                      }`}
                    >
                      <Image
                        src={imageUrl}
                        alt=""
                        fill
                        objectFit="cover"
                        className="h-full w-full"
                      />
                    </div>
                  ))}
                </div>
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
              <Badge variant="secondary" icon={<StarFilledIcon />}>
                {property.avgRating} ({property.numRatings})
              </Badge>
              <Badge variant="secondary">
                {plural(property.numBedrooms, "bedroom")}
              </Badge>
              <Badge variant="secondary">
                {plural(property.numBeds, "bed")}
              </Badge>
              <Badge variant="secondary">{property.propertyType}</Badge>
              {property.amenities.map((amenity) => (
                <Badge variant="secondary" key={amenity}>
                  {amenity}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {property.standoutAmenities.map((amenity) => (
                <Badge
                  variant="secondary"
                  // icon={<CheckIcon className="size-4" />}
                  key={amenity}
                >
                  {amenity}
                </Badge>
              ))}
              {lackingSafetyItems.map((amenity) => (
                <Badge
                  variant="secondary"
                  icon={<XIcon className="size-4" />}
                  key={amenity}
                >
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
            <div className="max-w-2xl rounded-lg bg-zinc-200 px-4 py-2 text-zinc-700">
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
            {/* {coordinateData && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={coordinateData.coordinates}
                zoom={13}
              >
                <Circle
                  center={coordinateData.coordinates}
                  radius={500} // Radius is in meters, so 5 meters radius equals 10 meters diameter
                  options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.15,
                  }}
                />
              </GoogleMap>
            )} */}

            {coordinateData && (
              <MapContainer
                center={[coordinateData.coordinates.lat, coordinateData.coordinates.lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "400px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Circle
                  center={[coordinateData.coordinates.lat, coordinateData.coordinates.lng]}
                  radius={200} // Adjust radius as needed
                  pathOptions={{ color: "red" }} // Customize circle color and other options
                />
                {/* <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker> */}
              </MapContainer>
            )}

            {/* {(property.mapScreenshot !== null ||
            property.areaDescription !== null) && (
            <section className="space-y-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Where you&apos;ll be
              </h2>
              <div className="overflow-clip rounded-lg bg-accent">
                {property.mapScreenshot && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={property.mapScreenshot}
                    alt=""
                    className="h-auto w-full"
                  />
                )}
                <p className="px-4 py-2 text-zinc-700">
                  {property.areaDescription}
                </p>
              </div> */}
          </section>
          {/* )} */}
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
                <div className="flex justify-between py-2">
                  <p className="underline">Taxes</p>
                  <p>{formatCurrency(tax)}</p>
                </div>
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
                originalNightlyPrice={property.originalNightlyPrice}
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
