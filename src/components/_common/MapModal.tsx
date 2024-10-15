import { Map, Marker, Circle } from "@peacechen/google-maps-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { METERS_PER_MILE } from "@/utils/constants";
import { useState } from "react";

export function MapModal({
  radius,
  latLng,
  setRadius,
  setLatLng,
}: {
  radius?: number;
  latLng: { lat: number; lng: number };
  setRadius: (radius?: number) => void;
  setLatLng: (latLng: { lat: number; lng: number }) => void;
}) {
  const [editedLatLng, setEditedLatLng] = useState(latLng);
  const [editedRadius, setEditedRadius] = useState(radius ?? 5);

  const saveEditedValues = () => {
    setLatLng(editedLatLng);
    setRadius(editedRadius);
  };

  function onDragendOrClick(
    _event: unknown,
    _map: unknown,
    clickEvent?: { latLng: { lat: () => number; lng: () => number } },
  ) {
    if (!clickEvent) return;
    setEditedLatLng({
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    });
  }

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
        <Map
          disableDefaultUI
          google={google}
          initialCenter={latLng}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          onClick={onDragendOrClick}
        >
          <Circle
            center={editedLatLng}
            radius={editedRadius * METERS_PER_MILE}
            options={{
              fillColor: "rgba(0, 123, 255, 0.3)",
              strokeColor: "rgba(0, 123, 255, 0.6)",
              strokeWeight: 2,
            }}
          />
          <Marker
            draggable
            position={editedLatLng}
            onDragend={onDragendOrClick}
          />
        </Map>
      </div>
      <div className="pt-4">
        <label className="block text-base font-extrabold">
          Radius: {editedRadius.toFixed(1)} miles
        </label>
        <Slider
          min={1}
          max={10}
          step={0.1}
          value={[editedRadius]}
          onValueChange={(e) => setEditedRadius(e[0]!)}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="greenPrimary" onClick={saveEditedValues}>
            Done
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
