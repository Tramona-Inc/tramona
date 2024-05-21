import { FunctionComponent, useState, useEffect } from "react";
import { useGoogleMap } from "@ubilabs/google-maps-react-hooks";

interface MuseumData {
  name: string;
  position: google.maps.LatLngLiteral;
}

const museums: MuseumData[] = [
  {
    name: "Los Angeles County Museum of Art (LACMA)",
    position: { lat: 34.063791, lng: -118.358021 },
  },
  {
    name: "The Getty Center",
    position: { lat: 34.078036, lng: -118.474095 },
  },
  {
    name: "The Broad",
    position: { lat: 34.054422, lng: -118.250708 },
  },
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
  {
    name: "Hammer Museum",
    position: { lat: 34.059449, lng: -118.443873 },
  },
];

/**
 * Component to render all map markers
 */
const MapMarkers: FunctionComponent<Record<string, unknown>> = () => {
  // Get the global map instance with the useGoogleMap hook
  const map = useGoogleMap();

  const [, setMarkers] = useState<Array<google.maps.Marker>>([]);

  // Add markers to the map
  useEffect(() => {
    if (!map || !window.google) return;

    const initialBounds = new google.maps.LatLngBounds();

    const museumMarkers: Array<google.maps.Marker> = museums.map((museum) => {
      const { position, name } = museum;

      const markerOptions: google.maps.MarkerOptions = {
        map,
        position,
        title: name,
        clickable: false,
      };

      initialBounds.extend(position);

      return new google.maps.Marker(markerOptions);
    });

    // Set the center of the map to fit markers
    map.setCenter(initialBounds.getCenter());

    setMarkers(museumMarkers);

    // Clean up markers
    return () => {
      museumMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map]);

  return null;
};

export default MapMarkers;
