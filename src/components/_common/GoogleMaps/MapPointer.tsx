import {
  useMap,
  AdvancedMarker,
  useAdvancedMarkerRef,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { BsHouseFill } from "react-icons/bs";

function MapPointer({ location }: { location: google.maps.LatLngLiteral }) {
  return (
    <div>
      <AdvancedMarker position={location}>
        <div className="rounded-full bg-zinc-200 p-2">
          <BsHouseFill size={36} />
        </div>
        <InfoWindow>
          <div>
            <h1>Location</h1>
          </div>
        </InfoWindow>
      </AdvancedMarker>
    </div>
  );
}

export default MapPointer;
