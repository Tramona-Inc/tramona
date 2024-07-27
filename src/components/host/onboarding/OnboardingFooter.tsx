import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { useRouter } from "next/router";
import { useState } from "react";

type OnboardingFooterProps = {
  handleNext?: () => void;
  isFormValid?: boolean; // New prop to indicate whether the form is valid
  isForm: boolean;
  handleError?: () => void;
  onClick?: () => void;
};

export default function OnboardingFooter({
  handleNext,
  isFormValid = false, // Default value is false
  isForm,
  handleError,
  onClick
}: OnboardingFooterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const max_pages = 10;

  const progress = useHostOnboarding((state) => state.progress);
  const isEdit = useHostOnboarding((state) => state.isEdit);
  const setIsEdit = useHostOnboarding((state) => state.setIsEdit);
  const resetSession = useHostOnboarding((state) => state.resetSession);
  const setProgress = useHostOnboarding((state) => state.setProgress);
  const { listing } = useHostOnboarding((state) => state);
  // const { hostaway } = useHostOnboarding((state) => state);

  const router = useRouter();

  const { mutateAsync: createHostProfile } =
    api.users.createHostProfile.useMutation();

  const { data: isHost } = api.users.isHost.useQuery();

  const { mutateAsync: createProperty } = api.properties.create.useMutation({
    onSuccess: () => {
      resetSession();
      toast({
        title: "Property listed!",
        description: "Your property was successfully listed",
      });
      setProgress(0);
      void router.push("/host/properties");
    },
  });

  async function onPressNext() {
    setIsLoading(true);
    try {
      if (progress === 9) {
        if (!isHost) {
          await createHostProfile({});
        }

        await createProperty({
          propertyType: listing.propertyType,
          roomType: listing.spaceType,
          maxNumGuests: listing.maxGuests,
          numBeds: listing.beds,
          numBedrooms: listing.bedrooms,
          numBathrooms: listing.bathrooms,
          address:
            listing.location.street +
            ", " +
            listing.location.city +
            ", " +
            listing.location.apt +
            " " +
            listing.location.state +
            " " +
            listing.location.zipcode +
            ", " +
            listing.location.country,
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
          otherHouseRules: listing.otherHouseRules ?? undefined,
        });
      } else {
        if (isEdit) {
          if (isForm) {
            if (isFormValid) {
              handleNext && handleNext();
              setIsEdit(false);
              setProgress(9);
            } else {
              handleError && handleError();
            }
          } else {
            setIsEdit(false);
            setProgress(9);
          }
        } else {
          if (isForm) {
            if (isFormValid) {
              handleNext && handleNext();
              setProgress(progress + 1);
            } else {
              handleError && handleError();
            }
          } else {
            setProgress(progress + 1);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="sticky bottom-0 bg-white">
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
        {isEdit ? (
          <Button onClick={onPressNext}>Back to summary</Button>
        ) : (
          <div className="flex flex-row gap-2">
            {progress === 0 && 
          <Button className="flex" onClick={onClick}>
            Next
          </Button>
          }
          <Button onClick={onPressNext} disabled={isLoading}>
            {progress === 0
              ? "Get Started"
              : progress === 8
                ? "Review"
                : progress === 9
                  ? "Finish"
                  : "Next"}
          </Button>
          </div>
        )}
      </div>
    </div>
  );
}
