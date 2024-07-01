/* map-modal.tsx */
import { useState } from "react";
import { Map, Marker, Circle } from "google-maps-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "./ui/dialog";

interface MapModalProps {
  initialLocation: { lat: number; lng: number };
  onSave: (location: { lat: number; lng: number }, radius: number) => void;
  setOpen: (open: boolean) => void;
  setInitialLocation: (location: { lat: number; lng: number }) => void; // Updated this part
}

const MapModal = ({
  initialLocation,
  onSave,
  setOpen,
  setInitialLocation,
}: MapModalProps) => {
  const [radius, setRadius] = useState(5); // 5 miles in meters

  const handleMapClick = (
    _mapProps: unknown,
    _map: unknown,
    clickEvent: { latLng: { lat: () => number; lng: () => number } },
  ) => {
    const lat = clickEvent.latLng.lat();
    const lng = clickEvent.latLng.lng();
    setInitialLocation({ lat, lng });
  };

  const onMarkerDragend = (
    _event: unknown,
    _map: unknown,
    coord: { latLng: { lat: () => number; lng: () => number } },
  ) => {
    const newLocation = {
      lat: coord.latLng.lat(),
      lng: coord.latLng.lng(),
    };
    setInitialLocation(newLocation);
  };

  const handleSave = () => {
    setOpen(false);
    onSave(initialLocation, radius);
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
        <Map
          google={google}
          initialCenter={initialLocation}
          zoom={11}
          onClick={handleMapClick}
          style={{ height: "100%", width: "100%" }}
        >
          <Circle
            center={initialLocation}
            radius={radius * 1609.34}
            options={{
              fillColor: "rgba(0, 123, 255, 0.3)",
              strokeColor: "rgba(0, 123, 255, 0.6)",
              strokeWeight: 2,
            }}
          />
          <Marker
            position={initialLocation}
            draggable={true}
            onDragend={onMarkerDragend}
          />
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
          defaultValue={[5]}
          onValueChange={(e) => setRadius(Number(e[0]))}
        />
      </div>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} variant={"secondary"}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant={"greenPrimary"}>
          Save Location
        </Button>
      </DialogFooter>
    </>
  );
};

export default MapModal;
