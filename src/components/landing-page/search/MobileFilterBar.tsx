import { useCitiesFilter } from "@/utils/store/cities-filter";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

import "swiper/css";
import { cn } from "@/utils/utils";
export default function MobileFilterBar() {
  const beds = useCitiesFilter((state) => state.beds);
  const setBeds = useCitiesFilter((state) => state.setBeds);
  const bedrooms = useCitiesFilter((state) => state.bedrooms);
  const setBedrooms = useCitiesFilter((state) => state.setBedrooms);
  const bathrooms = useCitiesFilter((state) => state.bathrooms);
  const setBathrooms = useCitiesFilter((state) => state.setBathrooms);

  const houseRules = useCitiesFilter((state) => state.houseRules);
  const setHouseRules = useCitiesFilter((state) => state.setHouseRules);

  const removeHouseRule = (rule: string) => {
    setHouseRules(houseRules.filter((r) => r !== rule));
  };

  return (
    <div>
      <FilterBadge value={bedrooms} setValue={setBedrooms} label="Bedrooms" />

      <FilterBadge
        value={bathrooms}
        setValue={setBathrooms}
        label="Bathrooms"
      />

      <FilterBadge value={beds} setValue={setBeds} label="Beds" />

      {houseRules.length > 0 &&
        houseRules.map((rule, index) => (
          <HouseRuleBadge
            key={index}
            rule={rule}
            removeRule={removeHouseRule}
          />
        ))}
    </div>
  );
}

interface FilterBadgeProps {
  value: number;
  setValue: (value: number) => void;
  label: string;
}

const FilterBadge = ({ value, setValue, label }: FilterBadgeProps) => {
  return (
    value > 0 && (
      <button
        className={cn(badgeVariants({ variant: "primaryGreen" }), "px-2")}
        onClick={() => setValue(0)}
      >
        <XIcon size={15} strokeWidth={2.8} />
        {value} {label}
      </button>
    )
  );
};
interface HouseRuleBadgeProps {
  rule: string;
  removeRule: (rule: string) => void;
}

const HouseRuleBadge: React.FC<HouseRuleBadgeProps> = ({
  rule,
  removeRule,
}) => {
  return (
    <Badge variant="primaryGreen" className="mx-2">
      <button
        onClick={() => {
          removeRule(rule);
        }}
      >
        <XIcon size={15} strokeWidth={2.8} />
      </button>
      {rule}
    </Badge>
  );
};
