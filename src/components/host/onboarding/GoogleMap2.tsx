import React from "react";
import { GoogleMap as Map, Marker } from "@react-google-maps/api";

type CoordinateDataProps = {
  lat: number | undefined;
  lng: number | undefined;
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

function GoogleMap({ lat, lng }: CoordinateDataProps) {

  return (
    <>
      {lat && lng && (
        <Map
          mapContainerStyle={containerStyle}
          center={{ lat, lng }}
          zoom={15}
        >
          <Marker position={{ lat, lng }} draggable={true} />
        </Map>
      )}
    </>
  );
}

export default GoogleMap;
