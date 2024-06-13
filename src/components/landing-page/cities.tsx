import type { CitiesLatLong } from "@/utils/store/cities-filter";

export const cities: CitiesLatLong[] = [
  { id: "all", label: "All", long: 0, lat: 0 },
  {
    id: "los_angeles",
    label: "Los Angeles",
    long: -118.3806008,
    lat: 34.1010307,
  },
  {
    id: "san_diego",
    label: "San Diego",
    long: -117.1611,
    lat: 32.7157,
  },
  {
    id: "nashville",
    label: "Nashville",
    long: -86.7816,
    lat: 36.1627,
  },
  { id: "orlando", label: "Orlando", long: -81.3792, lat: 28.5383 },
  {
    id: "washington_dc",
    label: "Washington DC",
    long: -77.0369,
    lat: 38.9072,
  },
  { id: "seattle", label: "Seattle", long: -122.3321, lat: 47.6062 },
  { id: "atlanta", label: "Atlanta", long: -84.388, lat: 33.749 },
  { id: "austin", label: "Austin", long: -97.7431, lat: 30.2672 },
  { id: "miami", label: "Miami", long: -80.1917902, lat: 25.7616798 },
  // {
  //   id: "palm_springs_area",
  //   label: "Palm Springs Area",
  //   long: -116.5453,
  //   lat: 33.8303,
  // },
  { id: "las vegas", label: "Las Vegas", long: -115.1398, lat: 36.1699 },
  { id: "sf", label: "San Francisco", long: -122.4194, lat: 37.7749 },
  { id: "boston", label: "Boston", long: -71.0589, lat: 42.3601 },
];
