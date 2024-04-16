import { Input } from "@/components/ui/input";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { useState } from "react";

export default function Summary7() {
  const [isEditing, setIsEditing] = useState(false);

  const { listing } = useHostOnboarding((state) => state);

  const title = useHostOnboarding((state) => state.listing.title);
  const setTitle = useHostOnboarding((state) => state.setTitle);

  const description = useHostOnboarding((state) => state.listing.description);
  const setDescription = useHostOnboarding((state) => state.setDescription);

  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Describe Your Listing</h3>
        <p
          className="text-sm underline transition duration-200 hover:cursor-pointer hover:text-muted-foreground"
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "Finish Editing" : "Edit"}
        </p>
      </div>

      <div className="flex flex-col gap-2 text-muted-foreground">
        <h2 className="font-semibold text-primary">
          {isEditing ? "Edit Title" : "Title"}
        </h2>
        {isEditing ? (
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <p className="capitalize">{listing.title}</p>
        )}
        <h2 className="font-semibold text-primary">
          {isEditing ? "Edit Description" : "Description"}
        </h2>
        {isEditing ? (
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        ) : (
          <p>{listing.description}</p>
        )}
      </div>
    </div>
  );
}
