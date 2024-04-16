import { useHostOnboarding } from "@/utils/store/host-onboarding";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Dot } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Total } from "./Onboarding3";
import { options as spaceTypeOptions } from "./Onboarding3";

export default function Summary2() {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { listing } = useHostOnboarding((state) => state);

  const setSpaceType = useHostOnboarding((state) => state.setSpaceType);

  const maxGuests = useHostOnboarding((state) => state.listing.maxGuests);
  const setMaxGuests = useHostOnboarding((state) => state.setMaxGuests);

  const bedrooms = useHostOnboarding((state) => state.listing.bedrooms);
  const setBedrooms = useHostOnboarding((state) => state.setBedrooms);

  const beds = useHostOnboarding((state) => state.listing.beds);
  const setBeds = useHostOnboarding((state) => state.setBeds);

  const bathrooms = useHostOnboarding((state) => state.listing.bathrooms);
  const setBathrooms = useHostOnboarding((state) => state.setBathrooms);

  return (
    <>
      <div className="flex flex-col gap-3 py-5">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Living Situation</h3>
          <p
            className="text-sm underline transition duration-200 hover:cursor-pointer hover:text-muted-foreground"
            onClick={() => {
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? "Finish Editing" : "Edit"}
          </p>
        </div>

        <div className="flex flex-col gap-2 capitalize text-muted-foreground">
          <p className="capitalize ">{listing.spaceType}</p>
          <div className="flex flex-row lowercase">
            {listing.maxGuests} {listing.maxGuests > 1 ? " guests" : " guest"}{" "}
            <Dot />
            {listing.bedrooms} {listing.bedrooms > 1 ? " bedrooms" : " bedroom"}{" "}
            <Dot />
            {listing.beds} {listing.beds > 1 ? " beds" : " bed"} <Dot />
            {listing.bathrooms}{" "}
            {listing.bathrooms > 1 ? " bathrooms" : " bathroom"}
          </div>
        </div>
        {isEditing && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Select your living situation</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {spaceTypeOptions.map((item) => (
                  <DropdownMenuItem
                    key={item.title}
                    onClick={() => setSpaceType(item.id)}
                  >
                    {item.id}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Total
              name={"Maximum guests"}
              total={maxGuests}
              setTotal={setMaxGuests}
            />

            <Total name={"Bedrooms"} total={bedrooms} setTotal={setBedrooms} />

            <Total name={"Beds"} total={beds} setTotal={setBeds} />

            <Total
              name={"Bathrooms"}
              total={bathrooms}
              setTotal={setBathrooms}
            />
          </>
        )}
      </div>
      {/* </Heading> */}
    </>
  );
}
