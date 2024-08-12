import { Map, useMap, Marker } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import MapPointer from "./MapPointer";
interface MapPointerProps {
  //location: google.maps.LatLngLiteral;
  lat: number | null;
  lng: number | null;
  icon?: boolean;
}
function SingleLocationMap({ lat, lng, icon }: MapPointerProps) {
  const map = useMap("9c8e46d54d7a528b");
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(
    null,
  );

  useEffect(() => {
    if (lat && lng) setLocation({ lat, lng });
  }, [lat, lng, map]);

  const mapOptions: google.maps.MapOptions = {
    zoomControl: true,
  };
  return (
    <div className="h-full w-full">
      {location && (
        <Map
          mapId="9c8e46d54d7a528b"
          id="9c8e46d54d7a528b"
          defaultCenter={location}
          defaultZoom={13}
          disableDefaultUI={true}
          // @ts-expect-error their typedefs are wrong
          options={icon ? mapOptions : undefined} // Apply mapOptions only if icon is true
          maxZoom={17}
        >
          {icon ? (
            <Marker position={location} />
          ) : (
            <MapPointer location={location} />
          )}
        </Map>
      )}
    </div>
  );
}

export default SingleLocationMap;
