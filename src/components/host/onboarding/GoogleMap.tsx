import { Map, Marker, InfoWindow, type IMapProps } from "google-maps-react";
import React, { useState } from "react";

type CoordinateDataProps = {
  lat: number | undefined;
  lng: number | undefined;
  draggable: boolean;
};

function GoogleMap({ lat, lng, draggable }: CoordinateDataProps) {
  const [markerPosition, setMarkerPosition] = useState({
  	lat: lat ?? 37.774929,
  	lng: lng ?? -122.419416,
  });


  const onMarkerDragend = (coord: { latLng: { lat: () => number; lng: () => number; }; }) => {
  	const lat = coord.latLng.lat();
  	const lng = coord.latLng.lng();

  	// Update marker position
  	setMarkerPosition({ lat, lng });

  	// Display latitude and longitude
  	console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  };

  const onMapClick = (clickEvent: { latLng: { lat: () => number; lng: () => number; }; }, _mapProps?: IMapProps, _map?: google.maps.Map) => {
    const lat = clickEvent.latLng.lat();
    const lng = clickEvent.latLng.lng();
    setMarkerPosition({ lat, lng });
  }



  return (
    <div>
      {lng && lat && (
        <div className="relative z-10">
          <Map
            google={google}
            zoom={15}
            initialCenter={{ lat, lng }}
            // onClick={onMapClick}
            style={{ height: "400px" }}
          >
            <Marker
              position={markerPosition}
              draggable={true}
              onDragend={(coord: { latLng: { lat: () => number; lng: () => number; }; }) => onMarkerDragend(coord)}
           />


            </Map>
         </div>
      )}
    </>
  );
}

export default GoogleMap;
