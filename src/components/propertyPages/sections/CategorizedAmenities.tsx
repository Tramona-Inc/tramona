import React from "react";
import {
  MapPinIcon,
  InfoIcon,
  AccessibilityIcon,
  ShieldCheckIcon,
  Airplay,
  TreeDeciduousIcon,
  WavesIcon,
  UtensilsIcon,
  BathIcon,
  BlocksIcon,
  BriefcaseIcon,
  CarIcon,
  BookHeartIcon,
  StarIcon,
} from "lucide-react";

// prettier-ignore
const categories = {
  "General": {
    amenities: [
      "Wireless Internet",
      "Air conditioning",
      "Heating",
      "Breakfast", 
      "Pets Allowed", 
    ],
    icon: InfoIcon,
  },
  "Kitchen": {
    amenities: [
      "Refrigerator",
      "Oven",
      "Microwave",
      "Kettle",
      "Stove",
      "Coffee maker",
      "Dishwasher",
      "Dishes and silverware",
      "Cookware",
      "Toaster",
      "Kitchen",
    ],
    icon: UtensilsIcon, 
  },
  "Bathroom": {
    amenities: [
        "Hot water",
        "Shampoo",
        "Towels provided",
        "Hair dryer",
        "Washer",
        "Dryer",
        "Bathtub",
    ],
    icon: BathIcon, 
  },
  "Work & Study": {
    amenities: ["Desk", "Internet", "Laptop friendly workspace", "Pocket wifi"],
    icon: BriefcaseIcon,
  },
  "Entertainment": {
    amenities: [
      "Gym",
      "Pool table",
      "Piano",
      "TV",
      "Stereo system",
      "Game console",
      "Dvd player",
      "Cable TV",
    ],
    icon: Airplay,
  },
  "Essentials": {
    amenities: [
      "Essentials",
      "Bed linens",
      "Extra pillows and blankets",
      "Hangers",
      "Iron",
      "Room-darkening shades",
      "Washer in common space",
      "Dryer in common space",
      "Cleaning before checkout",
      "Enhanced cleaning practices",
      "Cleaning Disinfection",
      "High touch surfaces disinfected",
    ],
    icon: StarIcon,
  },
  "Views & Locations": {
    amenities: [
      "Water View",
      "Waterfront",
      "Village",
      "Rural",
      "Town",
      "River",
      "Mountain",
      "Mountain view",
      "Ski In",
      "Sea view",
      "Near Ocean",
      "Ski in/Ski out",
      "Ski Out",
      "Ocean Front",
      "Resort",
      "Lake Front",
      "Lake access",
      "Lake",
      "Golf view",
      "Golf course front",
      "Downtown",
    ],
    icon: MapPinIcon,
  },
  "Accessibility": {
    amenities: [
      "Wheelchair accessible",
      "Accessible-height toilet",
      "Accessible-height bed",
      "Wide hallway clearance",
      "Wide clearance to shower and toilet",
      "Tub with shower bench",
      "Wide clearance to bed",
      "Grab-rails for shower and toilet",
      "Single level home"
    ],
    icon: AccessibilityIcon,
  },
  "Outdoor": {
    amenities: [
      "Fire pit",
      "Outdoor shower",
      "Private entrance",
      "Outdoor dining area",
      "BBQ grill",
      "Patio or balcony",
      "Outdoor pool",
      "Garden or backyard",
      "Beach essentials",
      "Beach",
      "Beach Front",
      "Beach View",
    ],
    icon: TreeDeciduousIcon
  },
  "Safety & Security": {
    amenities: [
      "Smoke detector",
      "Carbon monoxide detector",
      "First aid kit",
      "Fire extinguisher",
      "Emergency exit",
      "Safe",
      "Security camera",
    ],
    icon: ShieldCheckIcon,
  },
  "Parking & facilities": {
    amenities: [
      "Paid parking on premises",
      "Free parking on street",
      "EV charger",
      "Paid parking off premises",
      "Luggage dropoff allowed",
      "Free parking on premises"
    ],
    icon: CarIcon
  },
  "Pools & Spas": {
    amenities: [
      "Private pool",
      "Swimming pool",
      "Communal pool",
      "Hot tub",
      "Indoor pool",
    ],
    icon: WavesIcon,
  },
  "Family": {
    amenities: [
      "Baby monitor",
      "Babysitter recommendations",
      "Changing table",
      "Crib",
      "Family/kid friendly",
      "Fireplace guards",
      "High chair",
      "Outlet covers",
      "Stair gates",
      "Table corner guards",
      "Window guards",
      "Baby bath",
      "Children’s books and toys",
      "Children’s dinnerware",
      "Pack ’n Play/travel crib",
    ],
    icon: BlocksIcon,
  },
};

// lookup table for amenities
const amenityLookup: Record<string, string> = {};
Object.entries(categories).forEach(([category, details]) => {
  details.amenities.forEach((amenity) => {
    amenityLookup[amenity] = category;
  });
});

function categorizeAmenities(amenities: string[]): Record<string, string[]> {
  const categorizedAmenities: Record<string, string[]> = {};
  Object.keys(categories).forEach((category) => {
    categorizedAmenities[category] = [];
  });

  categorizedAmenities.Other = [];
  amenities.forEach((amenity) => {
    const category = amenityLookup[amenity] ?? "Other";
    categorizedAmenities[category]!.push(amenity);
  });

  return categorizedAmenities;
}

const AmenitiesComponent: React.FC<{ propertyAmenities: string[] }> = ({
  propertyAmenities,
}) => {
  const categorizedAmenities = categorizeAmenities(propertyAmenities);

  return (
    <div className="divide-y">
      {Object.entries(categorizedAmenities).map(([category, amenities]) => {
        const categoryDetails = categories[
          category as keyof typeof categories
        ] ?? { icon: BookHeartIcon };

        return (
          amenities.length > 0 && (
            <div key={category} className="pb-4 pt-6">
              <h3 className="inline-flex items-center justify-center text-black">
                {React.createElement(categoryDetails.icon)}
                <p className="text-md ml-2 font-semibold">{category}</p>
              </h3>
              <div className="flex flex-col gap-2">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 pb-2">
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default AmenitiesComponent;
