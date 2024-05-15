import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
type CoordinateDataProps =
   {
      lat: number | undefined;
      lng: number | undefined;
    }

  function LeafletMap({ lat, lng }: CoordinateDataProps) {
  //for the leaflet map
  const MapContainer = dynamic(
    () => import("react-leaflet").then((module) => module.MapContainer),
    {
      ssr: false, // Disable server-side rendering for this component
    },
  );
  const TileLayer = dynamic(
    () => import("react-leaflet").then((module) => module.TileLayer),
    {
      ssr: false,
    },
  );
  const Circle = dynamic(
    () => import("react-leaflet").then((module) => module.Circle),
    {
      ssr: false,
    },
  );
  return (
    <div>
      {lng && lat && (
        <div className="relative z-10">
          <MapContainer
            center={[lat, lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: "400px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle
              center={[lat, lng]}
              radius={100} // Adjust radius as needed
              pathOptions={{ color: "red" }} // Customize circle color and other options
            />
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default LeafletMap;
