import { buttonVariants } from "@/components/ui/button";
import { useState } from "react";
//import { GoogleMap, Circle } from "@react-google-maps/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Property } from "@/server/db/schema";
import { api, type RouterOutputs } from "@/utils/api";
import { cn, plural } from "@/utils/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import "leaflet/dist/leaflet.css";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ChevronRight,
  ImagesIcon,
  MapPin,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "../_utils/useMediaQuery";
import OfferPhotos from "../offers/OfferPhotos";
import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "../ui/badge";
import BiddingForm from "./BiddingForm";

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

export default function PropertyPage({ property }: { property: Property }) {
  let isBooked = false;

  // const { data: coordinateData } = api.offers.getCoordinates.useQuery({
  //   location: property.address!,
  // });

  const { data: addressData } = api.offers.getCity.useQuery({
    latitude: property.latitude!,
    longitude: property.longitude!,
  });

  const isMobile = useMediaQuery("(max-width: 640px)");

  const isAirbnb =
    property.airbnbUrl === null || property.airbnbUrl === "" ? false : true;

  // const lisa = false; // temporary until we add payments
  const hostName = property.hostName;

  const renderSeeMoreButton = property.imageUrls.length > 4;

  const [indexOfSelectedImage, setIndexOfSelectedImage] = useState<number>(0);
  const firstImageUrl: string = property.imageUrls?.[0] ?? "";
  return (
    <div className="space-y-4">
      <Link
        href={isBooked ? "/requests" : `/`}
        className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
      >
        &larr; Back to Home Page
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
          <h1 className="items-center text-lg font-semibold sm:text-3xl">
            {property.name}{" "}
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
              {/* <UserAvatar
                name={hostName}
                email={property.host?.email}
                image={property.host?.image}
              /> */}
              <div className="-space-y-1.5">
                <p className="text-sm text-muted-foreground">Hosted by</p>
                <p className="text-lg font-medium">{hostName}</p>
              </div>
            </div>
          </section>
          <section>
            <div className="z-20 max-w-2xl rounded-lg bg-zinc-200 px-4 py-2 text-zinc-700">
              <div className="line-clamp-3 break-words">{property.about}</div>
              <div className="flex justify-end">
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
        </div>
        <div className="flex-1">
          <BiddingForm propertyId={property.id} price={property.originalNightlyPrice ?? 0} />
        </div>
      </div>
      <hr className="h-px border-0 bg-gray-300" />
      <section id="location" className="scroll-mt-36 space-y-1">
        <h1 className="text-lg font-semibold md:text-xl">Location</h1>
        <div className="inline-flex items-center justify-center py-2 text-base">
          <MapPin className="mr-2" />
          {addressData?.city}, {addressData?.state}
        </div>
        {property.latitude && property.latitude && (
          <div className="relative z-10">
            <MapContainer
              center={[property.latitude, property.longitude ?? 0]}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: "500px" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Circle
                center={[property.latitude, property.longitude ?? 0]}
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
          <section id="house-rules" className="mt-4 scroll-mt-36">
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
