import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const cities: string[] = [
  "Los Angeles (LA)",
  "San Diego",
  "Orlando/Kissimmee",
  "Las Vegas",
  "Washington DC",
  "Seattle",
  "Boston",
  "Atlanta",
  "Nashville",
  "Austin",
  "Denver",
  "Portland",
  "Charleston",
  "Sedona",
  "Scottsdale",
  "Lake Tahoe",
  "Hawaii - Maui",
  "Hawaii - Kauai",
  "Aspen",
  "Outer Banks (OBX)",
  "Palm Springs Area",
  "Dallas Area",
  "Palm Coast",
  "Charlotte",
  "Zion",
  "Houston",
  "Kansas City",
  "Punta Cana",
  "Philadelphia",
  "St. Augustine",
  "Eureka Springs",
  "Boca Raton",
  "Fort Lauderdale",
  "Kitty Hawk",
  "Fairfax, VA",
  "Birmingham",
  "Bozeman",
  "Idaho",
  "Joshua Tree",
  "Oakland",
  "South San Francisco",
  "Arizona (assuming Phoenix or Tucson)",
  "Multi City",
];

export default function CitiesFilter() {
  return (
    <ScrollArea className="w-full overflow-hidden whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {cities.map((city, index) => {
          return <div key={index}>{city}</div>;
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
