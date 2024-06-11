import SingleLocationMap from "@/components/_common/GoogleMaps/SingleLocationMap";
import { type Property } from "@/server/db/schema/tables/properties";
import { capitalize } from "@/utils/utils";
import { Dot, MapPin, PackageOpen, PencilLine, Trash2 } from "lucide-react";
import Image from "next/image";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";
import { convertTo12HourFormat, convertTo24HourFormat } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import Onboarding2 from "@/components/host/onboarding/Onboarding2";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { api } from "@/utils/api";
import Onboarding3 from "@/components/host/onboarding/Onboarding3";
import Onboarding4 from "@/components/host/onboarding/Onboarding4";

export default function HostPropertiesDetails({
  property,
}: {
  property: Property;
}) {
  const [editing, setEditing] = useState(false);

  const propertyType = useHostOnboarding((state) => state.listing.propertyType);
  const setPropertyType = useHostOnboarding((state) => state.setPropertyType);

  const maxGuests = useHostOnboarding((state) => state.listing.maxGuests);
  const setMaxGuests = useHostOnboarding((state) => state.setMaxGuests);

  const bedrooms = useHostOnboarding((state) => state.listing.bedrooms);
  const setBedrooms = useHostOnboarding((state) => state.setBedrooms);

  const beds = useHostOnboarding((state) => state.listing.beds);
  const setBeds = useHostOnboarding((state) => state.setBeds);

  const bathrooms = useHostOnboarding((state) => state.listing.bathrooms);
  const setBathrooms = useHostOnboarding((state) => state.setBathrooms);

  const spaceType = useHostOnboarding((state) => state.listing.spaceType);
  const setSpaceType = useHostOnboarding((state) => state.setSpaceType);

  const location = useHostOnboarding((state) => state.listing.location);
  const address = `${location.street}, ${location.apt && location.apt + ","} ${location.city}, ${location.state} ${location.zipcode}`;

  const setLocation = useHostOnboarding((state) => state.setLocation);

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

  const handleFormSubmit = async () => {
    const newProperty = {
      ...property,
      propertyType: propertyType,
      checkInTime: convertTo24HourFormat(property.checkInTime ?? ""),
      checkOutTime: convertTo24HourFormat(property.checkOutTime ?? ""),
      roomType: spaceType,
      maxNumGuests: maxGuests,
      numBedrooms: bedrooms,
      numBeds: beds,
      numBathrooms: bathrooms,
      address: address,
    };

    await updateProperty(newProperty);
  };

  useEffect(() => {
    setPropertyType(property.propertyType);
    setMaxGuests(property.maxNumGuests);
    setBedrooms(property.numBedrooms);
    setBeds(property.numBeds);
    property.numBathrooms && setBathrooms(property.numBathrooms);
    setSpaceType(property.roomType);
  }, [
    property.maxNumGuests,
    property.numBathrooms,
    property.numBedrooms,
    property.numBeds,
    property.propertyType,
    property.roomType,
    setBathrooms,
    setBedrooms,
    setBeds,
    setMaxGuests,
    setPropertyType,
    setSpaceType,
  ]);

  return (
    <div className="my-6">
      <div className="flex items-center justify-between">
        {editing && (
          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary">
              <Trash2 />
              Delete
            </Button>
            <Button variant="secondary">
              <PackageOpen />
              Archive
            </Button>
            <Button variant="secondary">
              <PencilLine />
              Move to drafts
            </Button>
          </div>
        )}
        <div className="flex-1 text-end">
          <HostPropertyEditBtn
            editing={editing}
            setEditing={setEditing}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
      <div className="divide-y">
        <section className="space-y-2 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Type of property</h2>
            <Dialog>
              <DialogTrigger>
                {editing && <a className="text-sm font-bold underline">Edit</a>}
              </DialogTrigger>
              <DialogContent>
                <Onboarding2 editing />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Save</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground">
            {editing ? propertyType : property.propertyType}
          </p>
        </section>
        <section className="space-y-2 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Living situation</h2>
            <Dialog>
              <DialogTrigger>
                {editing && <a className="text-sm font-bold underline">Edit</a>}
              </DialogTrigger>
              <DialogContent>
                <Onboarding3 editing />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Save</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground">
            {editing ? spaceType : property.roomType}
          </p>
          <div className="flex lowercase text-muted-foreground">
            {editing ? (
              <>
                {`${maxGuests} ${maxGuests > 1 ? "guests" : "guest"}`} <Dot />
                {`${bedrooms} ${bedrooms > 1 ? "bedrooms" : "bedroom"}`} <Dot />
                {`${beds} ${beds > 1 ? "beds" : "bed"}`} <Dot />
                {bathrooms &&
                  `${bathrooms} ${bathrooms > 1 ? "bathrooms" : "bathroom"}`}
              </>
            ) : (
              <>
                {`${property.maxNumGuests} ${property.maxNumGuests > 1 ? "guests" : "guest"}`}{" "}
                <Dot />
                {`${property.numBedrooms} ${property.numBedrooms > 1 ? "bedrooms" : "bedroom"}`}{" "}
                <Dot />
                {`${property.numBeds} ${property.numBeds > 1 ? "beds" : "bed"}`}{" "}
                <Dot />
                {property.numBathrooms &&
                  `${property.numBathrooms} ${property.numBathrooms > 1 ? "bathrooms" : "bathroom"}`}
              </>
            )}
          </div>
        </section>

        {/* TODO: fix edit location functionality */}
        <section className="space-y-2 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Location</h2>
            <Dialog>
              <DialogTrigger>
                {editing && <a className="text-sm font-bold underline">Edit</a>}
              </DialogTrigger>
              <DialogContent>
                <Onboarding4 editing />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Save</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-2">
            <MapPin />
            <p className="text-muted-foreground">
              {editing ? address : property.address}
            </p>
          </div>
          <div className="relative mb-10 h-[400px]">
            <div className="absolute inset-0 z-0">
              <SingleLocationMap
                lat={property.latitude ?? 0}
                lng={property.longitude ?? 0}
              />
            </div>
          </div>
        </section>
        <section className="space-y-2 py-4">
          <h2 className="text-lg font-bold">Check-in</h2>
          <div className="text-muted-foreground">
            <p>{capitalize(property.checkInInfo ?? "")} check-in / out</p>
            <div className="flex">
              <p>
                Check-in:{" "}
                {property.checkInTime &&
                  convertTo12HourFormat(property.checkInTime)}
              </p>
              <Dot />
              <p>
                Check-out:{" "}
                {property.checkOutTime &&
                  convertTo12HourFormat(property.checkOutTime)}
              </p>
            </div>
          </div>
        </section>
        <section className="space-y-2 py-4">
          <h2 className="text-lg font-bold">Amenities</h2>
          <div className="grid grid-cols-2 gap-y-2 text-muted-foreground">
            {property.amenities?.map((amenity, index) => (
              <div key={index} className="flex items-center">
                <p>{amenity}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-2 py-4">
          <h2 className="text-lg font-bold">Photos</h2>
          <div className="grid h-[420.69px] grid-cols-4 grid-rows-2 gap-2 overflow-clip rounded-xl">
            <div className="relative col-span-2 row-span-2 bg-accent">
              <Image
                src={property.imageUrls[0]!}
                alt=""
                fill
                objectFit="cover"
                priority
              />
            </div>
            <div className="relative col-span-1 row-span-1 bg-accent">
              <Image
                src={property.imageUrls[1]!}
                alt=""
                fill
                objectFit="cover"
              />
            </div>
            <div className="relative col-span-1 row-span-1 bg-accent">
              <Image
                src={property.imageUrls[2]!}
                alt=""
                fill
                objectFit="cover"
              />
            </div>
            <div className="relative col-span-1 row-span-1 bg-accent">
              <Image
                src={property.imageUrls[3]!}
                alt=""
                fill
                objectFit="cover"
              />
            </div>
            <div className="relative col-span-1 row-span-1 bg-accent">
              <Image
                src={property.imageUrls[4]!}
                alt=""
                fill
                objectFit="cover"
              />
            </div>
          </div>
        </section>
        <section className="space-y-2 py-4">
          <h2 className="text-lg font-bold">Description</h2>
          <div>
            <h3 className="font-semibold ">Title</h3>
            <p className="text-muted-foreground">{property.name}</p>
          </div>
          <div>
            <h3 className="font-semibold ">Description</h3>
            <p className="text-muted-foreground">{property.about}</p>
          </div>
        </section>
        <section className="space-y-2 py-4">
          <h2 className="text-lg font-bold">House rules</h2>
          <div className="text-muted-foreground">
            <p>{property.petsAllowed ? "Pets allowed" : "No pets"}</p>
            <p>{property.smokingAllowed ? "Smoking allowed" : "No smoking"}</p>
          </div>
          <h3 className="font-semibold">Additional rules</h3>
          <p className="text-muted-foreground">
            {property.otherHouseRules
              ? capitalize(property.otherHouseRules)
              : "No additional rules"}
          </p>
        </section>
      </div>
    </div>
  );
}
