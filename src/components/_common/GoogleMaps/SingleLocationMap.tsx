import {
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
  useMap,
  useApiIsLoaded,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MapPointer from "./MapPointer";
interface MapPointerProps {
  //location: google.maps.LatLngLiteral;
  lat: number | null;
  lng: number | null;
}
function SingleLocationMap({ lat, lng }: MapPointerProps) {
  const map = useMap("9c8e46d54d7a528b");
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(
    null,
  );

  useEffect(() => {
    if (!lat || !lng) return;
    const center = { lat, lng } as google.maps.LatLngLiteral;
    setLocation(center);
  }, [map]);
  return (
    <div className="focus-none h-[300px] w-[353px] lg:h-[774px] lg:w-[829px] rounded-lg">
      {location && (
        <Map
          mapId="9c8e46d54d7a528b"
          id="9c8e46d54d7a528b"
          defaultCenter={location}
          defaultZoom={13}
          disableDefaultUI={true}
          maxZoom={17}
          // style={{strokeLinecap: "round", strokeLinejoin: "round"}}
        >
          <MapPointer location={location} />
        </Map>
      )}
    </div>
  );
}

export default SingleLocationMap;
