import { Map, Marker, Circle } from "google-maps-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { METERS_PER_MILE } from "@/utils/constants";
import { type UseFormReturn } from "react-hook-form";

export type LatLngAndRadiusForm = UseFormReturn<{
  latLng: { lat: number; lng: number };
  radius: number;
}>;

export function MapModal({ form }: { form: LatLngAndRadiusForm }) {
  const { latLng, radius } = form.watch();

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
    <>
      <div className="text-center">
        <div className="mb-1 text-xl font-extrabold sm:text-2xl">
          Have a specific part of town you want to stay in?
        </div>
        <div className="mb-4 text-xl font-extrabold text-green-900 sm:text-2xl">
          Drop a pin and let us know!
        </div>
      </div>
      <div className="relative h-[300px] overflow-hidden rounded-lg border sm:h-[400px]">
        {/* @ts-expect-error their typedefs are wrong */}
        <Map
          google={google}
          initialCenter={latLng}
          zoom={11}
          onClick={handleMapClick}
          style={{ height: "100%", width: "100%" }}
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
          <Marker draggable position={latLng} />
        </Map>
      </div>
      <div className="pt-4">
        <label className="block text-base font-extrabold">
          Radius: {radius.toFixed(1)} miles
        </label>
        <Slider
          min={1}
          max={10}
          step={0.1}
          value={[radius]}
          onValueChange={(e) => form.setValue("radius", e[0]!)}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="greenPrimary">Done</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
