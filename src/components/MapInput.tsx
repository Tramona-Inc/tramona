import { METERS_PER_MILE } from "@/utils/constants";
import { Circle, Marker } from "google-maps-react";
import { type UseFormReturn } from "react-hook-form";
import { Map } from "google-maps-react";

export type LatLngAndRadiusForm = UseFormReturn<{
  latLng: {
    lat: number;
    lng: number;
  };
  radius: number;
}>;

export function MapInput({ form }: { form: LatLngAndRadiusForm }) {
  const { latLng: latLng, radius } = form.watch();

  const handleMapClick = (
    _mapProps: unknown,
    _map: unknown,
    clickEvent: { latLng: { lat: () => number; lng: () => number } },
  ) => {
    form.setValue("latLng", {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    });
  };

  const onMarkerDragend = (
    _event: unknown,
    _map: unknown,
    coord: { latLng: { lat: () => number; lng: () => number } },
  ) => {
    form.setValue("latLng", {
      lat: coord.latLng.lat(),
      lng: coord.latLng.lng(),
    });
  };

  return (
    <div data-vaul-no-drag="">
      {/* @ts-expect-error their typedefs are wrong */}
      <Map
        google={google}
        initialCenter={latLng}
        zoom={11}
        onClick={handleMapClick}
        style={{ height: "100%", width: "100%" }}
        disableDefaultUI
        onDragend={onMarkerDragend}
      >
        <Circle
          center={latLng}
          radius={radius * METERS_PER_MILE}
          options={{
            fillColor: "rgba(0, 123, 255, 0.3)",
            strokeColor: "rgba(0, 123, 255, 0.6)",
            strokeWeight: 2,
          }}
        />
        <Marker position={latLng} draggable={true} />
      </Map>
    </div>
  );
}
