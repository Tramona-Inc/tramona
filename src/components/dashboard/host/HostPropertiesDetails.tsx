import SingleLocationMap from "@/components/_common/GoogleMaps/SingleLocationMap";
import { type Property } from "@/server/db/schema/tables/properties";
import { capitalize } from "@/utils/utils";
import { Dot, MapPin, PackageOpen, PencilLine, Trash2 } from "lucide-react";
import Image from "next/image";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";
import { convertTo12HourFormat } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Onboarding2 from "@/components/host/onboarding/Onboarding2";
import { useHostOnboarding } from "@/utils/store/host-onboarding";

export default function HostPropertiesDetails({
  property,
}: {
  property: Property;
}) {
  const [editing, setEditing] = useState(false);

  const propertyType = useHostOnboarding((state) => state.listing.propertyType);

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
          <HostPropertyEditBtn editing={editing} setEditing={setEditing} />
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
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground">
            {editing ? propertyType : property.propertyType}
          </p>
        </section>
        <section className="space-y-2 py-4">
          <h2 className="text-lg font-bold">Living situation</h2>
          <p className="text-muted-foreground">{property.roomType}</p>
          <div className="flex lowercase text-muted-foreground">
            {property.maxNumGuests}{" "}
            {property.maxNumGuests && property.maxNumGuests > 1
              ? " guests"
              : " guest"}{" "}
            <Dot />
            {property.numBedrooms}{" "}
            {property.numBedrooms && property.numBedrooms > 1
              ? " bedrooms"
              : " bedroom"}{" "}
            <Dot />
            {property.numBeds}{" "}
            {property.numBeds && property.numBeds > 1 ? " beds" : " bed"}{" "}
            <Dot />
            {property.numBathrooms}{" "}
            {property.numBathrooms && property.numBathrooms > 1
              ? " bathrooms"
              : " bathroom"}
          </div>
        </section>
        <section className="space-y-2 py-4">
          <h2 className="text-lg font-bold">Location</h2>
          <div className="flex items-center gap-2">
            <MapPin />
            <p className="text-muted-foreground">{property.address}</p>
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
