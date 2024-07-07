import { useState } from "react";
import UserAvatar from "@/components/_common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type RouterOutputs } from "@/utils/api";
import {
  formatCurrency,
  formatShortDate,
  getNumNights,
  plural,
} from "@/utils/utils";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  CheckIcon,
  ImagesIcon,
  ChevronRight,
  BedDouble,
  BedSingle,
  Star,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import HowToBookDialog from "../requests/[id]/OfferCard/HowToBookDialog";
import "leaflet/dist/leaflet.css";
import OfferPhotos from "./OfferPhotos";
import { useMediaQuery } from "../_utils/useMediaQuery";
import { ArrowLeftToLineIcon, ArrowRightToLineIcon } from "lucide-react";
import AmenitiesComponent from "./CategorizedAmenities";
import PropertyAmenities from "./PropertyAmenities";
import router from "next/router";
import { useSession } from "next-auth/react";
import ShareOfferDialog from "../_common/ShareLink/ShareOfferDialog";
import { formatDateRange } from "@/utils/utils";
import FireIcon from "../_icons/FireIcon";
import { GuestReviews } from "./GuestReviews";
import { HostCard } from "./HostCard";
import { HouseRules } from "./HouseRules";
import SingleLocationMap from "../_common/GoogleMaps/SingleLocationMap";
import { MobileHouseRules } from "./MobileHouseRules";

export type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];

export default function OfferPage({
  offer: { property, request, ...offer },
  mapCenter: { lat, lng },
}: {
  offer: OfferWithDetails;
  mapCenter: { lat: number | null; lng: number | null };
}) {
  const { status } = useSession();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const isAirbnb =
    property.airbnbUrl === null || property.airbnbUrl === "" ? false : true;

  const isBooked = !!offer.acceptedAt;

  // const lisa = false; // temporary until we add payments
  const hostName = property.host?.name ?? property.hostName;
  const offerNightlyPrice =
    offer.totalPrice / getNumNights(offer.checkIn, offer.checkOut);

  // const discountPercentage = getDiscountPercentage(
  //   property.originalNightlyPrice ?? 0,
  //   offerNightlyPrice ?? 0,
  // );

  const numNights = getNumNights(offer.checkIn, offer.checkOut);
  if (property.originalNightlyPrice === null) {
    throw new Error("originalNightlyPrice is required but was not provided.");
  }
  const originalTotal = property.originalNightlyPrice * numNights;

  const tramonaServiceFee = offer.tramonaFee;

  // const tax = (offer.totalPrice + tramonaServiceFee) * TAX_PERCENTAGE;

  const renderSeeMoreButton = property.imageUrls.length > 4;

  const [indexOfSelectedImage, setIndexOfSelectedImage] = useState<number>(0);
  const firstImageUrl = property.imageUrls[0]!;
  return (
    <div className="max-w-[375px] lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
      {!isMobile ? (
        <div className="flex flex-col">
          <div className="relative mt-4 grid min-h-[624px] max-w-7xl grid-cols-4 grid-rows-2 gap-5 overflow-clip rounded-xl bg-background">
            <Dialog>
              {isMobile ? (
                // Only render the first image on small screens
                <div>
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
                        className="rounded-md"
                      />
                    </DialogTrigger>
                  </div>
                ))
              )}
              <DialogContent className="max-w-screen flex items-center justify-center bg-transparent">
                <div className="screen-full flex justify-center">
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
                  <DialogTrigger asChild>
                    <Button variant="white" className="rounded-full">
                      <ImagesIcon />
                      See all {property.imageUrls.length} photos
                    </Button>
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
                            className={`hover:opacity-90 ${
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
                      <DialogContent className="max-w-screen flex items-center justify-center bg-transparent">
                        <div className="screen-full flex justify-center">
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

          <div className="mt-8 flex h-[80px] max-w-7xl items-center justify-center rounded-md bg-[#134E4A] text-[32px] text-[#FFFFFF]">
            23% off Airbnb Price
          </div>

          {/* <div className="flex justify-start space-x-4">
        <a
          href="#overview"
          className="font-medium text-black hover:text-gray-800"
        >
          Overview
        </a>
        <a href="#amenities" className="text-gray-600 hover:text-gray-800">
          Amenities
        </a>
        <a href="#cancellation" className="text-gray-600 hover:text-gray-800">
          Cancellation Policy
        </a>
        {property.checkInTime && (
          <a href="#house-rules" className="text-gray-600 hover:text-gray-800">
            House rules
          </a>
        )}
      </div> */}
          <div className="mt-6 flex flex-col">
            <div className="flex max-w-7xl flex-row space-x-14">
              <div className="flex flex-1 flex-col">
                <div className="mb-4 w-[757px] flex-col gap-4 md:flex-row md:items-start">
                  <div className="space-y-2">
                    <div className="flex flex-row items-center">
                      <h1 className="items-center text-[36px] font-semibold">
                        {property.name}
                      </h1>
                      <div className="flex justify-start py-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="ml-[620px] h-[34px] w-[209px] rounded-md bg-[#FF0000] text-[14px] text-[#FFFFFF] hover:bg-[#CC0000]">
                              View Property on Airbnb
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            {/* <DialogHeader>
                            <DialogTitle>Amenities</DialogTitle>
                          </DialogHeader> */}
                            <div className="max-h-96 overflow-y-auto">
                              <div className="flex flex-col space-y-10">
                                <div className="flex justify-center p-8 text-[20px]">
                                  Remember: When comparing prices, Airbnb hides
                                  the final price until the last step. Our price
                                  is always the final, all in price.
                                </div>
                                <div className="flex justify-center space-x-52 pb-32">
                                  <Button className="h-[34px] w-[209px] rounded-md bg-[#FF0000] text-[14px] text-[#FFFFFF] hover:bg-[#CC0000]">
                                    See Pricing on Airbnb
                                  </Button>
                                  <Button className="h-[34px] w-[209px] rounded-md bg-[#FF0000] text-[14px] text-[#FFFFFF] hover:bg-[#CC0000]">
                                    See Property on Airbnb
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    {/* Need data for this */}
                    <div className="flex flex-row items-center text-[16px]">
                      <div>Home in Los Angeles, California ·</div>&nbsp;
                      <Star className="mr-1 h-3 w-3 fill-[#004236] text-[#004236]" />
                      <div>4.9 ·</div>&nbsp;
                      <button>
                        <u>117 Reviews</u>
                      </button>
                    </div>
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

                <hr className="h-px border-0 bg-[#D9D9D9]" />

                <div className="mt-4 flex flex-col-reverse gap-4 md:flex-row md:items-start">
                  <div className="flex-[2] space-y-6">
                    <section>
                      <div className="-mb-2 flex items-center gap-2">
                        <UserAvatar
                          name={hostName}
                          email={property.host?.email}
                          image={property.host?.image}
                        />
                        <div className="-space-y-1.5">
                          <p className="text-sm text-muted-foreground">
                            Hosted by
                          </p>
                          <p className="text-lg font-medium">{hostName}</p>
                        </div>
                      </div>
                    </section>
                    <hr className="h-px border-0 bg-[#D9D9D9]" />
                    <section id="overview" className="scroll-mt-36">
                      <h1 className="text-lg font-bold lg:whitespace-nowrap lg:text-[24px]">
                        About this property
                      </h1>
                      <div className="z-20 max-w-2xl py-2 text-zinc-700">
                        <div className="line-clamp-5 break-words">
                          {property.about}
                        </div>
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

                    <hr className="h-px border-0 bg-[#D9D9D9]" />

                    {/* need to make this part dynamic */}
                    <section id="rooms&beds" className="scroll-mt-36">
                      <h1 className="text-lg font-bold md:text-xl lg:whitespace-nowrap lg:text-[24px]">
                        Rooms & Beds
                      </h1>
                      <div className="mt-4 flex flex-row space-x-10">
                        <div className="flex h-[160px] w-[253px] flex-col items-center space-y-3 rounded-xl border border-[#DDDDDD] p-6">
                          <BedDouble className="size-7" />
                          <div className="text-[16px] font-bold">Bedroom 1</div>
                          <div className="text-[16px] text-[#606161]">
                            1 King bed
                          </div>
                        </div>
                        <div className="flex h-[160px] w-[253px] flex-col items-center space-y-3 rounded-xl border border-[#DDDDDD] p-6">
                          <div className="flex flex-row">
                            <BedSingle className="" />
                            <BedSingle className="-ml-[2.5px]" />
                          </div>
                          <div className="text-[16px] font-bold">Bedroom 2</div>
                          <div className="text-[16px] text-[#606161]">
                            1 Twin bed
                          </div>
                        </div>
                      </div>
                    </section>

                    <hr className="h-px border-0 bg-[#D9D9D9]" />

                    <section id="amenities" className="scroll-mt-36">
                      <h1 className="text-lg font-bold md:text-xl lg:text-[24px]">
                        Amenitites
                      </h1>
                      <PropertyAmenities amenities={property.amenities} />

                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="w-full hover:text-[#006F80] sm:w-auto">
                            <u>Show more</u>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Amenities</DialogTitle>
                          </DialogHeader>
                          <div className="max-h-96 overflow-y-auto">
                            <AmenitiesComponent
                              propertyAmenities={property.amenities}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </section>
                    {/* <section id="cancellation" className="scroll-mt-36">
            <h1 className="text-lg font-semibold md:text-xl">
              Cancellation Policy
            </h1>
            <div className="py-2">
              <p className="text-sm font-medium text-black">
                {property.cancellationPolicy ??
                  "This property has a no-cancellation policy. All payments are final and non-refundable if a cancellation occurs."}
              </p>
            </div>
          </section> */}

                    {/* map section */}
                    <section>
                      <div className="mb-10 mt-5">
                        <div className="space-y-4 lg:h-[774px] lg:w-[829px]">
                          <div className="flex flex-col space-y-2">
                            <h2 className="text-[24px] font-bold">
                              Where you'll be
                            </h2>
                            <div className="text-[16px] font-semibold">
                              Los Angeles, California
                            </div>
                          </div>
                          <div className="focus-none h-[300px] w-[353px] rounded-lg lg:h-[774px] lg:w-[829px]">
                            <SingleLocationMap
                              key={`${lat}-${lng}`} // Unique key to force re-render
                              lat={lat}
                              lng={lng}
                            />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* guest reviews section */}
                    <section>
                      <div className="mt-28 lg:w-[829px]">
                        <GuestReviews />
                      </div>
                    </section>
                    {/* host card section */}

                    <hr className="h-px border-0 bg-[#D9D9D9]" />

                    <section>
                      <div className="mt-4 lg:w-[829px]">
                        <HostCard />
                      </div>
                    </section>
                  </div>
                </div>
                {property.checkInTime && (
                  <div>
                    <hr className="h-px border-0 bg-[#D9D9D9]" />
                    <section id="house-rules" className="scroll-mt-36">
                      <h1 className="text-lg font-bold">House rules</h1>
                      {property.checkInTime && property.checkOutTime && (
                        <div className="my-2 flex items-center justify-start gap-16">
                          <div className="flex items-center">
                            <ArrowLeftToLineIcon className="mr-2" />{" "}
                            <div>
                              <div className="font-semibold">Check-in time</div>
                              <div>
                                After {property.checkInTime.substring(0, 5)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <ArrowRightToLineIcon className="mr-2" />{" "}
                            <div>
                              <div className="font-semibold">
                                Check-out time
                              </div>
                              <div>
                                Before {property.checkOutTime.substring(0, 5)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {property.checkInInfo && (
                        <div className="pt-6">
                          <h1 className="text-md font-bold">
                            Additional information
                          </h1>
                          <p>{property.checkInInfo}</p>
                        </div>
                      )}
                    </section>
                  </div>
                )}
                {/* <ShareOfferDialog
        id={offer.id}
        isRequest={false}
        propertyName={property.name}
      /> */}
              </div>

              <div className="flex min-h-[2000px] flex-1">
                {/* Wrapping right column */}
                <div className="sticky top-28 grid max-h-[1000px] grid-cols-1 overflow-y-auto">
                  <Card className="h-[620px] max-w-[390px] drop-shadow-xl">
                    <div>
                      <div className="mb-8 ml-4 mt-2 flex flex-row items-baseline">
                        <div className="text-[20px] font-bold text-[#09090B]">
                          {formatCurrency(
                            offerNightlyPrice * numNights + tramonaServiceFee,
                          )}
                        </div>
                        <div className="text-[15px] font-semibold text-[#010101]">
                          &nbsp; Total
                        </div>
                      </div>
                      <div className="mx-2 grid grid-cols-2 gap-4 rounded-md border border-[#BEBEBE] p-4">
                        <div className="relative col-span-2 grid grid-cols-2">
                          <div className="col-span-1">
                            <div className="text-[11px] font-bold">
                              CHECK-IN
                            </div>
                            <div className="text-[15px]">
                              {formatShortDate(offer.checkIn)}
                            </div>
                          </div>
                          <div className="col-span-1 ml-4">
                            <div className="text-[11px] font-bold">
                              CHECK-OUT
                            </div>
                            <div className="text-[15px]">
                              {formatShortDate(offer.checkOut)}
                            </div>
                          </div>
                          <div className="absolute -bottom-4 -top-4 left-[50%] w-px bg-[#D9D9D9]"></div>
                          <div className="absolute -left-4 -right-4 top-14 h-px bg-[#D9D9D9]"></div>
                        </div>
                        <div className="col-span-2 pt-4">
                          <div className="text-[11px] font-bold">GUESTS</div>
                          <div className="text-[15px]">
                            {plural(request.numGuests, "Guest")}
                          </div>
                        </div>
                      </div>

                      {/* add width to book now button */}
                      <div className="my-4 flex justify-center">
                        {status === "authenticated" ? (
                          <HowToBookDialog
                            isBooked={isBooked}
                            listingId={offer.id}
                            propertyName={property.name}
                            originalNightlyPrice={property.originalNightlyPrice}
                            airbnbUrl={property.airbnbUrl ?? ""}
                            checkIn={offer.checkIn}
                            checkOut={offer.checkOut}
                            requestId={request?.id}
                            offer={{ property, request, ...offer }}
                            totalPrice={offer.totalPrice}
                            offerNightlyPrice={offerNightlyPrice}
                            isAirbnb={isAirbnb}
                          >
                            {isBooked ? (
                              <>
                                <CheckIcon className="size-5" />
                                Booked
                              </>
                            ) : (
                              <>
                                <Button
                                  className="mx-2 w-full"
                                  size="lg"
                                  variant="greenPrimary"
                                  disabled={isBooked}
                                >
                                  Book Now
                                </Button>
                                {/* <Button
                      className="border border-[#004236]"
                      size="lg"
                      variant="outline"
                      disabled={isBooked}
                    >
                      Counter Offer
                    </Button> */}
                              </>
                            )}
                          </HowToBookDialog>
                        ) : (
                          <Button
                            onClick={() => {
                              void router.push({
                                pathname: "/auth/signin",
                                query: { from: `/public-offer/${offer.id}` },
                              });
                            }}
                            variant="greenPrimary"
                            className="mx-2 w-full"
                          >
                            Log in to Book
                          </Button>
                        )}
                      </div>

                      <div className="flex justify-center text-[14px] text-[#393939]">
                        Total incl. taxes. You will not be charged yet
                      </div>
                    </div>
                    <div className="space-y-4 py-0 text-muted-foreground">
                      <div className="text-[16px] text-black">
                        <div className="flex justify-between py-2">
                          <p className="underline">
                            {formatCurrency(offerNightlyPrice)} &times;{" "}
                            {plural(numNights, "night")}
                          </p>
                          <p className="ms-1">
                            {formatCurrency(offerNightlyPrice * numNights)}
                          </p>
                        </div>
                        <div className="flex justify-between py-2">
                          <p className="underline">Cleaning fee</p>
                          <p className="">Included</p>
                        </div>
                        <div className="flex justify-between py-2">
                          <p className="underline">Tramona service fee</p>
                          <p className="">
                            {formatCurrency(tramonaServiceFee)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr className="h-px bg-[#D9D9D9] py-0" />

                    <div className="flex w-full flex-col">
                      <p className="mb-4 text-2xl font-bold">
                        Price comparison
                      </p>

                      <div className="relative w-full rounded-lg border border-[#BEBEBE] px-2">
                        <div className="grid h-[39px] grid-cols-2">
                          <div className="col-span-1 flex items-center justify-between pr-4">
                            <div className="text-[14px]">Tramona price</div>
                            <div className="text-[16px] font-bold">
                              {formatCurrency(offerNightlyPrice)}
                            </div>
                          </div>
                          <div className="col-span-1 flex items-center justify-between pl-4">
                            <div className="text-[14px]">Airbnb price</div>
                            <div className="text-[16px] font-bold">
                              {formatCurrency(originalTotal / numNights)}
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-1/2 top-0 w-px bg-[#e2e1e1]"></div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="w-full rounded-full py-2 md:rounded-3xl lg:rounded-full">
                    <div>
                      <p className="text-sm text-gray-600">Tramona price</p>
                      <p className="flex items-center font-bold">
                        {formatCurrency(offerNightlyPrice)}
                        <span className="ml-2 font-normal text-gray-500 line-through">
                          {formatCurrency(originalTotal / numNights)}
                        </span>
                        <span className="ml-2 font-normal text-gray-500">
                          (Airbnb)
                        </span>
                      </p>
                    </div>
                  </div> */}
                  </Card>

                  {/* Tramona exclusive price */}
                  <div className="-mt-8 flex max-h-[79px] max-w-[395px] flex-row space-x-2 rounded-md border-[1.5px] border-[#802400] py-2 pl-3 pr-12">
                    <div className="-mt-2 mr-2 flex w-[40px] items-center justify-center">
                      <FireIcon />
                    </div>
                    <div className="">
                      <h4 className="pb-1 text-[14px] font-bold text-[#802400]">
                        Tramona exclusive deal
                      </h4>
                      <p className="text-[12px] text-[#222222]">
                        This is an exclusive offer created just for you, you
                        will not be able to find this price anywhere else.
                      </p>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="-mt-10 flex max-h-[170px] max-w-[395px] flex-row space-x-2 rounded-md border-[1.5px] border-[#004236] py-2">
                    <div>
                      <div className="">
                        <div className="ml-8 mr-12">
                          <h4 className="pb-1 text-[14px] font-bold text-[#004236]">
                            Important Notes
                          </h4>
                          <div className="flex flex-col text-[10px] text-[#222222]">
                            <p>
                              These dates could get booked on other platforms
                              like Airbnb, or Vrbo for full price. If they do,
                              your match will be automatically withdrawn
                            </p>
                            <br />
                            <p>
                              After 24 hours, this match will become available
                              for the public to book
                            </p>
                            <br />
                          </div>
                        </div>
                        <p className="mt-2 flex justify-center text-center text-[10px] font-extrabold text-black">
                          We encourage you to book within 24 for best results
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* house rules section */}
            <section className="max-w-7xl">
              <div className="mt-10">
                <hr className="mb-10 h-px border-0 bg-[#D9D9D9]" />
                <HouseRules />
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="max-w-full">
          <div className="relative mt-4 grid h-[220px] max-w-full grid-cols-4 grid-rows-2 gap-5 overflow-clip rounded-xl bg-black">
            <Dialog>
              <div>
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
              <DialogContent className="max-w-screen flex items-center justify-center bg-transparent">
                <div className="screen-full flex justify-center">
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
                  <DialogTrigger asChild>
                    <Button variant="white" className="rounded-full">
                      <ImagesIcon />
                      See all {property.imageUrls.length} photos
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-full">
                    <DialogHeader>
                      <DialogTitle>More Photos</DialogTitle>
                    </DialogHeader>
                    {/* //dialog within a dialog */}
                    <Dialog>
                      <div className="grid-row-4 grid grid-cols-2 gap-2 rounded-xl">
                        {property.imageUrls.map((imageUrl, index) => (
                          <DialogTrigger
                            key={index}
                            className={`hover:opacity-90 ${
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
                      <DialogContent className="max-w-screen flex items-center justify-center bg-transparent">
                        <div className="screen-full flex justify-center">
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

          <div className="mt-8 flex h-[42px] w-full items-center justify-center rounded-md bg-[#134E4A] text-[16px] text-[#FFFFFF]">
            23% off Airbnb Price
          </div>

          <div className="mt-6 flex w-full flex-col">
            <div className="flex flex-col">
              <div className="mb-4 w-full flex-col md:flex-row md:items-start">
                <div className="space-y-2">
                  <div className="flex flex-row items-center">
                    <h1 className="items-center text-[24px] font-semibold">
                      {property.name}
                    </h1>
                  </div>
                  {/* Need data for this */}
                  <div className="flex flex-row items-center text-[14px]">
                    <div>Home in Los Angeles, California</div>
                  </div>
                  <div className="text-[14px] font-medium">
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
                  <div className="flex flex-row items-center text-[14px]">
                    <Star className="mr-1 h-3 w-3 fill-[#004236] text-[#004236]" />
                    <div>4.9</div>&nbsp; &nbsp;
                    <button>
                      <u>117 Reviews</u>
                    </button>
                  </div>
                </div>
              </div>

              <hr className="h-px border-0 bg-[#D9D9D9]" />

              <div className="mt-4 flex flex-col-reverse gap-4 md:flex-row md:items-start">
                <div className="flex-[2] space-y-6">
                  <section>
                    <div className="-mb-1 flex items-center gap-2">
                      <div className="mt-2">
                        <UserAvatar
                          name={hostName}
                          email={property.host?.email}
                          image={property.host?.image}
                        />
                      </div>
                      <div className="-space-y-1.5">
                        <div className="-mb-3 flex flex-row items-center space-x-32">
                          <p className="text-[14px] text-muted-foreground">
                            Hosted by
                          </p>
                          <div className="flex justify-end py-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="h-[23px] w-[107px] rounded-md bg-[#FF0000] text-[8px] text-[#FFFFFF] hover:bg-[#CC0000]">
                                  View Property on Airbnb
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-full">
                                {/* <DialogHeader>
                            <DialogTitle>Amenities</DialogTitle>
                          </DialogHeader> */}
                                <div className="max-h-96 overflow-y-auto">
                                  <div className="flex flex-col space-y-10">
                                    <div className="flex justify-center p-2 text-[20px]">
                                      Remember: When comparing prices, Airbnb
                                      hides the final price until the last step.
                                      Our price is always the final, all in
                                      price.
                                    </div>
                                    <div className="flex flex-col items-center justify-center space-y-4 pb-12">
                                      <Button className="h-[34px] w-[150px] rounded-md bg-[#FF0000] text-[12px] text-[#FFFFFF] hover:bg-[#CC0000]">
                                        See Pricing on Airbnb
                                      </Button>
                                      <Button className="h-[34px] w-[150px] rounded-md bg-[#FF0000] text-[12px] text-[#FFFFFF] hover:bg-[#CC0000]">
                                        See Property on Airbnb
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        <p className="text-[16px] font-medium">{hostName}</p>
                      </div>
                    </div>
                  </section>

                  <hr className="h-px border-0 bg-[#D9D9D9]" />

                  {/* Tramona exclusive price */}
                  <section className="">
                    <div className="-mb-2 -mt-2 flex max-h-[100px] max-w-full flex-row space-x-2 rounded-md pl-3 pr-10">
                      <div className="-mt-2 mr-2 flex w-[40px] items-center justify-center">
                        <FireIcon />
                      </div>
                      <div className="">
                        <h4 className="pb-1 text-[14px] font-bold text-[#802400]">
                          Tramona exclusive deal
                        </h4>
                        <p className="text-[12px] text-[#222222]">
                          This is an exclusive offer created just for you, you
                          will not be able to find this price anywhere else.
                        </p>
                      </div>
                    </div>
                  </section>

                  <hr className="h-px border-0 bg-[#D9D9D9]" />

                  <section id="overview" className="scroll-mt-36">
                    <div className="z-20 -mt-4 py-2 text-zinc-700">
                      <div className="line-clamp-5 max-h-[168px] overflow-hidden text-ellipsis break-words text-[14px]">
                        {property.about}
                      </div>
                      <div className="-mb-4 mt-2 flex justify-start">
                        <Dialog>
                          <DialogTrigger className="inline-flex items-center justify-center text-[14px] text-foreground underline underline-offset-2">
                            Show more
                            <ChevronDown className="ml-1 size-4" />
                          </DialogTrigger>

                          <DialogContent className="w-full p-8">
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

                  <hr className="h-px border-0 bg-[#D9D9D9]" />

                  {/* need to make this part dynamic */}
                  <section id="rooms&beds" className="scroll-mt-36">
                    <h1 className="-mb-4 text-[18px] font-bold">
                      Rooms & Beds
                    </h1>
                    <div className="-mb-2 flex w-full max-w-[350px] justify-center">
                      <div className="mt-4 overflow-x-auto">
                        <div className="mt-4 flex w-max flex-row space-x-2 pb-4">
                          <div className="flex h-[120px] w-[111px] flex-shrink-0 flex-col justify-center space-y-3 rounded-xl border border-[#DDDDDD] p-2">
                            <BedDouble className="size-5" />
                            <div className="text-[16px] font-bold">
                              Bedroom 1
                            </div>
                            <div className="text-[14px] text-[#606161]">
                              1 King bed
                            </div>
                          </div>
                          <div className="flex h-[120px] w-[111px] flex-shrink-0 flex-col justify-center space-y-3 rounded-xl border border-[#DDDDDD] p-2">
                            <div className="mt-1 flex flex-row">
                              <BedSingle className="size-4" />
                              <BedSingle className="-ml-[2px] size-4" />
                            </div>
                            <div className="text-[16px] font-bold">
                              Bedroom 2
                            </div>
                            <div className="text-[14px] text-[#606161]">
                              1 Twin bed
                            </div>
                          </div>
                          <div className="flex h-[120px] w-[111px] flex-shrink-0 flex-col justify-center space-y-3 rounded-xl border border-[#DDDDDD] p-2">
                            <div className="mt-1 flex flex-row">
                              <BedSingle className="size-4" />
                              <BedSingle className="-ml-[2px] size-4" />
                            </div>
                            <div className="text-[16px] font-bold">
                              Bedroom 3
                            </div>
                            <div className="text-[14px] text-[#606161]">
                              1 Twin bed
                            </div>
                          </div>
                          <div className="flex h-[120px] w-[111px] flex-shrink-0 flex-col justify-center space-y-3 rounded-xl border border-[#DDDDDD] p-2">
                            <div className="mt-1 flex flex-row">
                              <BedSingle className="size-4" />
                              <BedSingle className="-ml-[2px] size-4" />
                            </div>
                            <div className="text-[16px] font-bold">
                              Bedroom 4
                            </div>
                            <div className="text-[14px] text-[#606161]">
                              1 Twin bed
                            </div>
                          </div>
                          <div className="flex h-[120px] w-[111px] flex-shrink-0 flex-col justify-center space-y-3 rounded-xl border border-[#DDDDDD] p-2">
                            <div className="mt-1 flex flex-row">
                              <BedSingle className="size-4" />
                              <BedSingle className="-ml-[2px] size-4" />
                            </div>
                            <div className="text-[16px] font-bold">
                              Bedroom 5
                            </div>
                            <div className="text-[14px] text-[#606161]">
                              1 Twin bed
                            </div>
                          </div>
                          <div className="flex h-[120px] w-[111px] flex-shrink-0 flex-col justify-center space-y-3 rounded-xl border border-[#DDDDDD] p-2">
                            <div className="mt-1 flex flex-row">
                              <BedSingle className="size-4" />
                              <BedSingle className="-ml-[2px] size-4" />
                            </div>
                            <div className="text-[16px] font-bold">
                              Bedroom 6
                            </div>
                            <div className="text-[14px] text-[#606161]">
                              1 Twin bed
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <hr className="h-px border-0 bg-[#D9D9D9]" />

                  <section id="amenities" className="scroll-mt-36">
                    <h1 className="text-[18px] font-bold">Amenities</h1>
                    <PropertyAmenities amenities={property.amenities} />

                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-[#006F80] hover:opacity-80 sm:w-auto">
                          <u>Show more</u>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="w-full">
                        <DialogHeader>
                          <DialogTitle>Amenities</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-96 overflow-y-auto">
                          <AmenitiesComponent
                            propertyAmenities={property.amenities}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </section>

                  <hr className="h-px border-0 bg-[#D9D9D9]" />

                  {/* map section */}
                  <section>
                    <div className="mb-6 mt-4">
                      <div className="h-auto w-full space-y-4">
                        <h2 className="text-[18px] font-bold">
                          Where you'll be
                        </h2>
                        <div>
                          <SingleLocationMap
                            key={`${lat}-${lng}`} // Unique key to force re-render
                            lat={lat}
                            lng={lng}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <hr className="h-px border-0 bg-[#D9D9D9]" />

                  {/* guest reviews section */}
                  <section>
                    <div className="mt-2">
                      <GuestReviews />
                    </div>
                  </section>
                  {/* host card section */}

                  <hr className="h-px border-0 bg-[#D9D9D9]" />

                  <section>
                    <div className="-mb-4 mt-4">
                      <HostCard />
                    </div>
                  </section>
                </div>
              </div>
              {property.checkInTime && (
                <div>
                  <hr className="h-px border-0 bg-[#D9D9D9]" />
                  <section id="house-rules" className="scroll-mt-36">
                    <h1 className="text-lg font-bold">House rules</h1>
                    {property.checkInTime && property.checkOutTime && (
                      <div className="my-2 flex items-center justify-start gap-16">
                        <div className="flex items-center">
                          <ArrowLeftToLineIcon className="mr-2" />{" "}
                          <div>
                            <div className="font-semibold">Check-in time</div>
                            <div>
                              After {property.checkInTime.substring(0, 5)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <ArrowRightToLineIcon className="mr-2" />{" "}
                          <div>
                            <div className="font-semibold">Check-out time</div>
                            <div>
                              Before {property.checkOutTime.substring(0, 5)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {property.checkInInfo && (
                      <div className="pt-6">
                        <h1 className="text-md font-bold">
                          Additional information
                        </h1>
                        <p>{property.checkInInfo}</p>
                      </div>
                    )}
                  </section>
                </div>
              )}
              {/* <ShareOfferDialog
        id={offer.id}
        isRequest={false}
        propertyName={property.name}
      /> */}
            </div>

            {/* 
              <div className="flex min-h-[2000px] flex-1">
                {/* Wrapping right column
                <div className="sticky top-28 grid max-h-[1000px] grid-cols-1 overflow-y-auto">
                  <Card className="h-[620px] max-w-[390px] drop-shadow-xl">
                    <div>
                      <div className="mb-8 ml-4 mt-2 flex flex-row items-baseline">
                        <div className="text-[20px] font-bold text-[#09090B]">
                          {formatCurrency(
                            offerNightlyPrice * numNights + tramonaServiceFee,
                          )}
                        </div>
                        <div className="text-[15px] font-semibold text-[#010101]">
                          &nbsp; Total
                        </div>
                      </div>
                      <div className="mx-2 grid grid-cols-2 gap-4 rounded-md border border-[#BEBEBE] p-4">
                        <div className="relative col-span-2 grid grid-cols-2">
                          <div className="col-span-1">
                            <div className="text-[11px] font-bold">
                              CHECK-IN
                            </div>
                            <div className="text-[15px]">
                              {formatShortDate(offer.checkIn)}
                            </div>
                          </div>
                          <div className="col-span-1 ml-4">
                            <div className="text-[11px] font-bold">
                              CHECK-OUT
                            </div>
                            <div className="text-[15px]">
                              {formatShortDate(offer.checkOut)}
                            </div>
                          </div>
                          <div className="absolute -bottom-4 -top-4 left-[50%] w-px bg-[#D9D9D9]"></div>
                          <div className="absolute -left-4 -right-4 top-14 h-px bg-[#D9D9D9]"></div>
                        </div>
                        <div className="col-span-2 pt-4">
                          <div className="text-[11px] font-bold">GUESTS</div>
                          <div className="text-[15px]">
                            {plural(request.numGuests, "Guest")}
                          </div>
                        </div>
                      </div>

                      {/* add width to book now button */}
            {/* <div className="my-4 flex justify-center">
                        {status === "authenticated" ? (
                          <HowToBookDialog
                            isBooked={isBooked}
                            listingId={offer.id}
                            propertyName={property.name}
                            originalNightlyPrice={property.originalNightlyPrice}
                            airbnbUrl={property.airbnbUrl ?? ""}
                            checkIn={offer.checkIn}
                            checkOut={offer.checkOut}
                            requestId={request?.id}
                            offer={{ property, request, ...offer }}
                            totalPrice={offer.totalPrice}
                            offerNightlyPrice={offerNightlyPrice}
                            isAirbnb={isAirbnb}
                          >
                            {isBooked ? (
                              <>
                                <CheckIcon className="size-5" />
                                Booked
                              </>
                            ) : (
                              <>
                                <Button
                                  className="mx-2 w-full"
                                  size="lg"
                                  variant="greenPrimary"
                                  disabled={isBooked}
                                >
                                  Book Now
                                </Button> */}
            {/* <Button
                      className="border border-[#004236]"
                      size="lg"
                      variant="outline"
                      disabled={isBooked}
                    >
                      Counter Offer
                    </Button> */}
            {/* </>
                            )}
                          </HowToBookDialog>
                        ) : (
                          <Button
                            onClick={() => {
                              void router.push({
                                pathname: "/auth/signin",
                                query: { from: `/public-offer/${offer.id}` },
                              });
                            }}
                            variant="greenPrimary"
                            className="mx-2 w-full"
                          >
                            Log in to Book
                          </Button>
                        )}
                      </div>

                      <div className="flex justify-center text-[14px] text-[#393939]">
                        Total incl. taxes. You will not be charged yet
                      </div>
                    </div>
                    <div className="space-y-4 py-0 text-muted-foreground">
                      <div className="text-[16px] text-black">
                        <div className="flex justify-between py-2">
                          <p className="underline">
                            {formatCurrency(offerNightlyPrice)} &times;{" "}
                            {plural(numNights, "night")}
                          </p>
                          <p className="ms-1">
                            {formatCurrency(offerNightlyPrice * numNights)}
                          </p>
                        </div>
                        <div className="flex justify-between py-2">
                          <p className="underline">Cleaning fee</p>
                          <p className="">Included</p>
                        </div>
                        <div className="flex justify-between py-2">
                          <p className="underline">Tramona service fee</p>
                          <p className="">
                            {formatCurrency(tramonaServiceFee)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr className="h-px bg-[#D9D9D9] py-0" />

                    <div className="flex w-full flex-col">
                      <p className="mb-4 text-2xl font-bold">
                        Price comparison
                      </p>

                      <div className="relative w-full rounded-lg border border-[#BEBEBE] px-2">
                        <div className="grid h-[39px] grid-cols-2">
                          <div className="col-span-1 flex items-center justify-between pr-4">
                            <div className="text-[14px]">Tramona price</div>
                            <div className="text-[16px] font-bold">
                              {formatCurrency(offerNightlyPrice)}
                            </div>
                          </div>
                          <div className="col-span-1 flex items-center justify-between pl-4 ">
                            <div className="text-[14px]">Airbnb price</div>
                            <div className="text-[16px] font-bold">
                              {formatCurrency(originalTotal / numNights)}
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-1/2 top-0 w-px bg-[#e2e1e1]"></div>
                        </div>
                      </div>
                    </div> */}

            {/* <div className="w-full rounded-full py-2 md:rounded-3xl lg:rounded-full">
                    <div>
                      <p className="text-sm text-gray-600">Tramona price</p>
                      <p className="flex items-center font-bold">
                        {formatCurrency(offerNightlyPrice)}
                        <span className="ml-2 font-normal text-gray-500 line-through">
                          {formatCurrency(originalTotal / numNights)}
                        </span>
                        <span className="ml-2 font-normal text-gray-500">
                          (Airbnb)
                        </span>
                      </p>
                    </div>
                  </div> */}
            {/* </Card> */}

            {/* Tramona exclusive price */}
            {/* <div className="-mt-8 flex max-h-[79px] max-w-[395px] flex-row space-x-2 rounded-md border-[1.5px] border-[#802400] py-2 pl-3 pr-12">
                    <div className="-mt-2 mr-2 flex w-[40px] items-center justify-center">
                      <FireIcon />
                    </div>
                    <div className="">
                      <h4 className="pb-1 text-[14px] font-bold text-[#802400]">
                        Tramona exclusive deal
                      </h4>
                      <p className="text-[12px] text-[#222222]">
                        This is an exclusive offer created just for you, you
                        will not be able to find this price anywhere else.
                      </p>
                    </div>
                  </div>

                  {/* Important Notes */}
            {/* <div className="-mt-10 flex max-h-[170px] max-w-[395px] flex-row space-x-2 rounded-md border-[1.5px] border-[#004236] py-2">
                    <div>
                      <div className="">
                        <div className="ml-8 mr-12">
                          <h4 className="pb-1 text-[14px] font-bold text-[#004236]">
                            Important Notes
                          </h4>
                          <div className="flex flex-col text-[10px] text-[#222222]">
                            <p>
                              These dates could get booked on other platforms
                              like Airbnb, or Vrbo for full price. If they do,
                              your match will be automatically withdrawn
                            </p>
                            <br />
                            <p>
                              After 24 hours, this match will become available
                              for the public to book
                            </p>
                            <br />
                          </div>
                        </div>
                        <p className="mt-2 flex justify-center text-center text-[10px] font-extrabold text-black">
                          We encourage you to book within 24 for best results
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

            <hr className="mt-10 h-px border-0 bg-[#D9D9D9]" />
            {/* house rules section */}
            <section className="max-w-full">
              <div className="">
                <MobileHouseRules />
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
