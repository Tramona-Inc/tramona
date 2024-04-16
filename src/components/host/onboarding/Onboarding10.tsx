import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { MapPin } from "lucide-react";
import Image from "next/image";
import OnboardingFooter from "./OnboardingFooter";
import { api } from "@/utils/api";
import LeafletMap from "./LeafletMap";
import { useState } from "react";
import React from "react";
import Summary1 from "./Summary1";
import Summary2 from "./Summary2";
import Summary4 from "./Summary4";
import Summary7 from "./Summary7";
import Summary8 from "./Summary8";

function Heading({
  title,
  editPage,
  children,
}: {
  title: string;
  editPage?: number;
  children: React.ReactNode;
}) {
  // const progress = useHostOnboarding((state) => state.progress);
  const setProgress = useHostOnboarding((state) => state.setProgress);

  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p
          className="text-sm underline transition duration-200 hover:cursor-pointer hover:text-muted-foreground"
          onClick={() => {
            if (editPage) {
              setProgress(editPage);
            }
          }}
        >
          Edit
        </p>
      </div>

      <div className="flex flex-col gap-2 capitalize text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export default function Onboarding10() {
  const { listing } = useHostOnboarding((state) => state);

  const address = `${listing.location.street}${listing.location.apt ? `, ${listing.location.apt}` : ""}, ${listing.location.city}, ${listing.location.state} ${listing.location.zipcode}, ${listing.location.country}`;

  // const { data: coordinateData } = api.offers.getCoordinates.useQuery({
  //   location: address,
  // });
  // console.log(address);
  // console.log("this is ");
  // console.log(coordinateData.coordinates.lat, coordinateData.coordinates.lng)

  return (
    <>
      <div className="container my-10 flex-grow sm:px-32">
        <h1 className="mb-8 text-3xl font-semibold">Review your listing</h1>
        <div className="grid grid-cols-1 space-y-3 divide-y">
          <Summary1 />
          <Summary2 />

          <Heading title={"Location"} editPage={3}>
            <div className="flex flex-row gap-5">
              <MapPin />

              <div>
                <p> {listing.location.street}</p>
                {listing.location.apt && <p>{listing.location.apt}</p>}
                <p>
                  {listing.location.city}, {listing.location.state}{" "}
                  {listing.location.zipcode}
                </p>
                <p>{listing.location.country}</p>
              </div>
            </div>
            {/* {coordinateData &&
              (<LeafletMap lat={coordinateData.coordinates.lat} lng={coordinateData.coordinates.lng}/>)
              } */}
          </Heading>
          <Summary4 />
          <Heading title={"Amenities"} editPage={5}>
            <div className="grid grid-cols-2 gap-5">
              {listing.amenities.map((amenity, index) => (
                <p key={index} className="flex items-center">
                  {amenity}
                </p>
              ))}
            </div>
          </Heading>
          <Heading title={"Photos"} editPage={6}>
            <div className="grid h-[420.69px] grid-cols-4 grid-rows-2 gap-2 overflow-clip rounded-xl">
              <div className="relative col-span-2 row-span-2 bg-accent">
                <Image
                  src={listing.imageUrls[0]!}
                  alt=""
                  fill
                  objectFit="cover"
                  priority
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src={listing.imageUrls[1]!}
                  alt=""
                  fill
                  objectFit="cover"
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src={listing.imageUrls[2]!}
                  alt=""
                  fill
                  objectFit="cover"
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src={listing.imageUrls[3]!}
                  alt=""
                  fill
                  objectFit="cover"
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src={listing.imageUrls[4]!}
                  alt=""
                  fill
                  objectFit="cover"
                />
              </div>
            </div>
          </Heading>
          <Summary7 />
          <Summary8 />
        </div>
      </div>
      <OnboardingFooter isForm={false} />
    </>
  );
}
