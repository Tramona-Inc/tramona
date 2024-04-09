export const old_ALL_PROPERTY_AMENITIES = [
  "Street Parking",
  "Garage Parking",
  "Ev charging",
  "Driveway parking",
  "Couch",
  "Carbon monoxide detector",
  "Emergency exit",
  "Fire extinguisher",
  "First aid kit",
  "Smoke detector",
  "Desk",
  "Internet",
  "Laptop friendly workspace",
  "Pocket wifi",
  "Wireless Internet",
  "Coffee maker",
  "Cookware",
  "Dishes and silverware",
  "Dishwasher",
  "Kitchen",
  "Kettle",
  "Microwave",
  "Oven",
  "Freezer",
  "Refrigerator",
  "Stove",
  "Toaster",
  "Beach",
  "Beach Front",
  "Beach View",
  "Downtown",
  "Golf course front",
  "Golf view",
  "Lake",
  "Lake access",
  "Lake Front",
  "Mountain",
  "Mountain view",
  "Near Ocean",
  "Ocean Front",
  "Resort",
  "River",
  "Rural",
  "Sea view",
  "Ski In",
  "Ski in/Ski out",
  "Ski Out",
  "Town",
  "Village",
  "Water View",
  "Waterfront",
  "Outdoor pool",
  "Garden or backyard",
  "Bicycles available",
  "Patio or balcony",
  "BBQ grill",
  "Beach essentials",
  "Elevator",
  "Free parking on premises",
  "Indoor pool",
  "Hot tub",
  "Gym",
  "Swimming pool",
  "Communal pool",
  "Free parking on street",
  "EV charger",
  "Single level home",
  "Private pool",
  "Paid parking off premises",
  "Breakfast",
  "Long term stays allowed",
  "Luggage dropoff allowed",
  "High touch surfaces disinfected",
  "Enhanced cleaning practices",
  "Doorman",
  "Cleaning Disinfection",
  "Cleaning before checkout",
  "Grab-rails for shower and toilet",
  "Tub with shower bench",
  "Wheelchair accessible",
  "Wide clearance to bed",
  "Wide clearance to shower and toilet",
  "Wide hallway clearance",
  "Accessible-height toilet",
  "Accessible-height bed",
  "Paid parking on premises",
  "Outdoor dining area",
  "Pool table",
  "Piano",
  "Exercise equipment",
  "Fire pit",
  "Outdoor shower",
  "Private entrance",
  "Pets Allowed",
  "Dishes & silverware",
  "Dining table and chairs",
] as const;

export const amenityCategories = [
  {
    category: "Bathroom",
    amenities: ["Bathtub", "Hair dryer", "Hot water", "Shampoo"],
  },
  {
    category: "Bedroom and laundry",
    amenities: [
      "Essentials",
      "Bed linens",
      "Dryer",
      "Dryer in common space",
      "Extra pillows and blankets",
      "Hangers",
      "Iron",
      "Room-darkening shades",
      "Safe",
      "Towels provided",
      "Washer",
      "Washer in common space",
    ],
  },
  {
    category: "Entertainment",
    amenities: [
      "Cable TV",
      "Dvd player",
      "Game console",
      "Stereo system",
      "TV",
      "Pool table",
      "Piano",
    ],
  },
  {
    category: "Family",
    amenities: [
      "Baby bath",
      "Baby monitor",
      "Babysitter recommendations",
      "Children’s books and toys",
      "Changing table",
      "Children’s dinnerware",
      "Crib",
      "Family/kid friendly",
      "Fireplace guards",
      "High chair",
      "Outlet covers",
      "Pack ’n Play/travel crib",
      "Stair gates",
      "Table corner guards",
      "Window guards",
    ],
  },
  {
    category: "Heating and Cooling",
    amenities: ["Air conditioning", "Heating", "Indoor fireplace"],
  },
  {
    category: "Home Safety",
    amenities: [
      "Carbon monoxide detector",
      "Emergency exit",
      "Fire extinguisher",
      "First aid kit",
      "Smoke detector",
    ],
  },
  {
    category: "Internet and Office",
    amenities: [
      "Desk",
      "Internet",
      "Laptop friendly workspace",
      "Pocket wifi",
      "Wireless Internet",
    ],
  },
  {
    category: "Ktchen and dining",
    amenities: [
      "Coffee maker",
      "Cookware",
      "Dishes and silverware",
      "Dishwasher",
      "Kitchen",
      "Kettle",
      "Microwave",
      "Oven",
      "Freezer",
      "Refrigerator",
      "Stove",
      "Toaster",
      "Outdoor dining area",
      "Dining table and chairs",
    ],
  },
  {
    category: "Location Features",
    amenities: [
      "Beach",
      "Beach Front",
      "Beach View",
      "Downtown",
      "Golf course front",
      "Golf view",
      "Lake",
      "Lake access",
      "Lake Front",
      "Mountain",
      "Mountain view",
      "Near Ocean",
      "Ocean Front",
      "Resort",
      "River",
      "Rural",
      "Sea view",
      "Ski In",
      "Ski in/Ski out",
      "Ski Out",
      "Town",
      "Village",
      "Water View",
      "Water Front",
    ],
  },
  {
    category: "Outdoor",
    amenities: [
      "Outdoor pool",
      "Garden or backyard",
      "Bicycles available",
      "Patio or balcony",
      "BBQ grill",
      "Beach essentials",
      "Fire pit",
      "Outdoor shower",
    ],
  },
  {
    category: "Parking and Facilities",
    amenities: [
      "Street Parking",
      "Garage Parking",
      "Driveway Parking",
      "Elevator",
      "Free parking on premises",
      "Paid parking on premises",
      "Paid parking off premises",
      "Free parking on street",
      "Indoor pool",
      "Hot tub",
      "Gym",
      "Exercise equipment",
      "Swimming pool",
      "Communal pool",
      "EV charger",
      "Single level home",
      "Private pool",
      "Private entrance",
      ,
    ],
  },
  {
    category: "Services",
    amenities: [
      "Breakfast",
      "Long term stays allowed",
      "Luggage dropoff allowed",
      "High touch surfaces disinfected",
      "Enhanced cleaning practices",
      "Doorman",
      "Cleaning Disinfection",
      "Cleaning before checkout",
      "Pets Allowed",
    ],
  },
  {
    category: "Accessibility features",
    amenities: [
      "Grab-rails for shower and toilet",
      "Tub with shower bench",
      "Wheelchair accessible",
      "Wide clearance to bed",
      "Wide clearance to shower and toilet",
      "Wide hallway clearance",
      "Accessible-height toilet",
      "Accessible-height bed",
    ],
  },
] as const;

export const ALL_PROPERTY_AMENITIES = amenityCategories.flatMap(
  (category) => category.amenities,
);

export type AmenityCategory = (typeof amenityCategories)[number]["category"]
export type Amenity = (typeof ALL_PROPERTY_AMENITIES)[number];
