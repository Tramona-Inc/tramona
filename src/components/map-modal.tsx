import { useState, useEffect } from "react";
import { Map, Marker, Circle } from "google-maps-react";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation: { lat: number; lng: number };
  onSave: (location: { lat: number; lng: number }, radius: number) => void;
}

const MapModal = ({ isOpen, onClose, initialLocation, onSave }: MapModalProps) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [radius, setRadius] = useState(8046.72); // 5 miles in meters

  useEffect(() => {
    if (isOpen) {
      setSelectedLocation(initialLocation);
      setRadius(8046.72);
    }
  }, [initialLocation, isOpen]);

  const handleMapClick = (_mapProps, _map, clickEvent: { latLng: { lat: () => number; lng: () => number; }; }) => {
    // Ensure that clickEvent and its properties are defined
    if (clickEvent?.latLng) {
      // Extract latitude and longitude from clickEvent.latLng
      const lat = clickEvent.latLng.lat();
      const lng = clickEvent.latLng.lng();

      // Update the selected location state
      setSelectedLocation({ lat, lng });
    }
  };

  const onMarkerDragend = (_blah: any, _blady: any, coord: { latLng: { lat: () => number; lng: () => number; }; }) => {
    const newLocation = {
      lat: coord.latLng.lat(),
      lng: coord.latLng.lng(),
    };
    setSelectedLocation(newLocation);
  };

  const handleSave = () => {
    onSave(selectedLocation, radius);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="w-full max-w-lg rounded bg-white p-4 shadow-lg">
        <div className="relative h-[400px]">
          {selectedLocation && (
            <Map
              google={google}
              center={selectedLocation}
              zoom={11}
              onClick={handleMapClick}
              style={{ height: "100%", width: "100%" }}
            >
              <Circle
                center={selectedLocation}
                radius={radius}
                options={{
                  fillColor: "rgba(0, 123, 255, 0.3)",
                  strokeColor: "rgba(0, 123, 255, 0.6)",
                  strokeWeight: 2,
                }}
              />
              <Marker
                position={selectedLocation}
                draggable={true}
                onDragend={onMarkerDragend}
              />
            </Map>
          )}
        </div>
        <div className="p-4">
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Radius: {(radius / 1609.34).toFixed(2)} miles
            </label>
            <input
              type="range"
              min="1609.34" // 1 mile in meters
              max="16093.4" // 10 miles in meters
              step="160.934" // 0.1 miles in meters
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="mr-2">
              Cancel
            </button>
            <button onClick={handleSave}>Save Location</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
