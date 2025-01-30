import { Button } from "@/components/ui/button";
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
import ExpandableSearchBar from "@/components/_common/ExpandableSearchBar";
import { useEffect, useRef, useState } from "react";
import HostPropertiesSidebar from "./HostPropertiesSidebar";
import { cn } from "@/utils/utils";
import HostPropertyInfo from "./HostPropertyInfo";
import useSetInitialHostTeamId from "@/components/_common/CustomHooks/useSetInitialHostTeamId";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";

import supabase from "@/utils/supabase-client";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";

export default function HostPropertiesLayout() {
  useSetInitialHostTeamId();
  const { currentHostTeamId } = useHostTeamStore();
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property>();
  const [open, setOpen] = useState(false);

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

  const { data: properties, refetch } =
    api.properties.getHostProperties.useQuery(
      { currentHostTeamId: currentHostTeamId! },
      {
        enabled: !!currentHostTeamId,
      },
    );

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

  // < -------------- LOGIC FOR SYNCING HOSPITABLE Properties loading state -------->
  const [showIsSyncingState, setShowIsSyncingState] = useState(false);
  const timeoutRef = useRef<number | null>(null); // Use useRef to store the timeout ID

  useEffect(() => {
    const subscription = supabase
      .channel("properties-insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "properties" },
        (payload) => {
          if (payload.new.host_team_id === currentHostTeamId) {
            console.log(
              "New property added within a minute for the current team:",
              payload.new.host_team_id,
            );
            setShowIsSyncingState(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Set a timeout to reset showIsSyncingState after 30 seconds
            timeoutRef.current = window.setTimeout(() => {
              setShowIsSyncingState(false);
            }, 30000); // 30 seconds

            // refetch properties
            void refetch();
          }
        },
      )
      .subscribe((status) => {
        console.log("supabase status:", status);
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          console.log("Listening for new properties...");
        } else {
          setShowIsSyncingState(false);
        }
      });

    return () => {
      void subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear timeout on unmount
      }
    };
  }, [currentHostTeamId, refetch]);

  return (
    <section className="relative mx-auto mb-24 mt-7 max-w-8xl px-6 md:my-14">
      <HostPropertiesSidebar
        onClose={() => setOpen(false)}
        className={cn("", !open && "hidden")}
      >
        {selectedProperty && <HostPropertyInfo property={selectedProperty} />}
      </HostPropertiesSidebar>
      <div className="flex items-center gap-4 sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-semibold md:text-4xl">Your Properties</h1>
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* <ExpandableSearchBar
            className="hidden sm:flex"
            onSearchResultsUpdate={handleSearchResults}
            onExpandChange={setIsSearchExpanded}
          /> */}
          {/* <Button
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
          </Button> */}
        </div>
      </div>
      <ExpandableSearchBar
        currentHostTeamId={currentHostTeamId}
        className="pt-4 sm:hidden"
        onSearchResultsUpdate={handleSearchResults}
        onExpandChange={setIsSearchExpanded}
      />
      {isSearchExpanded ? (
        <HostProperties
          properties={searchResults}
          onSelectedProperty={handleSelectedProperty}
          searched
          showIsSyncingState={showIsSyncingState}
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
              showIsSyncingState={showIsSyncingState}
            />
          </TabsContent>
          <TabsContent value="drafts">
            <HostProperties
              properties={draftedProperties ?? null}
              onSelectedProperty={handleSelectedProperty}
              showIsSyncingState={showIsSyncingState}
            />
          </TabsContent>
          <TabsContent value="archived">
            <HostProperties
              properties={archivedProperties ?? null}
              onSelectedProperty={handleSelectedProperty}
              showIsSyncingState={showIsSyncingState}
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
      setCheckInType(fetchedProperty.additionalCheckInInfo ?? "self");
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
    <div className="z-40 flex flex-row gap-x-2 sm:absolute sm:right-4 sm:top-0 sm:gap-x-2">
      {editing ? (
        <>
          <Button
            variant="outline"
            className="text-sm shadow-lg sm:shadow-none"
            onClick={() => setEditing(!editing)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            // variant="outline"
            className="text-sm shadow-lg sm:shadow-none"
            onClick={() => {
              setEditing(!editing);
              onSubmit?.();
            }}
            type="button"
          >
            Done
          </Button>
        </>
      ) : (
        <Button
          // variant="outline"
          className="text-sm"
          onClick={handleEditClick}
          // type="button"
          disabled={disabled}
        >
          Edit
        </Button>
      )}
    </div>
  );
}
