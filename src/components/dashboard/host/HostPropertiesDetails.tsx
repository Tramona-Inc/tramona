import SingleLocationMap from "@/components/_common/GoogleMaps/SingleLocationMap";
import { type Property } from "@/server/db/schema/tables/properties";
import { capitalize } from "@/utils/utils";
import {
  AlertCircle,
  Dot,
  MapPin,
  PackageOpen,
  Trash2,
  Upload,
} from "lucide-react";
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
import Onboarding8 from "@/components/host/onboarding/Onboarding8";
import Onboarding9 from "@/components/host/onboarding/Onboarding9";
import Onboarding7 from "@/components/host/onboarding/Onboarding7";
import Onboarding6 from "@/components/host/onboarding/Onboarding6";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HostPropertiesDetails({
  property,
}: {
  property: Property;
}) {
  const [editing, setEditing] = useState(false);
  const [handleOnboarding, setHandleOnboarding] = useState<() => void>();
  const router = useRouter();

  const propertyType = useHostOnboarding((state) => state.listing.propertyType);
  const maxGuests = useHostOnboarding((state) => state.listing.maxGuests);
  const bedrooms = useHostOnboarding((state) => state.listing.bedrooms);
  const beds = useHostOnboarding((state) => state.listing.beds);
  const bathrooms = useHostOnboarding((state) => state.listing.bathrooms);
  const spaceType = useHostOnboarding((state) => state.listing.spaceType);
  const location = useHostOnboarding((state) => state.listing.location);
  const address = `${location.street}, ${location.apt && location.apt + ", "}${location.city}, ${location.state} ${location.zipcode}, ${location.country}`;
  const checkInType = useHostOnboarding((state) => state.listing.checkInType);
  const checkIn = useHostOnboarding((state) => state.listing.checkIn);
  const checkOut = useHostOnboarding((state) => state.listing.checkOut);
  const amenities: string[] = useHostOnboarding(
    (state) => state.listing.amenities,
  );
  const otherAmenities: string[] = useHostOnboarding(
    (state) => state.listing.otherAmenities,
  );
  const imageURLs = useHostOnboarding((state) => state.listing.imageUrls);
  const title = useHostOnboarding((state) => state.listing.title);
  const description = useHostOnboarding((state) => state.listing.description);
  const petsAllowed = useHostOnboarding((state) => state.listing.petsAllowed);
  const smokingAllowed = useHostOnboarding(
    (state) => state.listing.smokingAllowed,
  );
  const otherHouseRules = useHostOnboarding(
    (state) => state.listing.otherHouseRules,
  );

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();
  const { mutateAsync: deleteProperty } = api.properties.delete.useMutation({
    onSuccess: () => void router.push("/host/properties"),
  });
  const { data: coordinateData } = api.offers.getCoordinates.useQuery({
    location: address,
  });

  const { data: fetchedProperty, refetch } = api.properties.getById.useQuery({
    id: property.id,
  });

  const handleFormSubmit = async () => {
    const newProperty = {
      ...property,
      propertyType: propertyType,
      roomType: spaceType,
      maxNumGuests: maxGuests,
      numBedrooms: bedrooms,
      numBeds: beds,
      numBathrooms: bathrooms,
      address: address,
      checkInInfo: checkInType,
      checkInTime: convertTo24HourFormat(checkIn),
      checkOutTime: convertTo24HourFormat(checkOut),
      amenities: amenities,
      otherAmenities: otherAmenities,
      imageUrls: imageURLs,
      name: title,
      about: description,
      petsAllowed: petsAllowed,
      smokingAllowed: smokingAllowed,
      otherHouseRules: otherHouseRules,
    };

    await updateProperty(newProperty);
    await refetch();
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

  function isAddressValid() {
    if (property.address.split(", ").length > 4) {
      return (
        addressWithApt.street !== "" &&
        addressWithApt.apt !== "" &&
        addressWithApt.city !== "" &&
        addressWithApt.state !== "" &&
        addressWithApt.zipcode !== "" &&
        addressWithApt.country !== ""
      );
    } else {
      return (
        addressWithoutApt.street !== "" &&
        addressWithoutApt.city !== "" &&
        addressWithoutApt.state !== "" &&
        addressWithoutApt.zipcode !== "" &&
        addressWithoutApt.country !== ""
      );
    }
  }

  function isDraftValid() {
    return (
      isAddressValid() &&
      property.imageUrls.length !== 0 &&
      property.name !== "" &&
      property.about !== ""
    );
  }

  const propertyId = property.id;

  useEffect(() => {
    setEditing(false);
  }, [propertyId]);

  return (
    <div className="my-6">
      <div className="flex items-center justify-between">
        {editing && (
          <div className="grid grid-cols-3 gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-500">
                  <Trash2 />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  Are you sure you want to delete this property?
                </AlertDialogHeader>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  property.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteProperty(property)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {property.status === "Listed" && (
              <Button
                variant="outline"
                onClick={() =>
                  updateProperty({
                    ...property,
                    status: "Archived",
                    checkInTime: convertTo24HourFormat(checkIn),
                    checkOutTime: convertTo24HourFormat(checkOut),
                  })
                }
              >
                <PackageOpen />
                Archive
              </Button>
            )}
            {property.status === "Archived" && (
              <Button
                variant="outline"
                onClick={() =>
                  updateProperty({
                    ...property,
                    status: "Listed",
                    checkInTime: convertTo24HourFormat(checkIn),
                    checkOutTime: convertTo24HourFormat(checkOut),
                  })
                }
              >
                <Upload />
                List property
              </Button>
            )}
            {property.status === "Drafted" &&
              (isDraftValid() ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateProperty({
                      ...property,
                      status: "Listed",
                      checkInTime: convertTo24HourFormat(checkIn),
                      checkOutTime: convertTo24HourFormat(checkOut),
                    })
                  }
                >
                  <Upload />
                  List property
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button disabled>
                        <Upload />
                        List property
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-red-600">
                      <p className="text-sm">
                        All fields with an alert icon must be completed before
                        listing a property.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        )}
        <div className="text-end">
          <HostPropertyEditBtn
            editing={editing}
            setEditing={setEditing}
            onSubmit={handleFormSubmit}
            property={property}
          />
        </div>
      </div>
      <div className="h-[45rem] overflow-y-auto">
        <div className="my-4 space-y-4">
          <section className="space-y-2 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-bold">
                {(!property.name || !property.about) && (
                  <AlertCircle className="text-red-600" />
                )}
                Description
              </div>
              <Dialog>
                <DialogTrigger>
                  {editing && (
                    <a className="text-sm font-bold underline">Edit</a>
                  )}
                </DialogTrigger>
                <DialogContent>
                  <Onboarding8
                    editing
                    setHandleOnboarding={setHandleOnboarding}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        onClick={async () => {
                          handleOnboarding?.();
                        }}
                      >
                        Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <h3 className="font-semibold">Name</h3>
              <p className="text-muted-foreground">
                {editing ? title : fetchedProperty?.name}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">About</h3>
              <p className="text-muted-foreground">
                {editing ? description : fetchedProperty?.about}
              </p>
            </div>
          </section>
          <section className="space-y-2 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Type of property</h2>
              <Dialog>
                <DialogTrigger>
                  {editing && (
                    <a className="text-sm font-bold underline">Edit</a>
                  )}
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
              {editing ? propertyType : fetchedProperty?.propertyType}
            </p>
          </section>
          <section className="space-y-2 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Living situation</h2>
              <Dialog>
                <DialogTrigger>
                  {editing && (
                    <a className="text-sm font-bold underline">Edit</a>
                  )}
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
              {editing ? spaceType : fetchedProperty?.roomType}
            </p>
            <div className="flex lowercase text-muted-foreground">
              {editing ? (
                <>
                  {`${maxGuests} ${maxGuests > 1 ? "guests" : "guest"}`} <Dot />
                  {`${bedrooms} ${bedrooms > 1 ? "bedrooms" : "bedroom"}`}{" "}
                  <Dot />
                  {`${beds} ${beds > 1 ? "beds" : "bed"}`} <Dot />
                  {bathrooms &&
                    `${bathrooms} ${bathrooms > 1 ? "bathrooms" : "bathroom"}`}
                </>
              ) : (
                <>
                  {`${fetchedProperty?.maxNumGuests} ${fetchedProperty && fetchedProperty.maxNumGuests > 1 ? "guests" : "guest"}`}{" "}
                  <Dot />
                  {`${fetchedProperty?.numBedrooms} ${fetchedProperty && fetchedProperty.numBedrooms > 1 ? "bedrooms" : "bedroom"}`}{" "}
                  <Dot />
                  {`${fetchedProperty?.numBeds} ${fetchedProperty && fetchedProperty.numBeds > 1 ? "beds" : "bed"}`}{" "}
                  <Dot />
                  {fetchedProperty?.numBathrooms &&
                    `${fetchedProperty.numBathrooms} ${fetchedProperty.numBathrooms > 1 ? "bathrooms" : "bathroom"}`}
                </>
              )}
            </div>
          </section>

          {/* TODO: fix edit location functionality */}
          <section className="space-y-2 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Location</h2>
              <Dialog>
                <DialogTrigger>
                  {editing && (
                    <a className="text-sm font-bold underline">Edit</a>
                  )}
                </DialogTrigger>
                <DialogContent>
                  <Onboarding4
                    editing
                    setHandleOnboarding={setHandleOnboarding}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        onClick={async () => {
                          handleOnboarding?.();
                        }}
                      >
                        Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center gap-2">
              <MapPin />
              <p className="text-muted-foreground">
                {editing
                  ? address === ", ,   , "
                    ? "Please enter a valid address"
                    : address
                  : fetchedProperty?.address === ", ,   , "
                    ? "Please enter a valid address"
                    : fetchedProperty?.address}
              </p>
            </div>
            <div className="relative mb-10 h-[400px]">
              <div className="absolute inset-0 z-0">
                <SingleLocationMap
                  lat={
                    editing
                      ? (coordinateData?.coordinates.location?.lat ?? 0)
                      : (fetchedProperty?.latLngPoint.y ?? null)
                  }
                  lng={
                    editing
                      ? (coordinateData?.coordinates.location?.lng ?? 0)
                      : (fetchedProperty?.latLngPoint.x ?? null)
                  }
                />
              </div>
            </div>
          </section>

          <section className="space-y-2 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Check-in</h2>
              <Dialog>
                <DialogTrigger>
                  {editing && (
                    <a className="text-sm font-bold underline">Edit</a>
                  )}
                </DialogTrigger>
                <DialogContent>
                  <Onboarding5
                    editing
                    setHandleOnboarding={setHandleOnboarding}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        onClick={async () => {
                          handleOnboarding?.();
                        }}
                      >
                        Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-muted-foreground">
              <p>
                {capitalize(
                  editing ? checkInType : (fetchedProperty?.checkInInfo ?? ""),
                )}
              </p>
              <div className="flex">
                <p>
                  Check-in:{" "}
                  {editing
                    ? convertTo12HourFormat(checkIn)
                    : fetchedProperty?.checkInTime &&
                      convertTo12HourFormat(fetchedProperty.checkInTime)}
                </p>
                <Dot />
                <p>
                  Check-out:{" "}
                  {editing
                    ? convertTo12HourFormat(checkOut)
                    : fetchedProperty?.checkOutTime &&
                      convertTo12HourFormat(fetchedProperty.checkOutTime)}
                </p>
              </div>
            </div>
          </section>
          <section className="space-y-2 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Amenities</h2>
              <Dialog>
                <DialogTrigger>
                  {editing && (
                    <a className="text-sm font-bold underline">Edit</a>
                  )}
                </DialogTrigger>
                <DialogContent>
                  <Onboarding6 editing />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button>Save</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-muted-foreground">
              {fetchedProperty &&
                (editing ? amenities : fetchedProperty.amenities).map(
                  (amenity, index) => (
                    <div key={index} className="flex items-center">
                      <p>{amenity}</p>
                    </div>
                  ),
                )}
              <div className="col-span-full">
                <p className="font-semibold text-primary">Other Amenities</p>
              </div>
              {fetchedProperty &&
                (editing ? otherAmenities : fetchedProperty.otherAmenities).map(
                  (amenity, index) => (
                    <div key={index} className="flex items-center">
                      <p>{capitalize(amenity)}</p>
                    </div>
                  ),
                )}
            </div>
          </section>
          <section className="space-y-2 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-bold">
                {fetchedProperty?.imageUrls.length === 0 && (
                  <AlertCircle className="text-red-600" />
                )}
                Photos
              </div>
              <Dialog>
                <DialogTrigger>
                  {editing && (
                    <a className="text-sm font-bold underline">Edit</a>
                  )}
                </DialogTrigger>
                <DialogContent>
                  <Onboarding7
                    editing
                    setHandleOnboarding={setHandleOnboarding}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        onClick={async () => {
                          handleOnboarding?.();
                        }}
                      >
                        Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid h-[420.69px] grid-cols-4 grid-rows-2 gap-2 overflow-clip rounded-xl">
              <div className="relative col-span-2 row-span-2 bg-accent">
                <Image
                  src={
                    editing
                      ? imageURLs[0]!
                      : (fetchedProperty?.imageUrls[0] ?? "")
                  }
                  alt=""
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src={
                    editing
                      ? imageURLs[1]!
                      : (fetchedProperty?.imageUrls[1] ?? "")
                  }
                  alt=""
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src={
                    editing
                      ? imageURLs[2]!
                      : (fetchedProperty?.imageUrls[2] ?? "")
                  }
                  alt=""
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src={
                    editing
                      ? imageURLs[3]!
                      : (fetchedProperty?.imageUrls[3] ?? "")
                  }
                  alt=""
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src={
                    editing
                      ? imageURLs[4]!
                      : (fetchedProperty?.imageUrls[4] ?? "")
                  }
                  alt=""
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </section>
          <section className="space-y-2 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">House rules</h2>
              <Dialog>
                <DialogTrigger>
                  {editing && (
                    <a className="text-sm font-bold underline">Edit</a>
                  )}
                </DialogTrigger>
                <DialogContent>
                  <Onboarding9
                    editing
                    setHandleOnboarding={setHandleOnboarding}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        onClick={async () => {
                          handleOnboarding?.();
                        }}
                      >
                        Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-muted-foreground">
              <p>
                {(editing ? petsAllowed : fetchedProperty?.petsAllowed)
                  ? "Pets allowed"
                  : "No pets"}
              </p>
              <p>
                {(editing ? smokingAllowed : fetchedProperty?.smokingAllowed)
                  ? "Smoking allowed"
                  : "No smoking"}
              </p>
            </div>
            <h3 className="font-semibold">Additional rules</h3>
            <p className="text-muted-foreground">
              {editing
                ? otherHouseRules
                  ? otherHouseRules
                  : "No additional rules"
                : fetchedProperty?.otherHouseRules
                  ? fetchedProperty.otherHouseRules
                  : "No additional rules"}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
