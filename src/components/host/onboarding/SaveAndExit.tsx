import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { useRouter } from "next/router";

export default function SaveAndExit() {
  const router = useRouter();
  const resetSession = useHostOnboarding((state) => state.resetSession);
  const setProgress = useHostOnboarding((state) => state.setProgress);
  const { listing } = useHostOnboarding((state) => state);

  const { mutate } = api.properties.create.useMutation({
    onSuccess: () => {
      resetSession();
      toast({
        title: "Property saved to drafts!",
        description: "Your property was successfully drafted",
      });
      setProgress(0);
      void router.push("/host/properties");
    },
    onError: () => {
      toast({
        title: "Missing essential information",
        description:
          "Please add an address in Step 3 and click 'Next' before saving and exiting.",
      });
    },
  });

  function handleSaveAndExit() {
    mutate({
      propertyType: listing.propertyType,
      roomType: listing.spaceType,
      maxNumGuests: listing.maxGuests,
      numBeds: listing.beds,
      numBedrooms: listing.bedrooms,
      numBathrooms: listing.bathrooms,
      address: `${listing.location.street}${
        listing.location.apt ? `, ${listing.location.apt}` : ""
      }, ${listing.location.city}, ${listing.location.state} ${listing.location.zipcode}, ${
        listing.location.country
      }`,
      additionalCheckInInfo: listing.checkInType,
      checkInTime: listing.checkIn,
      checkOutTime: listing.checkOut,
      amenities: listing.amenities,
      otherAmenities: listing.otherAmenities,
      imageUrls: listing.imageUrls,
      name: listing.title,
      about: listing.description,
      petsAllowed: listing.petsAllowed,
      smokingAllowed: listing.smokingAllowed,
      otherHouseRules: listing.otherHouseRules ?? undefined,
      status: "Drafted",
      cancellationPolicy: listing.cancellationPolicy,
    });
  }

  return (
    <div className="container mt-5 flex w-full justify-end">
      <Button onClick={handleSaveAndExit} variant={"outlineLight"}>
        Save & Exit
      </Button>
    </div>
  );
}
