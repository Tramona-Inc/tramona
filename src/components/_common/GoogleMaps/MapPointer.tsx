import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { BsHouseFill } from "react-icons/bs";

function MapPointer({ location }: { location: google.maps.LatLngLiteral }) {
  return (
    <div>
      <AdvancedMarker position={location}>
        <div className="relative rounded-full bg-primaryGreen p-2 text-zinc-200 [box-shadow:0_0_12px_#000a]">
          <div className="absolute -inset-4 -z-10 rounded-full bg-primaryGreen/20" />
          <div className="absolute -inset-2 -z-10 rounded-full bg-primaryGreen/20" />
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
