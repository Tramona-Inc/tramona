import { useEffect, useRef, useState } from "react";
import UserAvatar from "@/components/_common/UserAvatar";
import { Button, ButtonProps } from "@/components/ui/button";
import ReviewCard from "@/components/_common/ReviewCard";
import {
  DialogNoDrawer,
  DialogContentNoDrawer,
  DialogTriggerNoDrawer,
} from "@/components/ui/dialog-no-drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api, type RouterOutputs } from "@/utils/api";
import {
  formatDateRange,
  formatDateWeekMonthDay,
  getOfferDiscountPercentage,
  plural,
} from "@/utils/utils";
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
  CheckIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";
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
import PriceDetailsBeforeTax from "@/components/_common/PriceDetailsBeforeTax";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import { VerificationProvider } from "../_utils/VerificationContext";
import IdentityModal from "../_utils/IdentityModal";
import { Property } from "@/server/db/schema";
import ChatOfferButton from "./ChatOfferButton";
import { Airbnb } from "@/utils/listing-sites/Airbnb";
import { createUserNameAndPic } from "../activity-feed/admin/generationHelper";
import ReasonsToBook from "./ReasonsToBook";

export type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];
export type PropertyPageData = RouterOutputs["properties"]["getById"];
//export type PropertyPageData = RouterOutputs["properties"]["getById"];

export default function PropertyPage({
  property,
  offer,
  sidebar,
  mobileBottomCard,
}: {
  property: PropertyPageData;
  offer?: OfferWithDetails;
  sidebar?: React.ReactNode;
  mobileBottomCard?: React.ReactNode;
}) {
  const aboutRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [reviewBackupImages, setReviewBackupImages] = useState<string[]>([]);
  const [openUserInfo, setOpenUserInfo] = useState(false);

  useEffect(() => {
    const aboutElement = aboutRef.current;
    if (aboutElement) {
      setIsOverflowing(aboutElement.scrollHeight > aboutElement.clientHeight);
    }
    async function createReviewBackupImages() {
      const backup = await createUserNameAndPic(property.reviews.length).then(
        (users) => users.map((user) => user.picture),
      );
      setReviewBackupImages(backup);
    }
    void createReviewBackupImages();
  }, [property.reviews.length]);

  const hostName = property.host
    ? `${property.host.firstName} ${property.host.lastName}`
    : "Tramona";

  const originalListing = getOriginalListing(property);

  console.log(property.originalListingPlatform, property.originalListingId);

  const renderSeeMoreButton = property.imageUrls.length > 5;

  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const firstImageUrl = property.imageUrls[0]!;

  const discountPercentage = offer ? getOfferDiscountPercentage(offer) : null;

  return (
    <div>
      <div className="relative grid h-[480px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl">
        <DialogNoDrawer>
          <DialogTriggerNoDrawer
            key={0}
            onClick={() => setSelectedImageIdx(0)}
            className="hover:opacity-90 sm:hidden"
          >
            <Image
              src={firstImageUrl}
              alt=""
              fill
              className="object-cover object-center"
            />
          </DialogTriggerNoDrawer>
          <div className="hidden sm:contents">
            {property.imageUrls.slice(0, 5).map((imageUrl, index) => (
              <div
                key={index}
                className={`relative col-span-1 row-span-1 ${
                  index === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <DialogTriggerNoDrawer
                  onClick={() => setSelectedImageIdx(index)}
                  className="hover:opacity-90"
                >
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    className="object-cover object-center"
                  />
                </DialogTriggerNoDrawer>
              </div>
            ))}
          </div>
          <DialogContentNoDrawer className="flex w-full items-center justify-center border-none bg-transparent [&>button]:hidden">
            <div className="screen-full flex justify-center">
              <OfferPhotos
                propertyImages={property.imageUrls}
                indexOfSelectedImage={selectedImageIdx}
              />
            </div>
          </DialogContentNoDrawer>
        </DialogNoDrawer>

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
                <DialogNoDrawer>
                  <div className="grid-row-4 grid min-h-[1000px] grid-cols-2 gap-2 rounded-xl">
                    {property.imageUrls.map((imageUrl, index) => (
                      <DialogTriggerNoDrawer
                        key={index}
                        className={`hover:opacity-90 ${
                          index === 0 || index % 3 === 0
                            ? "col-span-2 row-span-2"
                            : property.imageUrls.length - 1 === index &&
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
                              className="h-full w-full object-cover object-center"
                            />
                          </AspectRatio>
                        </div>
                      </DialogTriggerNoDrawer>
                    ))}
                  </div>
                  <DialogContentNoDrawer className="flex items-center justify-center border-none bg-transparent [&>button]:hidden">
                    <div className="screen-full flex justify-center">
                      <OfferPhotos
                        propertyImages={property.imageUrls}
                        indexOfSelectedImage={selectedImageIdx}
                      />
                    </div>
                  </DialogContentNoDrawer>
                </DialogNoDrawer>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="h-2" />

      {discountPercentage && (
        <div className="rounded-xl bg-primaryGreen py-4 text-center text-2xl font-semibold text-white">
          {discountPercentage}% off
        </div>
      )}

      <div className="relative flex gap-8 pt-5">
        <div className="min-w-0 flex-1 space-y-4">
          <section>
            <h1 className="flex-1 text-xl font-semibold sm:text-2xl">
              {property.name}
            </h1>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <p className="gap flex flex-wrap items-center gap-x-1 pt-1 text-sm font-medium capitalize">
                  {property.propertyType} in {property.city} ·{" "}
                  <StarIcon className="inline size-[1em] fill-primaryGreen stroke-primaryGreen" />{" "}
                  {property.numRatings === 0 ? (
                    <>New</>
                  ) : (
                    <>
                      {property.avgRating}{" "}
                      <a href="#reviews" className="underline">
                        ({plural(property.numRatings, "review")})
                      </a>
                    </>
                  )}
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
              {originalListing && offer && !property.bookOnAirbnb && (
                <div className="self-end">
                  <PropertyCompareBtn
                    checkIn={offer.checkIn}
                    checkOut={offer.checkOut}
                    numGuests={property.maxNumGuests}
                    originalListing={originalListing}
                  />
                </div>
              )}
            </div>
          </section>

          <section className="flex-justify-between mx-1 flex w-full border-t pt-4">
            <div
              className="flex w-5/6 items-center gap-2"
              onClick={() => setOpenUserInfo(true)}
            >
              <UserAvatar
                name={hostName}
                email={property.host?.email}
                image={
                  property.host?.id
                    ? property.host.image
                    : (property.hostProfilePic ?? "/assets/images/tramona.svg")
                }
              />
              <div className="-space-y-1">
                <p className="text-sm text-muted-foreground">Hosted by</p>
                <p className="text-lg font-medium">{hostName}</p>
              </div>
            </div>
            {offer && (
              <ChatOfferButton
                offerId={offer.id.toString()}
                offerHostId={offer.property.hostId ?? null}
                offerPropertyName={offer.property.name}
              />
            )}
          </section>
          <Dialog open={openUserInfo} onOpenChange={setOpenUserInfo}>
            <DialogTitle className="text-lg font-semibold">
              Host Information
            </DialogTitle>
            <DialogContent>
              {/* <div className="flex space-x-2">
                <div className="flex flex-col space-y-2"> */}
              <UserInfo
                hostName={hostName}
                hostPic={property.host?.image ?? null}
                hostDesc={property.host?.about ?? null}
                hostLocation={property.host?.location ?? null}
              />
              {/* <HostVerificationInfo hostName={hostName} /> */}
              {/* </div>
                <div>
                  <div className="text-lg font-bold">About {hostName}</div>{" "}
                  {property.host?.hostProfile?.about}
                </div>
              </div> */}
            </DialogContent>
          </Dialog>
          <section>
            <h2 className="subheading border-t pb-2 pt-4">
              About this property
            </h2>
            <div className="z-20 px-1 text-zinc-700">
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

          <section className="space-y-4">
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
          <section className="border-t pb-2 pt-4">
            <ReasonsToBook />
          </section>

          <section>
            <h2 className="subheading border-t pb-2 pt-4">
              Where you&apos;ll be
            </h2>
            <div className="relative mt-4 h-[400px]">
              <div className="absolute inset-0 z-0 overflow-hidden rounded-xl border">
                <SingleLocationMap
                  lng={property.latLngPoint.x}
                  lat={property.latLngPoint.y}
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start justify-between border-t pb-2 pt-4">
              <div>
                <h2 id="reviews" className="subheading">
                  Guest Reviews
                </h2>
                <div className="flex items-center gap-2 pb-4">
                  <StarIcon className="inline size-[1em] fill-primaryGreen stroke-primaryGreen" />{" "}
                  {property.avgRating} · {plural(property.numRatings, "review")}
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              {property.reviews.map(
                (review, id) =>
                  reviewBackupImages[id] && (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      backupReview={reviewBackupImages[id]}
                    />
                  ),
              )}
            </div>
            {originalListing && offer && (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-semibold text-teal-700 underline underline-offset-2"
                href={originalListing.getReviewsUrl({
                  checkIn: offer.checkIn,
                  checkOut: offer.checkOut,
                  numGuests: offer.request?.numGuests ?? 1,
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
                {property.checkInTime && (
                  <CheckInTimeRule checkInTime={property.checkInTime} />
                )}
                {property.checkOutTime && (
                  <CheckOutTimeRule checkOutTime={property.checkOutTime} />
                )}
                {property.petsAllowed && (
                  <PetsRule petsAllowed={property.petsAllowed} />
                )}
                {property.smokingAllowed !== null && (
                  <SmokingRule smokingAllowed={property.smokingAllowed} />
                )}
              </div>
            </div>
            {property.cancellationPolicy !== null && (
              <div>
                <h3 className="pb-2 pt-4 font-bold">Cancellation Policy</h3>
                <p>
                  {getCancellationPolicyDescription(
                    property.cancellationPolicy,
                  )}
                </p>
              </div>
            )}
          </section>

          {property.checkInInfo !== null && (
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
          )}

          {offer && (
            <div className="flex justify-end">
              <ShareOfferDialog
                id={offer.id}
                isRequest={false}
                propertyName={property.name}
              />
            </div>
          )}
        </div>

        {sidebar && (
          <div className="hidden shrink-0 md:block md:w-72 lg:w-96">
            <div className="sticky top-[calc(var(--header-height)+1rem)]">
              {sidebar}
            </div>
          </div>
        )}

        {mobileBottomCard && (
          <div className="fixed inset-x-0 bottom-16 md:hidden">
            {mobileBottomCard}
          </div>
        )}
      </div>
    </div>
  );
}

function BookNowBtn({
  btnSize,
  offer,
  property,
}: {
  btnSize: ButtonProps["size"];
  offer: OfferWithDetails;
  property: Pick<
    Property,
    "stripeVerRequired" | "originalListingId" | "bookOnAirbnb"
  >;
}) {
  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();
  const isBooked = !!offer.acceptedAt;

  const airbnbCheckoutUrl = Airbnb.createListing(
    property.originalListingId!,
  ).getCheckoutUrl({
    checkIn: offer.checkIn,
    checkOut: offer.checkOut,
    numGuests: offer.request?.numGuests ?? 1,
  });

  return (
    <Button
      asChild={!isBooked}
      variant={
        property.stripeVerRequired &&
        verificationStatus?.isIdentityVerified === "pending"
          ? "secondary"
          : "primary"
      }
      size={btnSize}
      className="w-full"
      disabled={isBooked}
    >
      {isBooked ? (
        <>
          <BookCheckIcon className="size-5" />
          Booked
        </>
      ) : property.bookOnAirbnb ? (
        <Link
          href={airbnbCheckoutUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book on Airbnb
          <ExternalLinkIcon className="size-5" />
        </Link>
      ) : !property.stripeVerRequired ||
        verificationStatus?.isIdentityVerified === "true" ? (
        <Link href={`/offer-checkout/${offer.id}`}>
          Book now
          <ArrowRightIcon className="size-5" />
        </Link>
      ) : verificationStatus?.isIdentityVerified === "pending" ? (
        <p>Verification pending</p>
      ) : (
        <VerificationProvider>
          <IdentityModal isPrimary={true} />
          <p className="hidden text-center text-sm font-semibold text-red-500 md:block">
            This host requires you to go through Stripe verification before you
            book
          </p>
        </VerificationProvider>
      )}
    </Button>
  );
}

function OfferPageSidebar({
  offer,
  property,
}: {
  offer: OfferWithDetails;
  property: Pick<
    Property,
    "stripeVerRequired" | "originalListingId" | "bookOnAirbnb"
  >;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4">
          {offer.request && (
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
                  {plural(offer.request.numGuests, "guest")}
                </p>
              </div>
            </div>
          )}
          <BookNowBtn btnSize="lg" offer={offer} property={property} />
          {!offer.acceptedAt && (
            <p className="text-center text-xs text-zinc-500">
              You won&apos;t be charged yet
            </p>
          )}
          <PriceDetailsBeforeTax
            offer={offer}
            bookOnAirbnb={property.bookOnAirbnb}
          />
        </CardContent>
      </Card>

      {!property.bookOnAirbnb && (
        <div className="flex gap-2 rounded-xl border border-orange-300 bg-orange-50 p-3 text-orange-800">
          <FlameIcon className="size-7 shrink-0" />
          <div>
            <p className="text-sm font-bold">Tramona exclusive deal</p>
            <p className="text-xs">
              This is an exclusive offer created just for you &ndash; you will
              not be able to find this price anywhere else
            </p>
          </div>
        </div>
      )}
      <div className="flex gap-2 rounded-xl border border-blue-300 bg-blue-50 p-3 text-blue-800">
        <InfoIcon className="size-7 shrink-0" />
        <div>
          <p className="text-sm font-bold">Important Notes</p>
          <p className="text-xs">
            These dates could get booked on other platforms for full price. If
            they do, your match will be automatically withdrawn.
            <br />
            <br />
            After 24 hours, this match will become available for the public to
            book.
            <br />
            <br />
            <b>We encourage you to book within 24 hours for best results.</b>
          </p>
        </div>
      </div>
    </div>
  );
}

function OfferPageMobileBottomCard({
  offer,
  property,
}: {
  offer: OfferWithDetails;
  property: Pick<
    Property,
    "stripeVerRequired" | "originalListingId" | "bookOnAirbnb"
  >;
}) {
  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();

  return (
    <Card className="fixed bottom-16 left-0 w-full md:hidden">
      <CardContent className="flex flex-row items-center justify-between px-4 py-1 text-sm">
        {offer.request && (
          <div className="flex basis-1/2 flex-col">
            <PriceDetailsBeforeTax offer={offer} />
            <p className="font-semibold">
              {formatDateRange(offer.checkIn, offer.checkOut)}
            </p>
          </div>
        )}
        <div className="flex-1">
          <BookNowBtn btnSize="sm" offer={offer} property={property} />
          {verificationStatus?.isIdentityVerified === "false" &&
            property.stripeVerRequired === true && (
              <p className="text-center text-xs font-semibold text-red-500">
                Host requires Stripe verification prior to booking
              </p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

export function OfferPage({ offer }: { offer: OfferWithDetails }) {
  return (
    <PropertyPage
      property={offer.property}
      offer={offer}
      sidebar={<OfferPageSidebar offer={offer} property={offer.property} />}
      mobileBottomCard={
        <OfferPageMobileBottomCard offer={offer} property={offer.property} />
      }
    />
  );
}

export function UserInfo({
  hostName,
  hostPic,
  hostDesc,
  hostLocation,
}: {
  hostName: string;
  hostPic: string | null;
  hostDesc: string | null;
  hostLocation: string | null;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4 shadow-lg">
            <UserAvatar name={hostName} image={hostPic} size={"lg"} />
            <div className="text-left">
              <p className="flex items-center gap-1">
                <CheckIcon className="size-4" />
                Email verified
              </p>
              <p className="flex items-center gap-1">
                <CheckIcon className="size-4" />
                Phone verified
              </p>
              <p className="flex items-center gap-1">
                <CheckIcon className="size-4" />
                Identity verified
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-semibold">{hostName}</div>
          <div className="text-muted-foreground">Located in {hostLocation}</div>
          <div className="mt-2">
            <p>{hostDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// function HostVerificationInfo({ hostName }: { hostName: string }) {
//   return (
//     <div className="flex flex-col gap-2  p-4 ">
//       <div className="space-y-1">
//         <p className="text-lg font-semibold">{`${hostName}'s confirmed information`}</p>
//       </div>
//       <div className="flex items-center gap-2">
//         <CheckIcon className="size-5" />
//         <p className="text-md font-semibold">Email Address</p>
//       </div>
//       <div className="flex items-center gap-2">
//         <CheckIcon className="size-5" />
//         <p className="text-md font-semibold">Phone Number</p>
//       </div>
//       <p className="text-sm text-muted-foreground">
//         {hostName} is a verified host
//       </p>
//     </div>
//   );
// }
