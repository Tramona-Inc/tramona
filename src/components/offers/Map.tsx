import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import { Icon } from "leaflet";

export default function Map(coordinates: { lat: number; lng: number; }) {
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/15527/15527315.png",
    iconSize: [38, 38],
  });

  return (
    <MapContainer
      center={[coordinates.lat, coordinates.lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[
          coordinates.lat,
          coordinates.lng,
        ]}
        radius={200} // Adjust radius as needed
        pathOptions={{ color: "red" }} // Customize circle color and other options
      />
      <Marker
        position={[
          coordinates.lat,
          coordinates.lng,
        ]}
        icon={customIcon}
      ></Marker>
    </MapContainer>
  );
}
