import { useCitiesFilter } from "@/utils/store/cities-filter";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileFilterBar() {
  const beds = useCitiesFilter((state) => state.beds);
  const setBeds = useCitiesFilter((state) => state.setBeds);
  const bedrooms = useCitiesFilter((state) => state.bedrooms);
  const setBedrooms = useCitiesFilter((state) => state.setBedrooms);
  const bathrooms = useCitiesFilter((state) => state.bathrooms);
  const setBathrooms = useCitiesFilter((state) => state.setBathrooms);

  return (
    <div className="flex flex-row items-start justify-start">
      <FilterBadge value={beds} setValue={setBeds} label="Beds" />
      <FilterBadge value={bedrooms} setValue={setBedrooms} label="Bedrooms" />
      <FilterBadge
        value={bathrooms}
        setValue={setBathrooms}
        label="Bathrooms"
      />
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
      <Badge variant="primaryGreen" className="mr-4">
        <button
          onClick={() => {
            setValue(0);
          }}
        >
          <XIcon size={15} strokeWidth={2.8} />
        </button>
        {value} {label}
      </Badge>
    )
  );
};
