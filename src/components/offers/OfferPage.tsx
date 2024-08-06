import { useEffect, useRef, useState } from "react";
import UserAvatar from "@/components/_common/UserAvatar";
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/_common/ReviewCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type RouterOutputs } from "@/utils/api";
import { formatDateWeekMonthDay, plural } from "@/utils/utils";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  ImagesIcon,
  ChevronRight,
  StarIcon,
  BedDoubleIcon,
  InfoIcon,
  ExternalLinkIcon,
  FlameIcon,
  ArrowRightIcon,
  BookCheckIcon,
} from "lucide-react";
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import OfferPhotos from "./OfferPhotos";
import AmenitiesComponent from "./CategorizedAmenities";
import PropertyAmenities from "./PropertyAmenities";
import ShareOfferDialog from "../_common/ShareLink/ShareOfferDialog";
import { Card, CardContent } from "../ui/card";
import { getOriginalListing } from "@/utils/listing-sites";
import { PropertyCompareBtn } from "./PropertyCompareBtn";
import SingleLocationMap from "../_common/GoogleMaps/SingleLocationMap";
import Link from "next/link";
import {
  CheckInTimeRule,
  CheckOutTimeRule,
  PetsRule,
  SmokingRule,
} from "./HouseRules";
import { OfferPriceDetails } from "../_common/OfferPriceDetails";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";

export type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];

export default function OfferPage({
  offer: { property, request, ...offer },
}: {
  offer: OfferWithDetails;
}) {
  const isBooked = !!offer.acceptedAt;

  const aboutRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const aboutElement = aboutRef.current;
    if (aboutElement) {
      setIsOverflowing(aboutElement.scrollHeight > aboutElement.clientHeight);
    }
  }, []);

  const hostName = property.host?.name ?? property.hostName;

  const originalListing = getOriginalListing(property);

  const renderSeeMoreButton = property.imageUrls.length > 5;

  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const firstImageUrl = property.imageUrls[0]!;
  return (
    <div>
      <div className="relative mt-4 grid min-h-[400px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl">
        <Dialog>
          <DialogTrigger
            key={0}
            onClick={() => setSelectedImageIdx(0)}
            className="hover:opacity-90 sm:hidden"
          >
            <Image src={firstImageUrl} alt="" fill objectFit="cover" />
          </DialogTrigger>
          <div className="hidden sm:contents">
            {property.imageUrls.slice(0, 5).map((imageUrl, index) => (
              <div
                key={index}
                className={`relative col-span-1 row-span-1 ${
                  index === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <DialogTrigger
                  onClick={() => setSelectedImageIdx(index)}
                  className="hover:opacity-90"
                >
                  <Image src={imageUrl} alt="" fill objectFit="cover" />
                </DialogTrigger>
              </div>
            ))}
          </div>
          <DialogContent className="max-w-screen flex items-center justify-center bg-transparent">
            <div className="screen-full flex justify-center">
              <OfferPhotos
                propertyImages={property.imageUrls}
                indexOfSelectedImage={selectedImageIdx}
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
                          onClick={() => setSelectedImageIdx(index)}
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
                        indexOfSelectedImage={selectedImageIdx}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="relative flex gap-8 pt-4">
        <div className="min-w-0 flex-1 space-y-4">
          <section>
            <h1 className="flex-1 text-3xl font-semibold sm:text-4xl">
              {property.name}
            </h1>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <p className="gap flex flex-wrap items-center gap-x-1 pt-1 text-sm font-medium">
                  {property.propertyType} in {property.city} ·{" "}
                  <StarIcon className="inline size-[1em] fill-primaryGreen stroke-primaryGreen" />{" "}
                  {property.avgRating}{" "}
                  <a href="#reviews" className="underline">
                    ({plural(property.numRatings, "review")})
                  </a>
                </p>
                <p className="text-sm font-medium">
                  {plural(property.maxNumGuests, "guest")} ·{" "}
                  {plural(property.numBedrooms, "bedroom")} ·{" "}
                  {plural(property.numBeds, "bed")}
                  {property.numBathrooms && (
                    <> · {plural(property.numBathrooms, "bath")}</>
                  )}
                </p>
              </div>
              {originalListing && (
                <div className="self-end">
                  <PropertyCompareBtn
                    checkIn={offer.checkIn}
                    checkOut={offer.checkOut}
                    numGuests={request?.numGuests ?? 1}
                    originalListing={originalListing}
                  />
                </div>
              )}
            </div>
          </section>

          <section className="border-t pt-4">
            <div className="flex items-center gap-2">
              <UserAvatar
                name={hostName}
                email={property.host?.email}
                image={property.host?.image}
              />
              <div className="-space-y-1">
                <p className="text-sm text-muted-foreground">Hosted by</p>
                <p className="text-lg font-medium">{hostName}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="subheading border-t pb-2 pt-4">
              About this property
            </h2>
            <div className="z-20 max-w-2xl text-zinc-700">
              <div ref={aboutRef} className="line-clamp-5 break-words">
                {property.about}
              </div>
              {isOverflowing && (
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
              )}
            </div>
          </section>

          {property.roomsWithBeds && (
            <section>
              <h2 className="subheading border-t pb-2 pt-4">Rooms & Beds</h2>
              <div className="flex gap-4 overflow-x-auto">
                {property.roomsWithBeds.map((room, index) => (
                  <div
                    key={index}
                    className="flex min-w-56 flex-col items-center gap-4 whitespace-pre rounded-lg border p-4"
                  >
                    <BedDoubleIcon />
                    <p className="text-lg font-semibold">{room.name}</p>
                    <p className="text-center text-sm text-muted-foreground">
                      {room.beds
                        .map((bed) => plural(bed.count, bed.type))
                        .join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="subheading border-t pb-2 pt-4">Amenitites</h2>
            <PropertyAmenities amenities={property.amenities} />

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full sm:w-auto">
                  Show all amenities
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Amenities</DialogTitle>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto">
                  <AmenitiesComponent propertyAmenities={property.amenities} />
                </div>
              </DialogContent>
            </Dialog>
          </section>

          {property.latitude && property.longitude && (
            <section>
              <h2 className="subheading border-t pb-2 pt-4">
                Where you&apos;ll be
              </h2>
              <div className="relative mt-4 h-[400px]">
                <div className="absolute inset-0 z-0 overflow-hidden rounded-xl border">
                  <SingleLocationMap
                    lat={property.latitude}
                    lng={property.longitude}
                  />
                </div>
              </div>
            </section>
          )}

          <section>
            <div className="flex items-start justify-between border-t pb-2 pt-4">
              <div>
                <h2 className="subheading">Guest Reviews</h2>
                <div className="flex items-center gap-2 pb-4">
                  <StarIcon className="inline size-[1em] fill-primaryGreen stroke-primaryGreen" />{" "}
                  {property.avgRating} · {plural(property.numRatings, "review")}
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              {property.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            {originalListing && (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-semibold text-teal-700 underline underline-offset-2"
                href={originalListing.getReviewsUrl({
                  checkIn: offer.checkIn,
                  checkOut: offer.checkOut,
                  numGuests: request?.numGuests ?? 1,
                })}
              >
                See all reviews
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            )}
          </section>

          {property.hostNumReviews && property.hostRating && (
            <section>
              <h2 className="subheading border-t pb-2 pt-4">Meet your host</h2>
              <Card className="mt-4 max-w-sm p-8">
                <CardContent className="flex items-center justify-between sm:p-6">
                  <div className="space-y-4">
                    <UserAvatar
                      size="huge"
                      name={hostName}
                      image={property.host?.image}
                    />
                    <p className="text-center text-lg font-bold">{hostName}</p>
                  </div>
                  <div className="divide-y *:p-2">
                    <div>
                      <p className="text-center text-lg font-bold">
                        {property.hostNumReviews}
                      </p>
                      <p className="text-center">Reviews</p>
                    </div>
                    <div>
                      <p className="text-center text-lg font-bold">
                        {property.hostRating}
                      </p>
                      <p className="text-center">Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          <section>
            <h2 className="subheading border-t pb-2 pt-4">House rules</h2>
            <div className="overflow-x-auto">
              <div className="flex gap-4">
                {property.checkInTime !== null && (
                  <CheckInTimeRule checkInTime={property.checkInTime} />
                )}
                {property.checkOutTime !== null && (
                  <CheckOutTimeRule checkOutTime={property.checkOutTime} />
                )}
                {property.petsAllowed !== null && (
                  <PetsRule petsAllowed={property.petsAllowed} />
                )}
                {property.smokingAllowed !== null && (
                  <SmokingRule smokingAllowed={property.smokingAllowed} />
                )}
              </div>
            </div>
            {property.cancellationPolicy !== null && (
              <>
                <h3 className="pb-2 pt-4 font-bold">Cancellation Policy</h3>
                <p>
                  {getCancellationPolicyDescription(
                    property.cancellationPolicy,
                  )}
                </p>
              </>
            )}
          </section>

          <section>
            <h2 className="subheading border-t pb-2 pt-4">
              Check-in information
            </h2>
            <p>
              {property.checkInInfo === "self"
                ? "Self check-in"
                : property.checkInInfo}
            </p>
          </section>

          <div className="flex justify-end">
            <ShareOfferDialog
              id={offer.id}
              isRequest={false}
              propertyName={property.name}
            />
          </div>
        </div>

        <div className="hidden w-96 shrink-0 lg:block">
          <div className="sticky top-[calc(var(--header-height)+1rem)] space-y-4">
            <Card>
              <CardContent className="space-y-4">
                {request && (
                  <div className="grid grid-cols-2 rounded-lg border *:px-4 *:py-2">
                    <div className="border-r">
                      <p className="text-xs font-bold uppercase text-muted-foreground">
                        Check-in
                      </p>
                      <p className="font-bold">
                        {formatDateWeekMonthDay(offer.checkIn)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground">
                        Check-out
                      </p>
                      <p className="font-bold">
                        {formatDateWeekMonthDay(offer.checkOut)}
                      </p>
                    </div>
                    <div className="col-span-full border-t">
                      <p className="text-xs font-bold uppercase text-muted-foreground">
                        Guests
                      </p>
                      <p className="font-bold">
                        {plural(request.numGuests, "guest")}
                      </p>
                    </div>
                  </div>
                )}
                <Button
                  asChild={!isBooked}
                  variant="greenPrimary"
                  size="lg"
                  className="w-full"
                  disabled={isBooked}
                >
                  {isBooked ? (
                    <>
                      <BookCheckIcon className="size-5" />
                      Booked
                    </>
                  ) : (
                    <Link href={`/offer-checkout/${offer.id}`}>
                      Book now
                      <ArrowRightIcon className="size-5" />
                    </Link>
                  )}
                </Button>
                <OfferPriceDetails offer={offer} />
              </CardContent>
            </Card>
            <div className="flex gap-2 rounded-xl border border-orange-300 bg-orange-50 p-3 text-orange-800">
              <FlameIcon className="size-7 shrink-0" />
              <div>
                <p className="text-sm font-bold">Tramona exclusive deal</p>
                <p className="text-xs">
                  This is an exclusive offer created just for you &ndash; you
                  will not be able to find this price anywhere else
                </p>
              </div>
            </div>
            <div className="flex gap-2 rounded-xl border border-blue-300 bg-blue-50 p-3 text-blue-800">
              <InfoIcon className="size-7 shrink-0" />
              <div>
                <p className="text-sm font-bold">Important Notes</p>
                <p className="text-xs">
                  These dates could get booked on other platforms for full
                  price. If they do, your match will be automatically withdrawn.
                  <br />
                  <br />
                  After 24 hours, this match will become available for the
                  public to book.
                  <br />
                  <br />
                  <b>
                    We encourage you to book within 24 hours for best results.
                  </b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
