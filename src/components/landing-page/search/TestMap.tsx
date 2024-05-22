import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  Marker,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { env } from "@/env";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";

type Poi = { key: string; location: google.maps.LatLngLiteral };

function TestMap() {
  const filters = useCitiesFilter((state) => state);

  const {
    data: properties,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = api.properties.getAllInfiniteScroll.useInfiniteQuery(
    {
      guests: filters.guests,
      beds: filters.beds,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      maxNightlyPrice: filters.maxNightlyPrice,
      lat: filters.filter?.lat,
      long: filters.filter?.long,
      houseRules: filters.houseRules,
      roomType: filters.roomType,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      radius: filters.radius,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const [markers, setMarkers] = useState<Poi[] | []>([]);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);

  //getting the center for the map
  //converting the location name to coordinates

  const location = useMemo(
    () => ({
      lat: filters.filter?.lat,
      lng: filters.filter?.long,
    }),
    [filters],
  );

  useEffect(() => {
    if (location.lat && location.lng) {
      setCenter(location);
    }
  }, [location]);

  useEffect(() => {
    if (properties) {
      const propertiesCoordinates = properties.pages.flatMap((page) =>
        page.data.map((property) => ({
          key: property.name,
          location: {
            lat: property.lat,
            lng: property.long,
          },
        })),
      ) as Poi[] | [];
      setMarkers(propertiesCoordinates);
      console.log(center);
    }
  }, [properties]);
  return (
    <div className=" rounded-lg border shadow-md">
      <APIProvider
        apiKey={env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        {center && (
          <Map
            className="max-w-[700px] rounded-lg border shadow-lg lg:h-[600px] xl:h-[800px]"
            defaultZoom={10}
            center={center}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log(
                "camera changed:",
                ev.detail.center,
                "zoom:",
                ev.detail.zoom,
              )
            }
          >
            <PoiMarkers pois={markers} />
          </Map>
        )}
      </APIProvider>
    </div>
  );
}

const PoiMarkers = (props: { pois: Poi[] | [] }) => {
  const map = useMap();
  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent) => {
      if (!map) return;
      if (!ev.latLng) return;
      console.log("marker clicked:", ev.latLng.toString());
      map.panTo(ev.latLng);
    },
    [map],
  );
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <Marker
          key={poi.key}
          position={poi.location}
          onClick={handleClick}
          clickable={true}
        ></Marker>
      ))}
    </>
  );
};

export default TestMap;
