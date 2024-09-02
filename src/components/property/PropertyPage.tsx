import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Property } from "@/server/db/schema";
import { api } from "@/utils/api";
import { plural } from "@/utils/utils";

import {
  ArrowLeftIcon,
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ChevronRight,
  ImagesIcon,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import OfferPhotos from "../offers/OfferPhotos";
import { AspectRatio } from "../ui/aspect-ratio";
import PropertyAmenities from "../offers/PropertyAmenities";
import AmenitiesComponent from "../offers/CategorizedAmenities";
import SingleLocationMap from "@/components/_common/GoogleMaps/SingleLocationMap";
import { useRouter } from "next/router";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";

export default function PropertyPage({ property }: { property: Property }) {
  // const isBooked = false;

  // const { data: coordinateData } = api.offers.getCoordinates.useQuery({
  //   location: property.address,
  // });

  const city =
    property.latitude &&
    property.longitude &&
    api.offers.getCity.useQuery({
      lat: property.latitude,
      lng: property.longitude,
    }).data;

  // const isAirbnb =
  //   property.airbnbUrl === null || property.airbnbUrl === "" ? false : true;

  const renderSeeMoreButton = property.imageUrls.length > 4;

  const [indexOfSelectedImage, setIndexOfSelectedImage] = useState<number>(0);
  const firstImageUrl = property.imageUrls[0]!;

  const router = useRouter();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon />
      </Button>
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-[2] space-y-2">
          <h1 className="items-center text-lg font-semibold sm:text-3xl">
            {property.name}
          </h1>
          <div className="text-sm font-medium">
            <span>{plural(property.maxNumGuests, "guest")}</span>
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
          <div className="block sm:hidden">
            <DialogTrigger
              key={0}
              onClick={() => setIndexOfSelectedImage(0)}
              className="hover:opacity-90"
            >
              <Image src={firstImageUrl} alt="" fill objectFit="cover" />
            </DialogTrigger>
          </div>
          <div className="hidden sm:contents">
            {property.imageUrls.slice(0, 5).map((imageUrl, index) => (
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
                  <Image src={imageUrl} alt="" fill objectFit="cover" />
                </DialogTrigger>
              </div>
            ))}
          </div>
          <DialogContent className="flex items-center justify-center bg-transparent">
            <div className="flex justify-center">
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
                            : property.imageUrls.length - 1 === index &&
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
        <a href="#cancellation" className="text-gray-600 hover:text-gray-800">
          Cancellation Policy
        </a>
        {property.checkInTime && (
          <a href="#house-rules" className="text-gray-600 hover:text-gray-800">
            House rules
          </a>
        )}
      </div>

      <hr className="h-px border-0 bg-gray-300" />
      <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start">
        <div className="flex-[2] space-y-6">
          {/* <section>
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
          </section> */}

          <section id="overview" className="scroll-mt-36">
            <h2 className="text-lg font-semibold md:text-xl">
              About this property
            </h2>
            <div className="z-20 max-w-2xl py-2 text-zinc-700">
              <div className="line-clamp-5 break-words">{property.about}</div>
              <div className="flex justify-start py-2">
                <Dialog>
                  <DialogTrigger className="inline-flex items-center justify-center text-foreground underline underline-offset-2">
                    Show more
                    <ChevronRight className="ml-2" />
                  </DialogTrigger>

                  <DialogContent className="max-h-[80vh] max-w-3xl overflow-auto p-8">
                    <DialogHeader>
                      <DialogTitle>About this property</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 whitespace-pre-wrap break-words text-base">
                      {property.about}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>
          <hr className="h-px border-0 bg-gray-300" />
          <section id="amenities" className="scroll-mt-36">
            <h2 className="text-lg font-semibold md:text-xl">Amenitites</h2>
            <PropertyAmenities amenities={property.amenities} />

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Show all amenities
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="">Amenities</DialogTitle>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto">
                  <AmenitiesComponent propertyAmenities={property.amenities} />
                </div>
              </DialogContent>
            </Dialog>
          </section>
        </div>
        {/* <div className="flex-1">
          <BiddingForm
            propertyId={property.id}
            price={property.originalNightlyPrice ?? 0}
          />
        </div> */}
      </div>
      <hr className="h-px border-0 bg-gray-300" />
      <section id="location" className="scroll-mt-36 space-y-1">
        <h3 className="text-lg font-semibold md:text-xl">Location</h3>
        {city && (
          <div className="inline-flex items-center justify-center py-2 text-base">
            <MapPin className="mr-2" />
            <p>{city}</p>
          </div>
        )}
        {property.latitude && property.longitude && (
          <div className="relative mt-4 h-[400px]">
            <div className="absolute inset-0 z-0">
              <SingleLocationMap
                lat={property.latitude}
                lng={property.longitude}
              />
            </div>
          </div>
        )}
      </section>
      <section id="cancellation" className="scroll-mt-36">
        <h2 className="text-lg font-semibold md:text-xl">
          Cancellation Policy
        </h2>
        <div className="py-2">
          <p className="text-sm font-medium text-black">
            {property.cancellationPolicy
              ? getCancellationPolicyDescription(property.cancellationPolicy)
              : "This property has a no-cancellation policy. All payments are final and non-refundable if a cancellation occurs."}
          </p>
        </div>
      </section>
      {property.checkInTime && (
        <div>
          <hr className="h-px border-0 bg-gray-300" />
          <section id="house-rules" className="mt-4 scroll-mt-36">
            <h2 className="text-lg font-bold">House rules</h2>
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
                <h2 className="text-md font-bold">Additional information</h2>
                <p>{property.checkInInfo}</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
