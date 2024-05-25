import { useCitiesFilter } from "@/utils/store/cities-filter";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
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
    <div className="flex flex-row">
      <Swiper
        spaceBetween={0}
        slidesPerView={3}
        scrollbar={{ draggable: true }}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <FilterBadge
            value={bedrooms}
            setValue={setBedrooms}
            label="Bedrooms"
          />
        </SwiperSlide>
        <SwiperSlide>
          <FilterBadge value={beds} setValue={setBeds} label="Beds" />
        </SwiperSlide>

        <SwiperSlide>
          <FilterBadge
            value={bathrooms}
            setValue={setBathrooms}
            label="Bathrooms"
          />
        </SwiperSlide>

        {houseRules.length > 0 &&
          houseRules.map((rule, index) => (
            <SwiperSlide key={index}>
              <HouseRuleBadge
                key={rule}
                rule={rule}
                removeRule={removeHouseRule}
              />
            </SwiperSlide>
          ))}
      </Swiper>
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
interface HouseRuleBadgeProps {
  rule: string;
  removeRule: (rule: string) => void;
}

const HouseRuleBadge: React.FC<HouseRuleBadgeProps> = ({
  rule,
  removeRule,
}) => {
  return (
    <Badge variant="primaryGreen" className="mr-4">
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
