import React, { useEffect } from "react";
import { useGoogleMap } from "@ubilabs/google-maps-react-hooks";

const cityBoundaryCoords = [
  { lat: 34.16144, lng: -118.12111 },
  { lat: 34.15357, lng: -118.32899 },
  { lat: 34.07553, lng: -118.45246 },
  { lat: 33.93579, lng: -118.41744 },
  { lat: 33.87194, lng: -118.2557 },
  { lat: 33.94323, lng: -118.13187 },
  { lat: 34.05876, lng: -118.06747 },
];

function MapBoundary() {
  const map = useGoogleMap();

  useEffect(() => {
    if (!map || !window.google) return;

    const cityBoundaries = new window.google.maps.Polygon({
      paths: cityBoundaryCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.0, // Transparent fill
    });

    cityBoundaries.setMap(map);

    return () => {
      cityBoundaries.setMap(null);
    };
  }, [map]);

  return null;
}

export default MapBoundary;
