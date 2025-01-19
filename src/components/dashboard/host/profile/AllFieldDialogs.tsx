import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProfileField } from "@/components/dashboard/host/profile/ProfileField";
import { EditFieldDialog } from "@/components/dashboard/host/profile/EditFieldDialog";
import {
  fieldConfig,
  FieldConfig,
} from "@/components/dashboard/host/profile/fieldConfig";
import { ChevronRight } from "lucide-react";
import type { RouterOutputs } from "@/utils/api";

type MyUserWProfile = RouterOutputs["users"]["getMyUserWProfile"];
type ProfileData = {
  [K in keyof FieldConfig]: string | null;
};
function AllFieldDialogs({
  myUserWProfile,
}: {
  myUserWProfile: MyUserWProfile | undefined;
}) {
  const [activeField, setActiveField] = useState<keyof FieldConfig | null>(
    null,
  );

  const profileData = useMemo(() => {
    if (!myUserWProfile) return {} as ProfileData;
    return Object.keys(fieldConfig).reduce((acc, key) => {
      const value = myUserWProfile[key as keyof MyUserWProfile];
      acc[key as keyof FieldConfig] = typeof value === "string" ? value : null;
      return acc;
    }, {} as ProfileData);
  }, [myUserWProfile]);

  const handleUpdateField = (
    field: keyof FieldConfig,
    value: string | boolean | null,
  ) => {
    // const newValue = field === "showBirthDecade" ? value === "true" : value;
    // The user profile will be updated in the form when submitted
    // This function is only responsible for rendering the form
  };

  if (!myUserWProfile) return <div> no load </div>;

  return (
    <div className="mx-2 space-y-8">
      <div className="mt-8">
        <h1 className="mx-2 mb-6 text-3xl font-bold">Your profile</h1>
        <div className="grid gap-2 md:grid-cols-2">
          {Object.entries(fieldConfig).map(([field, config]) => (
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
                value={profileData[field as keyof FieldConfig] ?? undefined}
                onClick={() => setActiveField(field as keyof FieldConfig)}
              />
              {field === "location" && (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Field Dialog */}
      {/* Edit Field Dialog */}
      {activeField && typeof profileData[activeField] !== "boolean" && (
        <EditFieldDialog
          open={true}
          onOpenChange={(open) => !open && setActiveField(null)}
          title={fieldConfig[activeField].title}
          description={fieldConfig[activeField].description}
          value={profileData[activeField]}
          onChange={(value) => handleUpdateField(activeField, value)}
        />
      )}

      <div>
        <h2 className="mb-4 text-xl font-semibold">About you</h2>
        <Textarea
          placeholder="Write something fun and punchy."
          className="min-h-[100px]"
          value={profileData.biography ? profileData.biography : undefined}
          onChange={(e) => handleUpdateField("biography", e.target.value)}
        />
        <Button variant="outline" className="mt-2">
          Add intro
        </Button>
      </div>
    </div>
  );
}

export default AllFieldDialogs;
