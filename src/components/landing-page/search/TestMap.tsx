import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
  Pin,
  useMap,
  AdvancedMarker,
  useAdvancedMarkerRef,
  useApiIsLoaded,
} from "@vis.gl/react-google-maps";
import { BsHouseFill } from "react-icons/bs";

import Spinner from "@/components/_common/Spinner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [cameraProps, setCameraProps] = useState<MapCameraProps | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const map = useMap("9c8e46d54d7a528b");
  const apiIsLoaded = useApiIsLoaded();
  //getting the center for the map
  //converting the location name to coordinates

  const location = useMemo(() => {
    if (
      filters.filter?.lat !== undefined &&
      filters.filter?.long !== undefined
    ) {
      return {
        lat: filters.filter.lat,
        lng: filters.filter.long,
      };
    }
    return null;
  }, [filters]);

  useEffect(() => {
    if (location?.lat && location?.lng) {
      setCenter(location);
      if (map) {
        map.panTo(location);
        console.log("panning to location");
      } else {
        console.log("map not ready");
      }
    }
  }, [location, map]);

  useEffect(() => {
    if (properties) {
      const propertiesCoordinates = properties.pages.flatMap((page) =>
        page.data
          .filter((property) => property.lat !== null && property.long !== null)

          .map((property) => ({
            key: property.name,
            location: {
              lat: property.lat,
              lng: property.long,
            },
          })),
      ) as Poi[] | [];
      console.log(propertiesCoordinates);
      setMarkers(propertiesCoordinates);
      console.log(center);
    }
  }, [properties]);
  return (
    <div className=" max-w-[700px] rounded-lg border shadow-md lg:h-[600px] xl:h-[800px]">
      {apiIsLoaded ? (
        center && (
          <Map
            mapId="9c8e46d54d7a528b"
            id="9c8e46d54d7a528b"
            className=""
            defaultZoom={10}
            defaultCenter={center}
            reuseMaps={true}
            clickableIcons={true}
            mapTypeControl={false}
            gestureHandling={"cooperative"}
            fullscreenControl={true}
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
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}

const PoiMarkers = (props: { pois: Poi[] | [] }) => {
  const map = useMap("9c8e46d54d7a528b");
  const [AdvanceMarkerRef, advanceMarker] = useAdvancedMarkerRef();

  useEffect(() => {
    if (!advanceMarker) {
      return;
    }
  }, [advanceMarker]);

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
        <AdvancedMarker
          ref={AdvanceMarkerRef}
          key={poi.key}
          title={poi.key}
          position={poi.location}
          onClick={handleClick}
          clickable={true}
        >
          {" "}
          <BsHouseFill size={30} />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default TestMap;
