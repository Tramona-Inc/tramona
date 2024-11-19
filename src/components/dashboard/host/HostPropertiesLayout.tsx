import { Button } from "@/components/ui/button";
import { Grid, Pencil, Plus } from "lucide-react";
import HostProperties from "./HostProperties";
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
import ExpandableSearchBar from "@/components/_common/ExpandableSearchBar";
import { useEffect, useState } from "react";
import HostPropertiesSidebar from "./HostPropertiesSidebar";
import { cn } from "@/utils/utils";
import HostPropertyInfo from "./HostPropertyInfo";

export default function HostPropertiesLayout() {
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property>();
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const setProgress = useHostOnboarding((state) => state.setProgress);

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
    setProgress(0);
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
    (property) => property.status === "Listed",
  );
  const archivedProperties = properties?.filter(
    (property) => property.status === "Archived",
  );
  const draftedProperties = properties?.filter(
    (property) => property.status === "Drafted",
  );

  const handleSearchResults = (results: Property[]) => {
    setSearchResults(results);
  };

  const handleSelectedProperty = (property: Property) => {
    setSelectedProperty(property);
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [open]);

  return (
    <section className="relative mx-auto mb-24 mt-7 max-w-7xl px-6 md:my-14">
      <HostPropertiesSidebar
        onClose={() => setOpen(false)}
        className={cn(!open && "hidden")}
      >
        {selectedProperty && <HostPropertyInfo property={selectedProperty} />}
      </HostPropertiesSidebar>
      <div className="flex items-center gap-4 sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-bold md:text-4xl">Your properties</h1>
        <div className="flex flex-1 items-center justify-end gap-4">
          <ExpandableSearchBar
            className="hidden sm:flex"
            onSearchResultsUpdate={handleSearchResults}
            onExpandChange={setIsSearchExpanded}
          />
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
      <ExpandableSearchBar
        className="pt-4 sm:hidden"
        onSearchResultsUpdate={handleSearchResults}
        onExpandChange={setIsSearchExpanded}
      />
      {isSearchExpanded ? (
        <HostProperties
          properties={searchResults}
          onSelectedProperty={handleSelectedProperty}
          searched
        />
      ) : (
        <Tabs className="mt-6" defaultValue="listed">
          <TabsList>
            <TabsTrigger value="listed">Listed</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="listed">
            <HostProperties
              properties={listedProperties ?? null}
              onSelectedProperty={handleSelectedProperty}
            />
          </TabsContent>
          <TabsContent value="drafts">
            <HostProperties
              properties={draftedProperties ?? null}
              onSelectedProperty={handleSelectedProperty}
            />
          </TabsContent>
          <TabsContent value="archived">
            <HostProperties
              properties={archivedProperties ?? null}
              onSelectedProperty={handleSelectedProperty}
            />
          </TabsContent>
        </Tabs>
      )}
    </section>
  );
}

export function HostPropertyEditBtn({
  editing,
  setEditing,
  onSubmit,
  property,
  disabled,
}: {
  editing: boolean;
  setEditing: (editing: boolean) => void;
  onSubmit?: () => void;
  property: Property;
  disabled?: boolean;
}) {
  const { data: fetchedProperty, refetch } = api.properties.getById.useQuery({
    id: property.id,
  });

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
    country: fetchedProperty?.address.split(", ")[4] ?? "",
    street: fetchedProperty?.address.split(", ")[0] ?? "",
    apt: fetchedProperty?.address.split(", ")[1] ?? "",
    city: fetchedProperty?.address.split(", ")[2] ?? "",
    state: fetchedProperty?.address.split(", ")[3]?.split(" ")[0] ?? "",
    zipcode: fetchedProperty?.address.split(", ")[3]?.split(" ")[1] ?? "",
  };

  const addressWithoutApt: LocationType = {
    country: fetchedProperty?.address.split(", ")[3] ?? "",
    street: fetchedProperty?.address.split(", ")[0] ?? "",
    apt: "",
    city: fetchedProperty?.address.split(", ")[1] ?? "",
    state: fetchedProperty?.address.split(", ")[2]?.split(" ")[0] ?? "",
    zipcode: fetchedProperty?.address.split(", ")[2]?.split(" ")[1] ?? "",
  };

  const handleEditClick = () => {
    void refetch();
    if (fetchedProperty) {
      setPropertyType(fetchedProperty.propertyType);
      setMaxGuests(fetchedProperty.maxNumGuests);
      setBedrooms(fetchedProperty.numBedrooms);
      setBeds(fetchedProperty.numBeds);
      fetchedProperty.numBathrooms &&
        setBathrooms(fetchedProperty.numBathrooms);
      setSpaceType(fetchedProperty.roomType);
      setLocation(
        fetchedProperty.address.split(", ").length > 4
          ? addressWithApt
          : addressWithoutApt,
      );
      setCheckInType(fetchedProperty.checkInInfo ?? "self");
      setCheckIn(fetchedProperty.checkInTime);
      setCheckOut(fetchedProperty.checkOutTime);
      setAmenities(fetchedProperty.amenities);
      setOtherAmenities(fetchedProperty.otherAmenities);
      setImageUrls(fetchedProperty.imageUrls);
      setTitle(fetchedProperty.name);
      setDescription(fetchedProperty.about);
      setPetsAllowed(fetchedProperty.petsAllowed ?? false);
      setSmokingAllowed(fetchedProperty.smokingAllowed ?? false);
      setOtherHouseRules(fetchedProperty.otherHouseRules ?? "");
      setEditing(!editing);
      setCancellationPolicy(
        fetchedProperty.cancellationPolicy as CancellationPolicyWithInternals | null,
      );
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {editing ? (
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setEditing(!editing)}>
            Cancel
          </Button>
          <Button
            variant="outline"
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
            variant="outline"
            className="rounded-full bg-white font-bold shadow-md sm:rounded-lg sm:border-2 sm:shadow-none"
            onClick={handleEditClick}
            type="button"
            disabled={disabled}
          >
            <Pencil size={20} />
            Enter edit mode
          </Button>
        </div>
      )}
    </div>
  );
}
