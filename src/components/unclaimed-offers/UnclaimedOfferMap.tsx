import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Map, AdvancedMarker, InfoWindow, useMap, useApiIsLoaded, type MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { api } from "@/utils/api";
import { type UnMatchedOffers } from "./UnclaimedOfferCard";
import { debounce } from "lodash";

type MapMarker = {
  key: string;
  location: google.maps.LatLngLiteral;
  propertyName: string;
  price: number;
  image: string;
};

type MapBoundary = {
  north: number;
  south: number;
  east: number;
  west: number;
};

function UnclaimedOffersMap({
  unMatchedOffers,
}: {
  unMatchedOffers: UnMatchedOffers[];
}) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [mapBoundaries, setMapBoundaries] = useState<MapBoundary | null>(null);

  const map = useMap("unclaimed-offers-map");
  const apiIsLoaded = useApiIsLoaded();

  const propertyIds = useMemo(() => 
    unMatchedOffers.map(offer => offer.propertyId),
    [unMatchedOffers]
  );

  const { data: propertyDetails, isLoading, isError } = api.properties.getPropertiesById.useQuery(propertyIds, {
    enabled: propertyIds.length > 0,
  });

  useEffect(() => {
    if (propertyDetails && propertyDetails.length > 0) {
      const newMarkers = propertyDetails.map(property => ({
        key: property.name,
        location: { lat: property.latitude, lng: property.longitude },
        propertyName: property.name,
        price: property.originalNightlyPrice ?? 0,
        image: property.imageUrls[0] ?? "",
      }));
      setMarkers(newMarkers);

      if (newMarkers.length > 0 && !center) {
        setCenter(newMarkers[0].location);
      }
    }
  }, [propertyDetails, center]);

  const handleCameraChanged = useCallback(debounce((ev: MapCameraChangedEvent) => {
    const newCenter = {
      lat: ev.detail.center.lat,
      lng: ev.detail.center.lng,
    };
    setCenter(newCenter);

    setMapBoundaries({
      north: ev.detail.bounds.north,
      south: ev.detail.bounds.south,
      east: ev.detail.bounds.east,
      west: ev.detail.bounds.west,
    });
  }, 300), []);

  if (isLoading) {
    return <div>Loading map data...</div>;
  }

  if (isError) {
    return <div>Error loading map data. Please try again.</div>;
  }

  if (markers.length === 0) {
    return <div>No properties to display on the map.</div>;
  }

  return (
    <div className="h-full w-full rounded-md border shadow-md">
      {apiIsLoaded && center ? (
        <Map
          mapId="unclaimed-offers-map"
          center={center}
          zoom={10}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          zoomControl={true}
          fullscreenControl={true}
          onCameraChanged={handleCameraChanged}
        >
          {markers.map((marker) => (
            <AdvancedMarker
              key={marker.key}
              position={marker.location}
              onClick={() => setSelectedMarker(marker)}
            >
              <div className="bg-white p-2 rounded shadow">
                ${marker.price}
              </div>
            </AdvancedMarker>
          ))}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.location}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <h3>{selectedMarker.propertyName}</h3>
                <p>${selectedMarker.price}/night</p>
                <img src={selectedMarker.image} alt={selectedMarker.propertyName} className="w-full h-32 object-cover" />
              </div>
            </InfoWindow>
          )}
        </Map>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div>Loading map...</div>
        </div>
      )}
    </div>
  );
}

export default UnclaimedOffersMap;