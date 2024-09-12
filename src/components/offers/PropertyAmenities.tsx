import {
  TreePalmIcon,
  LandPlotIcon,
  FishIcon,
  FlameKindlingIcon,
  TreeDeciduousIcon,
  MountainSnowIcon,
  MountainIcon,
  CookingPotIcon,
  EggFriedIcon,
} from "lucide-react";

import { type FunctionComponent, type SVGProps } from "react";
import {
  WifiIcon,
  UtensilsIcon,
  Tv2Icon,
  WashingMachineIcon,
  ThermometerSnowflakeIcon,
  ChefHatIcon,
  MicrowaveIcon,
  HeaterIcon,
  DogIcon,
  AccessibilityIcon,
  BathIcon,
  DumbbellIcon,
  CircleParkingIcon,
  CoffeeIcon,
  WavesIcon,
  CrossIcon,
  AlarmSmokeIcon,
} from "lucide-react";
import { useIsSm } from "@/utils/utils";

type LucideIcon = FunctionComponent<SVGProps<SVGSVGElement>>;
type AmenityIcons = Record<string, LucideIcon>;

// prettier-ignore
const amenityIcons: AmenityIcons = {
  "Wireless Internet": WifiIcon,
  "TV": Tv2Icon,
  "Washer": WashingMachineIcon,
  "Cookware": ChefHatIcon,
  "Air conditioning": ThermometerSnowflakeIcon,
  "Dishes and silverware": UtensilsIcon,
  "Microwave": MicrowaveIcon,
  "Breakfast": EggFriedIcon,
  "Kitchen": CookingPotIcon,
  "Heating": HeaterIcon,
  "Pets Allowed": DogIcon,
  "Wheelchair accessible": AccessibilityIcon,
  "Bathtub": BathIcon,
  "Gym": DumbbellIcon,
  "Free parking on street": CircleParkingIcon,
  "Paid parking off premises": CircleParkingIcon,
  "Paid parking on premises": CircleParkingIcon,
  "Free parking on premises": CircleParkingIcon,
  "Coffee maker": CoffeeIcon,
  "Swimming pool": WavesIcon,
  "Beach": TreePalmIcon,
  "Golf course front": LandPlotIcon,
  "Golf view": LandPlotIcon,
  "Lake": WavesIcon,
  "Mountain": MountainIcon,
  "Near Ocean": FishIcon,
  "Sea view": FishIcon,
  "Resort": MountainSnowIcon,
  "Garden or backyard": TreeDeciduousIcon,
  "Indoor fireplace": FlameKindlingIcon,
  "First aid kit": CrossIcon,
  "Carbon monoxide detector": AlarmSmokeIcon,
};

type AmenityItemProps = {
  name: keyof AmenityIcons;
};

const AmenityItem: React.FC<AmenityItemProps> = ({ name }) => {
  const IconComponent = amenityIcons[name];
  if (!IconComponent) return null;
  return (
    <div className="flex items-center gap-2">
      <IconComponent className="size-8 rounded-full bg-accent p-1.5" />
      <span>{name}</span>
    </div>
  );
};

const amenityPriorityOrder = [
  "Wireless Internet",
  "Air conditioning",
  "Heating",
  "Kitchen",
  "Washer",
  "Dryer",
  "Gym",
  "Breakfast",
  "Pets Allowed",
  "Wheelchair accessible",
  "Bathtub",
];

const PropertyAmenities = ({ amenities }: { amenities: string[] }) => {
  const sortedAmenities = amenities.sort((a, b) => {
    const indexA = amenityPriorityOrder.indexOf(a);
    const indexB = amenityPriorityOrder.indexOf(b);
    return (
      (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB)
    );
  });

  const isMobile = !useIsSm();
  const toDisplay = isMobile ? 5 : 9;

  const topAmenities = sortedAmenities
    .filter((amenity) => amenityIcons[amenity])
    .slice(0, toDisplay);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {topAmenities.map((amenity, index) => (
        <AmenityItem key={index} name={amenity} />
      ))}
    </div>
  );
};

export default PropertyAmenities;
