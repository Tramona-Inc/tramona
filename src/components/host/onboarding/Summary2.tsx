import { useHostOnboarding } from "@/utils/store/host-onboarding";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dot, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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

  function Total({
    name,
    total,
    setTotal,
  }: {
    name: string;
    total: number;
    setTotal: (total: number) => void;
  }) {
    return (
      <div className="flex flex-row items-center justify-between border-b-2 p-1">
        <h1 className="font-semibold">{name}</h1>
        <div className="grid max-w-[150px] grid-cols-3 place-items-center">
          <Button
            variant="increment"
            className="text-4xl"
            size={"icon"}
            onClick={() => {
              if (total - 1 > 0) {
                setTotal(total - 1);
              }
            }}
          >
            <Minus color="gray" />
          </Button>
          <div className="text-lg font-semibold">{total}</div>
          <Button
            variant="increment"
            className="text-4xl"
            size={"icon"}
            onClick={() => {
              setTotal(total + 1);
            }}
          >
            <Plus color="gray" />
          </Button>
        </div>
      </div>
    );
  }

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
                <Button variant="outline">Edit your living situation</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                {spaceTypeOptions.map((item) => (
                  <DropdownMenuItem
                    key={item.title}
                    onClick={() => setSpaceType(item.id)}
                    className="cursor-pointer p-1"
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
    </>
  );
}
