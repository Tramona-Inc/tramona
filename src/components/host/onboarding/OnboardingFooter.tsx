import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ALL_PROPERTY_ROOM_TYPES,
  ALL_PROPERTY_TYPES,
} from "@/server/db/schema";
import { ALL_PROPERTY_AMENITIES } from "@/server/db/schema/tables/propertyAmenities";
import { api } from "@/utils/api";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { z } from "zod";

export const hostPropertyOnboardingSchema = z.object({
  propertyType: z.enum(ALL_PROPERTY_TYPES),
  roomType: z.enum(ALL_PROPERTY_ROOM_TYPES),

  maxNumGuests: z.number(),
  numBeds: z.number(),
  numBedrooms: z.number(),
  numBathrooms: z.number(),

  address: z.string().max(1000),

  checkInInfo: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),

  amenities: z.array(z.enum(ALL_PROPERTY_AMENITIES)),

  otherAmenities: z.string().array(),

  imageUrls: z.string().array(),
  name: z.string().max(255),
  about: z.string(),

  petsAllowed: z.boolean().optional(),
  smokingAllowed: z.boolean().optional(),

  otherHouseRules: z.string().max(1000).optional(),
});

type OnboardingFooterProps = {
  handleNext?: () => void;
  isFormValid?: boolean; // New prop to indicate whether the form is valid
  isForm: boolean;
};

export default function OnboardingFooter({
  handleNext,
  isFormValid = false, // Default value is false
  isForm,
}: OnboardingFooterProps) {
  const max_pages = 10;

  const progress = useHostOnboarding((state) => state.progress);
  const setProgress = useHostOnboarding((state) => state.setProgress);
  const { listing } = useHostOnboarding((state) => state);

  const { mutate } = api.properties.hostInsertOnboardingProperty.useMutation();

  function onPressNext() {
    if (progress === 9) {
      console.log("HIT");
      mutate({
        propertyType: listing.propertyType,
        roomType: listing.spaceType,
        maxNumGuests: listing.maxGuests,
        numBeds: listing.beds,
        numBedrooms: listing.bedrooms,
        numBathrooms: listing.bathrooms,
        address:
          listing.location.street +
          listing.location.city +
          listing.location.apt +
          listing.location.state +
          listing.location.zipcode,
        checkInInfo: listing.checkInType,
        checkInTime: listing.checkIn,
        checkOutTime: listing.checkOut,
        amenities: listing.amenities,
        otherAmenities: listing.otherAmenities,
        imageUrls: listing.imageUrls,
        name: listing.title,
        about: listing.description,
        petsAllowed: listing.petsAllowed,
        smokingAllowed: listing.smokingAllowed,
        otherHouseRules: listing.otherHouseRules,
      });
    } else {
      if (isFormValid) {
        handleNext && handleNext(); // Call handleNext only if it exists
        setProgress(progress + 1);
      }
      if (!isForm) {
        setProgress(progress + 1);
      }
    }
  }

  return (
    <>
      <Progress
        value={(progress * 100) / max_pages}
        className="h-2 w-full rounded-none"
      />
      <div className="flex justify-between p-5">
        <Button
          variant={"ghost"}
          onClick={() => {
            if (progress - 1 > -1) {
              setProgress(progress - 1);
            }
          }}
        >
          Back
        </Button>
        <Button onClick={onPressNext}>
          {progress > 0 ? "Next" : "Get Started"}
        </Button>
      </div>
    </>
  );
}
