/* map-modal.tsx */
import { useState } from "react";
import { Map, Marker, Circle } from "google-maps-react";

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
  const [radius, setRadius] = useState(8046.72); // 5 miles in meters

  const handleMapClick = (
    _mapProps,
    _map,
    clickEvent: { latLng: { lat: () => number; lng: () => number } },
  ) => {
    if (clickEvent?.latLng) {
      const lat = clickEvent.latLng.lat();
      const lng = clickEvent.latLng.lng();
      setInitialLocation({ lat, lng });
    }
  };

  const onMarkerDragend = (
    _event: any,
    _map: any,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-4xl space-y-8 rounded-lg bg-white p-6 sm:p-10">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <span className="sr-only">Close</span>✕
        </button>
        <div className="text-center">
          <div className="mb-1 text-xl sm:text-2xl font-extrabold">
            Have a specific part of town you want to stay in?
          </div>
          <div className="mb-4 text-xl sm:text-2xl font-extrabold text-green-900">
            Drop a pin and let us know!
          </div>
        </div>
        <div className="relative h-[300px] sm:h-[400px] overflow-hidden rounded-lg border">
          {initialLocation && (
            <Map
              google={google}
              initialCenter={initialLocation}
              zoom={11}
              onClick={handleMapClick}
              style={{ height: "100%", width: "100%" }}
            >
              <Circle
                center={initialLocation}
                radius={radius}
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
          )}
        </div>
        <div className="pt-4">
          <label className="block text-base font-extrabold">
            Radius: {(radius / 1609.34).toFixed(2)} miles
          </label>
          <input
            type="range"
            min="1609.34" // 1 mile in meters
            max="16093.4" // 10 miles in meters
            step="160.934" // 0.1 miles in meters
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-800 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-green-900 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;

