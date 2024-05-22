import React, { useState, useEffect } from "react";
import { useGoogleMap } from "@ubilabs/google-maps-react-hooks";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin,
} from "@vis.gl/react-google-maps";
interface MuseumData {
  name: string;
  position: google.maps.LatLngLiteral;
}

const museums: MuseumData[] = [
  {
    name: "Los Angeles County Museum of Art (LACMA)",
    position: { lat: 34.063791, lng: -118.358021 },
  },
  { name: "The Getty Center", position: { lat: 34.078036, lng: -118.474095 } },
  { name: "The Broad", position: { lat: 34.054422, lng: -118.250708 } },
  {
    name: "Natural History Museum of Los Angeles County",
    position: { lat: 34.017581, lng: -118.288012 },
  },
  {
    name: "California Science Center",
    position: { lat: 34.015475, lng: -118.285372 },
  },
  {
    name: "Griffith Observatory",
    position: { lat: 34.118434, lng: -118.300393 },
  },
  {
    name: "The Museum of Contemporary Art (MOCA)",
    position: { lat: 34.053204, lng: -118.250077 },
  },
  {
    name: "Autry Museum of the American West",
    position: { lat: 34.148613, lng: -118.282479 },
  },
  { name: "Hammer Museum", position: { lat: 34.059449, lng: -118.443873 } },
];

const MapMarkers: React.FC = () => {
  const filters = useCitiesFilter((state) => state);

  const {
    data: properties,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = api.properties.getAllInfiniteScroll.useInfiniteQuery(
    {
      guests: filters.guests,
      beds: filters.beds,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      maxNightlyPrice: filters.maxNightlyPrice,
      lat: filters.filter?.lat,
      long: filters.filter?.long,
      houseRules: filters.houseRules,
      roomType: filters.roomType,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      radius: filters.radius,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const propertiesCoordinates =
    properties?.pages.flatMap((page) =>
      page.data.map((property) => ({
        lat: property.lat,
        lng: property.long,
      })),
    ) ?? [];

  console.log(propertiesCoordinates);

  const map = useGoogleMap();

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!map || !window.google) return;

    const initialBounds = new google.maps.LatLngBounds();

    const museumMarkers = museums.map((museum) => {
      const { position, name } = museum;

      const marker = new google.maps.Marker({
        map,
        position,
        title: name,
        clickable: true,
      });

      initialBounds.extend(position);

      return marker;
    });

    map.setCenter(initialBounds.getCenter());
    map.fitBounds(initialBounds);

    setMarkers((prevMarkers) => {
      prevMarkers.forEach((marker) => marker.setMap(null));
      return museumMarkers;
    });

    return () => {
      museumMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map]);

  return null;
};

export default MapMarkers;
