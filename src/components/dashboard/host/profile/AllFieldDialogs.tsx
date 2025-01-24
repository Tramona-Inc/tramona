import { useState, useCallback, useEffect } from "react";
import { ProfileField } from "@/components/dashboard/host/profile/ProfileField";
import { EditFieldDialog } from "@/components/dashboard/host/profile/EditFieldDialog";
import {
  fieldConfig,
  FieldConfig,
} from "@/components/dashboard/host/profile/fieldConfig";
import { ChevronRight } from "lucide-react";
import type { RouterOutputs } from "@/utils/api";
import EditBooleanFieldDialog from "./EditFieldDialogBoolean";
import AboutYouInput from "./AboutYouInput";
import { FieldLoadingState } from "./FieldLoadingState";

export type MyUserWProfile = RouterOutputs["users"]["getMyUserWProfile"];

function AllFieldDialogs({
  myUserWProfile,
  role,
}: {
  myUserWProfile: MyUserWProfile | undefined;
  role: string;
}) {
  const [activeField, setActiveField] = useState<keyof FieldConfig | null>(
    null,
  );

  const [profileData, setProfileData] = useState<MyUserWProfile | undefined>(
    () => myUserWProfile,
  );

  useEffect(() => {
    setProfileData(myUserWProfile);
  }, [myUserWProfile]);

  console.log(profileData);

  const handleUpdateField = useCallback(
    (
      field: keyof MyUserWProfile,
      value: MyUserWProfile[keyof MyUserWProfile],
    ) => {
      setProfileData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [setProfileData],
  );

  const travelerFieldConfig = Object.entries(fieldConfig).filter(
    ([field]) => field !== "forGuests",
  );

  return (
    <div className="mx-2 space-y-8">
      <div className="mt-8">
        <h1 className="mx-2 mb-6 text-3xl font-bold">Your profile</h1>
        {myUserWProfile ? (
          <div className="grid gap-2 md:grid-cols-2">
            {(role === "host"
              ? Object.entries(fieldConfig)
              : travelerFieldConfig
            ).map(([field, config]) => {
              return (
                <div
                  key={field}
                  className={
                    field === "location"
                      ? "flex items-center justify-between rounded-lg p-4 hover:bg-muted/50"
                      : undefined
                  }
                >
                  <ProfileField
                    icon={config.icon}
                    label={config.label}
                    value={
                      profileData?.[
                        field as keyof MyUserWProfile
                      ]?.toString() ?? undefined
                    }
                    onClick={() => setActiveField(field as keyof FieldConfig)}
                  />
                  {field === "location" && (
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <FieldLoadingState />
        )}
      </div>

      {/* Edit Field Dialog */}
      {activeField &&
        profileData &&
        (activeField === "showBirthDecade" ? (
          <EditBooleanFieldDialog
            open={true}
            onOpenChange={(open) => !open && setActiveField(null)}
            title={fieldConfig[activeField].title || ""}
            description={fieldConfig[activeField].description || ""}
            value={profileData.showBirthDecade}
          />
        ) : (
          <EditFieldDialog
            open={true}
            onOpenChange={(open) => !open && setActiveField(null)}
            title={fieldConfig[activeField].title || ""}
            description={fieldConfig[activeField].description || ""}
            value={profileData[activeField]}
            activeFieldConfig={activeField}
          />
        ))}

      <AboutYouInput myUserWProfile={profileData} />
    </div>
  );
}

export default AllFieldDialogs;
