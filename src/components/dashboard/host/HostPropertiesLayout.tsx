import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grid, Pencil, Plus, PlusIcon, Search } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/router";

export default function HostPropertiesLayout({
  children,
}: React.PropsWithChildren) {
  // const [open, setOpen] = useState(false);
  const router = useRouter();

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

  const setProgress = useHostOnboarding((state) => state.setProgress);

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

  const listedProperties = properties?.filter(
    (property) => property.propertyStatus === "Listed",
  );
  const archivedProperties = properties?.filter(
    (property) => property.propertyStatus === "Archived",
  );
  const draftedProperties = properties?.filter(
    (property) => property.propertyStatus === "Drafted",
  );

  return (
    <section className="mx-auto mb-24 mt-7 max-w-7xl px-6 md:my-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-bold md:text-4xl">Your properties</h1>
        <div className="flex items-center justify-center gap-4 lg:justify-start">
          <Button
            size="icon"
            className="rounded-full bg-white font-bold text-black shadow-xl"
          >
            <Search strokeWidth={2} />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-white font-bold text-black shadow-xl"
          >
            <Grid strokeWidth={2} />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-white font-bold text-black shadow-xl"
            onClick={() => {
              setStatesDefault();
              void router.push("/host-onboarding");
            }}
          >
            <Plus strokeWidth={2} />
          </Button>
        </div>
      </div>

      <Tabs className="mt-6" defaultValue="listed">
        <TabsList>
          <TabsTrigger value="listed">Listed</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="listed">
          <HostProperties properties={listedProperties ?? null} />
        </TabsContent>
        <TabsContent value="drafts">
          <HostProperties properties={draftedProperties ?? null} />
        </TabsContent>
        <TabsContent value="archived">
          <HostProperties properties={archivedProperties ?? null} />
        </TabsContent>
      </Tabs>
    </section>
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
