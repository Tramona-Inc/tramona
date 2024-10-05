import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, PlusIcon } from "lucide-react";
import HostProperties from "./HostProperties";
import Link from "next/link";
import {
  type LocationType,
  useHostOnboarding,
} from "@/utils/store/host-onboarding";
import { api } from "@/utils/api";
import {
  CancellationPolicyWithInternals,
  type Property,
} from "@/server/db/schema/tables/properties";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HostPropertiesLayout({
  children,
}: React.PropsWithChildren) {
  // const [open, setOpen] = useState(false);

  const setPropertyType = useHostOnboarding((state) => state.setPropertyType);
  const setMaxGuests = useHostOnboarding((state) => state.setMaxGuests);
  const setBedrooms = useHostOnboarding((state) => state.setBedrooms);
  const setBeds = useHostOnboarding((state) => state.setBeds);
  const setBathrooms = useHostOnboarding((state) => state.setBathrooms);
  const setSpaceType = useHostOnboarding((state) => state.setSpaceType);
  const setLocation = useHostOnboarding((state) => state.setLocation);
  const setCheckInType = useHostOnboarding((state) => state.setCheckInType);
  const setOtherCheckInType = useHostOnboarding(
    (state) => state.setOtherCheckInType,
  );
  const setCheckIn = useHostOnboarding((state) => state.setCheckIn);
  const setCheckOut = useHostOnboarding((state) => state.setCheckOut);
  const setAmenities = useHostOnboarding((state) => state.setAmenities);
  const setOtherAmenities = useHostOnboarding(
    (state) => state.setOtherAmenities,
  );
  const setImageUrls = useHostOnboarding((state) => state.setImageUrls);
  const setTitle = useHostOnboarding((state) => state.setTitle);
  const setDescription = useHostOnboarding((state) => state.setDescription);
  const setPetsAllowed = useHostOnboarding((state) => state.setPetsAllowed);
  const setSmokingAllowed = useHostOnboarding(
    (state) => state.setSmokingAllowed,
  );
  const setOtherHouseRules = useHostOnboarding(
    (state) => state.setOtherHouseRules,
  );
  const setOriginalListingId = useHostOnboarding(
    (state) => state.setOriginalListingId,
  );

  function setStatesDefault() {
    setPropertyType("Apartment"),
      setMaxGuests(1),
      setBedrooms(1),
      setBeds(1),
      setBathrooms(1),
      setSpaceType("Entire place"),
      setLocation({
        street: "",
        apt: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
      }),
      setCheckInType("self"),
      setOtherCheckInType(false),
      setCheckIn("00:00"),
      setCheckOut("00:00"),
      setAmenities([]),
      setOtherAmenities([]),
      setImageUrls([]),
      setTitle(""),
      setDescription(""),
      setPetsAllowed(false),
      setSmokingAllowed(false),
      setOtherHouseRules(""),
      setOriginalListingId("");
  }

  const { data: properties } = api.properties.getHostProperties.useQuery();
  const { data: user } = api.users.getUser.useQuery();
  const { data: mainHostProperties } =
    api.properties.getMainHostProperties.useQuery({
      mainHostId: user?.mainHostId ?? "",
    });

  const listedProperties = user?.mainHostId
    ? mainHostProperties?.filter(
        (property) => property.propertyStatus === "Listed",
      )
    : properties?.filter((property) => property.propertyStatus === "Listed");
  const archivedProperties = user?.mainHostId
    ? mainHostProperties?.filter(
        (property) => property.propertyStatus === "Archived",
      )
    : properties?.filter((property) => property.propertyStatus === "Archived");
  const draftedProperties = user?.mainHostId
    ? mainHostProperties?.filter(
        (property) => property.propertyStatus === "Drafted",
      )
    : properties?.filter((property) => property.propertyStatus === "Drafted");

  return (
    <div className="flex">
      <div className="sticky top-20 h-screen-minus-header-n-footer w-full overflow-auto border-r px-4 py-8 xl:w-96">
        <ScrollArea>
          <h1 className="text-3xl font-bold">Properties</h1>
          <div className="my-4 flex gap-4">
            <Link href="/host-onboarding">
              <Button
                variant="secondaryLight"
                className="font-semi bg-white"
                onClick={() => {
                  setStatesDefault();
                }}
              >
                <PlusIcon />
                New Listing
              </Button>
            </Link>
            {/* for when user is cohosting for multiple hosts */}
            {/* <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a host" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="host-1">host 1</SelectItem>
                <SelectItem value="host-2">host 2</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="listed">
              <AccordionTrigger>
                Listed{" "}
                <span className="text-muted-foreground">
                  {listedProperties?.length}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <HostProperties properties={listedProperties ?? null} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="drafts">
              <AccordionTrigger>
                Drafts{" "}
                <span className="text-muted-foreground">
                  {draftedProperties?.length}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <HostProperties properties={draftedProperties ?? null} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="archive">
              <AccordionTrigger>
                Archives{" "}
                <span className="text-muted-foreground">
                  {archivedProperties?.length}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <HostProperties properties={archivedProperties ?? null} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>
      <div className="hidden flex-1 xl:block">
        {children ? (
          <div className="mx-auto my-8 min-h-screen-minus-header-n-footer max-w-4xl rounded-2xl border">
            <div className="grid grid-cols-1">{children}</div>
          </div>
        ) : (
          <div className="hidden sm:block">
            <div className="flex min-h-screen-minus-header-n-footer items-center justify-center">
              <p className="font-medium text-muted-foreground">
                Select a property to view more details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function HostPropertyEditBtn({
  editing,
  setEditing,
  onSubmit,
  property,
}: {
  editing: boolean;
  setEditing: (editing: boolean) => void;
  onSubmit?: () => void;
  property: Property;
}) {
  const setPropertyType = useHostOnboarding((state) => state.setPropertyType);
  const setMaxGuests = useHostOnboarding((state) => state.setMaxGuests);
  const setBedrooms = useHostOnboarding((state) => state.setBedrooms);
  const setBeds = useHostOnboarding((state) => state.setBeds);
  const setBathrooms = useHostOnboarding((state) => state.setBathrooms);
  const setSpaceType = useHostOnboarding((state) => state.setSpaceType);
  const setLocation = useHostOnboarding((state) => state.setLocation);
  const setCheckInType = useHostOnboarding((state) => state.setCheckInType);
  const setCheckIn = useHostOnboarding((state) => state.setCheckIn);
  const setCheckOut = useHostOnboarding((state) => state.setCheckOut);
  const setAmenities = useHostOnboarding((state) => state.setAmenities);
  const setOtherAmenities = useHostOnboarding(
    (state) => state.setOtherAmenities,
  );
  const setImageUrls = useHostOnboarding((state) => state.setImageUrls);
  const setTitle = useHostOnboarding((state) => state.setTitle);
  const setDescription = useHostOnboarding((state) => state.setDescription);
  const setPetsAllowed = useHostOnboarding((state) => state.setPetsAllowed);
  const setSmokingAllowed = useHostOnboarding(
    (state) => state.setSmokingAllowed,
  );
  const setOtherHouseRules = useHostOnboarding(
    (state) => state.setOtherHouseRules,
  );
  const setCancellationPolicy = useHostOnboarding(
    (state) => state.setCancellationPolicy,
  );

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

  const handleEditClick = () => {
    setPropertyType(property.propertyType);
    setMaxGuests(property.maxNumGuests);
    setBedrooms(property.numBedrooms);
    setBeds(property.numBeds);
    property.numBathrooms && setBathrooms(property.numBathrooms);
    setSpaceType(property.roomType);
    setLocation(
      property.address.split(", ").length > 4
        ? addressWithApt
        : addressWithoutApt,
    );
    setCheckInType(property.checkInInfo ?? "self");
    setCheckIn(property.checkInTime ?? "00:00");
    setCheckOut(property.checkOutTime ?? "00:00");
    setAmenities(property.amenities);
    setOtherAmenities(property.otherAmenities);
    setImageUrls(property.imageUrls);
    setTitle(property.name);
    setDescription(property.about);
    setPetsAllowed(property.petsAllowed ?? false);
    setSmokingAllowed(property.smokingAllowed ?? false);
    setOtherHouseRules(property.otherHouseRules ?? "");
    setEditing(!editing);
    setCancellationPolicy(
      property.cancellationPolicy as CancellationPolicyWithInternals | null,
    );
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 sm:static">
      {editing ? (
        <div className="space-x-2">
          <Button variant="secondary" onClick={() => setEditing(!editing)}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            className="shadow-lg sm:shadow-none"
            onClick={() => {
              setEditing(!editing);
              onSubmit?.();
            }}
            type="button"
          >
            Done
          </Button>
        </div>
      ) : (
        <div className="space-x-2">
          <Button
            variant="secondary"
            className="rounded-full bg-white font-bold shadow-md sm:rounded-lg sm:border-2 sm:shadow-none"
            onClick={handleEditClick}
            type="button"
          >
            <Pencil size={20} />
            Enter edit mode
          </Button>
        </div>
      )}
    </div>
  );
}
