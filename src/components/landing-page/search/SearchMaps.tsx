import React, { useState, useCallback } from "react";
import { GoogleMapsProvider } from "@ubilabs/google-maps-react-hooks";
import { env } from "@/env";
import MapMarkers from "./MapMarkers";
import MapCanvas from "./map-canvas";
import MapBoundary from "./MapBoundary";

function SearchMaps() {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);

  const mapRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setMapContainer(node);
    }
  }, []);

  const mapOptions = {
    center: { lat: 34.052235, lng: -118.243683 }, // Centered on Los Angeles
    zoom: 10,
    disableDefaultUI: true,
    zoomControl: true,
  };

  return (
    <GoogleMapsProvider
      googleMapsAPIKey={env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}
      mapContainer={mapContainer}
      mapOptions={mapOptions}
    >
      <div className="h-full w-full">
        <MapCanvas ref={mapRef} />
        <MapMarkers />
        <MapBoundary />
      </div>
    </GoogleMapsProvider>
  );
}

export default SearchMaps;
