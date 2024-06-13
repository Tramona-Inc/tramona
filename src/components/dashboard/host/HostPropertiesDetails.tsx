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
import {
  type LocationType,
  useHostOnboarding,
} from "@/utils/store/host-onboarding";
import { api } from "@/utils/api";
import Onboarding3 from "@/components/host/onboarding/Onboarding3";
import Onboarding4 from "@/components/host/onboarding/Onboarding4";
import Onboarding5 from "@/components/host/onboarding/Onboarding5";

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
  const address = `${location.street}, ${location.apt && location.apt + ", "}${location.city}, ${location.state} ${location.zipcode}, ${location.country}`;
  const setLocation = useHostOnboarding((state) => state.setLocation);

  const checkInType = useHostOnboarding((state) => state.listing.checkInType);
  const setCheckInType = useHostOnboarding((state) => state.setCheckInType);

  const checkIn = useHostOnboarding((state) => state.listing.checkIn);
  const setCheckIn = useHostOnboarding((state) => state.setCheckIn);

  const checkOut = useHostOnboarding((state) => state.listing.checkOut);
  const setCheckOut = useHostOnboarding((state) => state.setCheckOut);

  const otherCheckInType = useHostOnboarding(
    (state) => state.listing.otherCheckInType,
  );
  const setOtherCheckInType = useHostOnboarding(
    (state) => state.setOtherCheckInType,
  );

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();
  const { data: coordinateData } = api.offers.getCoordinates.useQuery({
    location: address,
  });

  const handleFormSubmit = async () => {
    const newProperty = {
      ...property,
      propertyType: propertyType,
      checkInTime: convertTo24HourFormat(checkIn),
      checkOutTime: convertTo24HourFormat(checkOut),
      roomType: spaceType,
      maxNumGuests: maxGuests,
      numBedrooms: bedrooms,
      numBeds: beds,
      numBathrooms: bathrooms,
      address: address,
      checkInInfo: checkInType,
      latitude: coordinateData?.coordinates.location?.lat,
      longitude: coordinateData?.coordinates.location?.lng,
    };

    await updateProperty(newProperty);
  };

  const addressWithApt: LocationType = {
    country: property.address.split(", ")[4] ?? "",
    street: property.address.split(", ")[0] ?? "",
    apt: property.address.split(", ")[1] ?? "",
    city: property.address.split(", ")[2] ?? "",
    state: property.address.split(", ")[3]?.split(" ")[0] ?? "",
    zipcode: property.address.split(", ")[3]?.split(" ")[1] ?? "",
  };

  const addressWithoutApt: LocationType = {
    country: property.address.split(", ")[3] ?? "",
    street: property.address.split(", ")[0] ?? "",
    apt: "",
    city: property.address.split(", ")[1] ?? "",
    state: property.address.split(", ")[2]?.split(" ")[0] ?? "",
    zipcode: property.address.split(", ")[2]?.split(" ")[1] ?? "",
  };

  useEffect(() => {
    setPropertyType(property.propertyType);
    setMaxGuests(property.maxNumGuests);
    setBedrooms(property.numBedrooms);
    setBeds(property.numBeds);
    property.numBathrooms && setBathrooms(property.numBathrooms);
    setSpaceType(property.roomType);
    setLocation(location.apt ? addressWithApt : addressWithoutApt);
    setCheckInType(property.checkInInfo ?? "");
    setCheckIn(property.checkInTime ?? "");
    setCheckOut(property.checkOutTime ?? "");
  }, [property]);

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
                  {/* <DialogClose asChild>
                    <Button>Save</Button>
                  </DialogClose> */}
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
                lat={
                  editing
                    ? coordinateData?.coordinates.location?.lat ?? 0
                    : property.latitude ?? 0
                }
                lng={
                  editing
                    ? coordinateData?.coordinates.location?.lng ?? 0
                    : property.longitude ?? 0
                }
              />
            </div>
          </div>
        </section>

        {/* TODO: fix check-in/check-out time functionality and error handling */}
        <section className="space-y-2 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Check-in</h2>
            <Dialog>
              <DialogTrigger>
                {editing && <a className="text-sm font-bold underline">Edit</a>}
              </DialogTrigger>
              <DialogContent>
                <Onboarding5 editing />
                <DialogFooter>
                  {/* <DialogClose asChild>
                    <Button>Save</Button>
                  </DialogClose> */}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-muted-foreground">
            <p>
              {capitalize(editing ? checkInType : property.checkInInfo ?? "")}{" "}
              check-in / out
            </p>
            <div className="flex">
              <p>
                Check-in:{" "}
                {editing
                  ? convertTo12HourFormat(checkIn)
                  : property.checkInTime &&
                    convertTo12HourFormat(property.checkInTime)}
              </p>
              <Dot />
              <p>
                Check-out:{" "}
                {editing
                  ? convertTo12HourFormat(checkOut)
                  : property.checkOutTime &&
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
