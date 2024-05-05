import { useState } from "react";
import UserAvatar from "@/components/_common/UserAvatar";
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
import { AspectRatio } from "../ui/aspect-ratio";
import {
  CheckIcon,
  ImagesIcon,
  ChevronRight,
  MapPin,
  UsersRoundIcon,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../_common/Spinner";
import HowToBookDialog from "../requests/[id]/OfferCard/HowToBookDialog";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import OfferPhotos from "./OfferPhotos";
import { useMediaQuery } from "../_utils/useMediaQuery";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
} from "lucide-react";
import AmenitiesComponent from "./CategorizedAmenities";
import PropertyAmenities from "./PropertyAmenities";

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
    offerNightlyPrice ?? 0,
  );

  const checkInDate = formatDateMonthDay(request.checkIn);
  const checkOutDate = formatDateMonthDay(request.checkOut);
  const numNights = getNumNights(request.checkIn, request.checkOut);
  if (property.originalNightlyPrice === null) {
    throw new Error("originalNightlyPrice is required but was not provided.");
  }
  const originalTotal = property.originalNightlyPrice * numNights;

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
        &larr; Back to offers
      </Link>
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-[2] space-y-2">
          <h1 className="items-center text-lg font-semibold sm:text-3xl">
            {property.name}
          </h1>
          <div className="text-sm font-medium">
            <span>{plural(property.maxNumGuests, "Guest")}</span>
            <span className="mx-2">·</span>
            <span>{plural(property.numBedrooms, "bedroom")}</span>
            <span className="mx-2">·</span>
            <span>{property.propertyType}</span>
            <span className="mx-2">·</span>
            <span>{plural(property.numBeds, "bed")}</span>
            {property.numBathrooms && (
              <>
                <span className="mx-2">·</span>
                <span>{plural(property.numBathrooms, "bath")}</span>
              </>
            )}
          </div>
        </div>
      </div>
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
          <div className="absolute bottom-2 left-2">
            <Dialog>
              <DialogTrigger className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-black shadow-md hover:bg-gray-100">
                <ImagesIcon className="mr-2" />
                See all {property.imageUrls.length} photos
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
      <div className="flex justify-start space-x-4">
        <a
          href="#overview"
          className="font-medium text-black hover:text-gray-800"
        >
          Overview
        </a>
        <a href="#amenities" className="text-gray-600 hover:text-gray-800">
          Amenities
        </a>
        <a href="#location" className="text-gray-600 hover:text-gray-800">
          Location
        </a>
        {property.checkInTime && (
          <a href="#house-rules" className="text-gray-600 hover:text-gray-800">
            House rules
          </a>
        )}
      </div>

      <hr className="h-px border-0 bg-gray-300" />
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-[2] space-y-6">
          <section>
            <div className="flex items-center gap-2">
              <UserAvatar
                name={hostName}
                email={property.host?.email}
                image={property.host?.image}
              />
              <div className="-space-y-1.5">
                <p className="text-sm text-muted-foreground">Hosted by</p>
                <p className="text-lg font-medium">{hostName}</p>
              </div>
            </div>
          </section>
          <hr className="h-px border-0 bg-gray-300" />
          <section id="overview" className="scroll-mt-36">
            <h1 className="text-lg font-semibold md:text-xl">
              About this property
            </h1>
            <div className="z-20 max-w-2xl py-2 text-zinc-700">
              <div className="line-clamp-5 break-words">{property.about}</div>
              <div className="flex justify-start py-2">
                <Dialog>
                  <DialogTrigger className="inline-flex items-center justify-center text-foreground underline underline-offset-2">
                    Show more
                    <ChevronRight className="ml-2" />
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl p-8">
                    <DialogHeader>
                      <DialogTitle>About this property</DialogTitle>
                    </DialogHeader>
                    <p className="whitespace-break-spaces break-words text-base">
                      {property.about}
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>
          <hr className="h-px border-0 bg-gray-300" />
          <section id="amenities" className="scroll-mt-36">
            <h1 className="text-lg font-semibold md:text-xl">Amenitites</h1>
            <PropertyAmenities amenities={property.amenities ?? []} />
            {property.amenities && (
              <Dialog>
                <DialogTrigger className="inline-flex w-full items-center justify-center rounded-lg border border-black px-2.5 py-2 text-foreground md:w-1/4">
                  Show all amenities
                </DialogTrigger>

                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="">Amenities</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-96 overflow-y-scroll">
                    <AmenitiesComponent
                      propertyAmenities={property.amenities}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </section>
        </div>
        <div className="flex-1">
          <Card className="">
            <div>
              <h2 className="flex items-center text-3xl font-semibold">
                {formatCurrency(offerNightlyPrice)}
                <span className="ml-2 py-0 text-sm font-normal text-gray-500">
                  per night
                </span>
              </h2>
              <p className="text-sm font-medium text-black">
                Original price: {formatCurrency(originalTotal / numNights)}
              </p>
              <div className="my-6 grid grid-cols-2 gap-1">
                <div>
                  <div className="inline-flex items-center justify-start rounded-full border border-gray-300 px-10 py-0 py-2 md:rounded-3xl md:px-4 lg:rounded-full lg:px-6">
                    <CalendarDays />
                    <div className="ml-2">
                      <p className="text-sm text-gray-600">Check in</p>
                      <p className="text-base font-bold">{checkInDate}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center justify-start rounded-full border border-gray-300 px-10 py-2 md:rounded-3xl md:px-4 lg:rounded-full lg:px-6">
                    <CalendarDays />
                    <div className="ml-2">
                      <p className="text-sm text-gray-600">Check out</p>
                      <p className="font-bold">{checkOutDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inline-flex w-full items-center rounded-full border border-gray-300 px-8 py-2 md:rounded-3xl md:px-4 lg:rounded-full lg:px-6">
                <UsersRoundIcon />
                <div className="ml-2">
                  <p className="text-sm text-gray-600">Guests</p>
                  <p className="font-bold">
                    {plural(request.numGuests, "Guest")}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4 py-0 text-muted-foreground">
              <div className="-space-y-1 text-black">
                <div className="flex justify-between py-2">
                  <p className="font-medium">
                    {formatCurrency(offerNightlyPrice)} &times; {numNights}{" "}
                    nights
                  </p>
                  <p className="ms-1 font-medium">
                    {formatCurrency(offer.totalPrice)}
                  </p>
                </div>
                <div className="flex justify-between py-2">
                  <p className="font-medium">Service fee</p>
                  <p className="font-medium">
                    {formatCurrency(tramonaServiceFee)}
                  </p>
                </div>
                <hr className="h-px bg-gray-300 py-0" />
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Total</p>
                <p className="text-xs text-gray-500">taxes not included.</p>
              </div>
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
      <hr className="h-px border-0 bg-gray-300" />
      <section id="location" className="scroll-mt-36 space-y-1">
        <h1 className="text-lg font-semibold md:text-xl">Location</h1>
        <div className="inline-flex items-center justify-center py-2 text-base">
          <MapPin className="mr-2" />
          {request.location}
        </div>
        {coordinateData && (
          <div className="relative z-10">
            <MapContainer
              center={[
                coordinateData.coordinates.lat,
                coordinateData.coordinates.lng,
              ]}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: "500px" }}
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
                pathOptions={{ color: "black" }} // Customize circle color and other options
              />
            </MapContainer>
          </div>
        )}
      </section>
      {property.checkInTime && (
        <div>
          <hr className="h-px border-0 bg-gray-300" />
          <section id="house-rules" className="scroll-mt-36">
            <h1 className="text-lg font-bold">House rules</h1>
            {property.checkInTime && property.checkOutTime && (
              <div className="my-2 flex items-center justify-start gap-16">
                <div className="flex items-center">
                  <ArrowLeftToLineIcon className="mr-2" />{" "}
                  <div>
                    <div className="font-semibold">Check-in time</div>
                    <div>After {property.checkInTime.substring(0, 5)}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowRightToLineIcon className="mr-2" />{" "}
                  <div>
                    <div className="font-semibold">Check-out time</div>
                    <div>Before {property.checkOutTime.substring(0, 5)}</div>
                  </div>
                </div>
              </div>
            )}
            {property.checkInInfo && (
              <div className="pt-6">
                <h1 className="text-md font-bold">Additional information</h1>
                <p>{property.checkInInfo}</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
