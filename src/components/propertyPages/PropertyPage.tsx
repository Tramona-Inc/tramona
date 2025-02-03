import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import UserAvatar from "@/components/_common/UserAvatar";
import { Button } from "@/components/ui/button";
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
import { getOfferDiscountPercentage, plural } from "@/utils/utils";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  ImagesIcon,
  ChevronRight,
  StarIcon,
  BedDoubleIcon,
  ExternalLinkIcon,
  MessageCircleMore,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import PropertyPhotos from "./sections/PropertyPhotos";
import AmenitiesComponent from "./sections/CategorizedAmenities";
import PropertyAmenities from "./sections/PropertyAmenities";
import ShareOfferDialog from "../_common/ShareLink/ShareOfferDialog";
import { Card, CardContent } from "../ui/card";
import { getOriginalListing } from "@/utils/listing-sites";
import { PropertyCompareBtn } from "./sections/PropertyCompareBtn";
import SingleLocationMap from "../_common/GoogleMaps/SingleLocationMap";
// import Link from "next/link"; // this is redundant now
import {
  CheckInTimeRule,
  CheckOutTimeRule,
  PetsRule,
  SmokingRule,
} from "./sections/HouseRules";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import { createUserNameAndPic } from "../activity-feed/admin/generationHelper";
import ReasonsToBook from "./sections/ReasonsToBook";
// import UserInfo from "./sections/UserInfo"; // REMOVE THIS IMPORT
import { useChatWithHostTeam } from "@/utils/messaging/useChatWithHost";
export type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];
export type PropertyPageData = RouterOutputs["properties"]["getById"];
//export type PropertyPageData = RouterOutputs["properties"]["getById"];
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@/server/api/root";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const aboutRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [reviewBackupImages, setReviewBackupImages] = useState<string[]>([]);
  // const [openUserInfo, setOpenUserInfo] = useState(false); // REMOVE THIS LINE
  const chatWithHostTeam = useChatWithHostTeam();

  const { data: hostTeamMembers } = api.hostTeams.getHostTeamMembers.useQuery({
    hostTeamId: property.hostTeamId,
  });

  const { data: hostTeamOwner } = api.hostTeams.getHostTeamOwner.useQuery({
    hostTeamId: property.hostTeamId,
  });

  console.log("host team members", hostTeamMembers);

  console.log("ratings and reviews", {
    ratings: property.numRatings,
    hostNumReviews: property.hostNumReviews,
    reviews: property.reviews,
    bathrooms: property.numBathrooms,
  });

  api.calendar.getAndUpdateHostCalendar.useQuery(
    {
      hospitableListingId: property.hospitableListingId!,
    },
    {
      enabled: Boolean(property.hospitableListingId),
    },
  );

  const isHospitableUser = property.originalListingPlatform === "Hospitable";

  // const { mutateAsync: updateCalender } =
  //   api.calendar.updateHostCalendar.useMutation();

  // useEffect(() => {
  //   const updateCalendarIfNeeded = async () => {
  //     if (property.hospitableListingId === "Hospitable") {
  //       try {
  //         await updateCalender({
  //           hospitableListingId: property.hospitableListingId,
  //         });
  //       } catch (error) {
  //         console.error("Failed to update calendar:", error);
  //       }
  //     }
  //   };

  //   void updateCalendarIfNeeded();
  // }, [property.hospitableListingId, updateCalender]);

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

  const hostName = property.hostName ?? `${property.hostTeam.owner.firstName}`;

  const originalListing = getOriginalListing(property);

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
              quality={100}
              unoptimized={true}
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
                    unoptimized={true}
                    className="object-cover object-center"
                    quality={100}
                  />
                </DialogTriggerNoDrawer>
              </div>
            ))}
          </div>
          <DialogContentNoDrawer className="flex w-full items-center justify-center border-none bg-transparent [&>button]:hidden">
            <div className="screen-full flex justify-center">
              <PropertyPhotos
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
                      <PropertyPhotos
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
            <div className="flex items-center justify-between">
              <h1 className="flex-1 text-xl font-semibold sm:text-2xl">
                {property.name}
              </h1>
            </div>
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
                        (
                        {plural(
                          property.reviews.length > 0
                            ? property.reviews.length
                            : 0,
                          "review",
                        )}
                        )
                      </a>
                    </>
                  )}
                </p>
                <p className="text-sm font-medium">
                  {plural(property.maxNumGuests, "guest")} ·{" "}
                  {plural(property.numBedrooms, "bedroom")} ·{" "}
                  {plural(property.numBeds, "bed")}
                  {property.numBathrooms && property.numBathrooms > 0 ? (
                    <> · {plural(property.numBathrooms, "bath")}</>
                  ) : null}
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
              // Instead of using the UserInfo dialog, we make this a clickable link:
            >
              <Link href={`/profile/view/${property.hostTeam.ownerId}`}>
                <UserAvatar
                  name={hostName}
                  email={property.hostTeam.owner.email}
                  image={property.hostTeam.owner.image}
                />
              </Link>
              <div className="-space-y-1">
                <p className="text-sm text-muted-foreground">Hosted by</p>
                <p className="text-lg font-medium">{hostName}</p>
              </div>
            </div>
          </section>
          {/* REMOVE THIS DIALOG COMPONENT */}
          {/* <Dialog open={openUserInfo} onOpenChange={setOpenUserInfo}>
            <DialogContent>
              <DialogTitle className="text-lg font-semibold">
                Host Information
              </DialogTitle>
              <UserInfo
                hostName={hostName}
                hostPic={property.hostTeam.owner.image}
                hostDesc={property.hostTeam.owner.about}
                hostLocation={property.hostTeam.owner.location}
              />
             </DialogContent>
          </Dialog> */}
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
                  {property.avgRating === 0 && property.reviews.length === 0 ? (
                    <p>New</p>
                  ) : (
                    <div>
                      {property.avgRating} ·{" "}
                      {plural(property.numRatings, "rating")} ·{" "}
                      {plural(
                        property.reviews.length > 0
                          ? property.reviews.length
                          : 0,
                        "review",
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              {property.reviews.length > 0 ? (
                property.reviews.map(
                  (review, id) =>
                    reviewBackupImages[id] && (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        backupReview={reviewBackupImages[id]}
                      />
                    ),
                )
              ) : (
                <p>No reviews have been made for this property yet.</p>
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
                      image={
                        property.hostProfilePic ?? property.hostTeam.owner.image
                      }
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
            <h2 className="subheading border-t pb-2 pt-4">Meet your host</h2>
            <div className="flex flex-col gap-10 lg:flex-row">
              <Card className="lg:w-1/3">
                <CardContent className="flex flex-col items-center gap-1">
                  <UserAvatar
                    size="huge"
                    name={hostName}
                    image={
                      property.hostProfilePic ?? property.hostTeam.owner.image
                    }
                    onClick={() =>
                      void router.push(`/profile/view/${hostTeamOwner?.id}`)
                    }
                  />
                  <p className="text-lg font-bold">{hostName}</p>
                  <p className="text-sm">Host</p>
                </CardContent>
              </Card>
              <div className="space-y-4">
                {hostTeamMembers &&
                  hostTeamMembers.filter(
                    (member) => member.id !== hostTeamOwner?.id,
                  ).length > 0 && (
                    <>
                      <p className="text-lg font-semibold">Co-hosts</p>
                      <div className="flex items-center gap-4">
                        {hostTeamMembers
                          .filter((member) => member.id !== hostTeamOwner?.id)
                          .map((member, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <UserAvatar
                                size="md"
                                name={hostName}
                                image={member.image}
                                onClick={() =>
                                  void router.push(`/profile/view/${member.id}`)
                                }
                              />
                              <p>{member.firstName}</p>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                <Button
                  onClick={() =>
                    chatWithHostTeam({
                      hostId: property.hostTeam.ownerId,
                      hostTeamId: isHospitableUser
                        ? property.hostTeam.id
                        : undefined,
                      propertyId: property.id,
                    })
                      .then()
                      .catch((err: TRPCClientErrorLike<AppRouter>) => {
                        if (err.data?.code === "UNAUTHORIZED") {
                          console.log(err.data.code);
                          void signIn("google", {
                            callbackUrl: window.location.href,
                          });
                        }
                      })
                  }
                >
                  <MessageCircleMore />
                  Message Host
                </Button>
              </div>
            </div>
          </section>

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

          {/* <section>
            <h2 className="subheading border-t pb-2 pt-4">
              Check-in information
            </h2>
            <div className="space-y-4">
              {property.houseRules && property.houseRules.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">House rules</h3>
                  <ul className="list-inside list-disc">
                    {property.houseRules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
              {property.additionalHouseRules && (
                <div>
                  <h3 className="text-lg font-semibold">
                    Additional house rules
                  </h3>
                  <p>{property.additionalHouseRules}</p>
                </div>
              )}
              {property.interactionPreference && (
                <div>
                  <h3 className="text-lg font-semibold">
                    Host interaction preference
                  </h3>
                  <div>
                    {convertHostInteractionPref(property.interactionPreference)}
                  </div>
                </div>
              )}
            </div>

            <p>
              {property.additionalCheckInInfo === "self"
                ? "Self check-in"
                : property.additionalCheckInInfo}
            </p>
          </section> */}

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
          <div className="hidden shrink-0 md:block md:w-5/12 lg:w-96">
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
