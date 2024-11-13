import { useState } from "react";
import { DateRange } from "react-day-picker";
import { CityCarousel } from "./CityCarousel";
import { FilterSidebar } from "./FilterSidebar";
import { PropertyGrid } from "./PropertyGrid";

export function BookItNowSection() {
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("1000");
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = parseInt(value) || 0;
    if (type === "min") {
      setMinPrice(String(numValue));
      if (numValue > parseInt(maxPrice)) {
        setMaxPrice(String(numValue));
      }
    } else {
      setMaxPrice(String(numValue));
      if (numValue < parseInt(minPrice)) {
        setMinPrice(String(numValue));
      }
    }
  };

  return (
    <>
      <CityCarousel setLocation={setLocation} />
      <div className="mx-32 grid gap-6 lg:grid-cols-[300px_1fr]">
        <FilterSidebar
          location={location}
          setLocation={setLocation}
          date={date}
          setDate={setDate}
          minPrice={minPrice}
          maxPrice={maxPrice}
          handlePriceChange={handlePriceChange}
        />
        <PropertyGrid />
      </div>
    </>
  );
}
