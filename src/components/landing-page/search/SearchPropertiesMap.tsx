import {
  Map,
  MapCameraChangedEvent,
  MapProps,
  useMap,
  useApiIsLoaded,
} from "@vis.gl/react-google-maps";
import Spinner from "@/components/_common/Spinner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";

import PoiMarkers from "./PoiMarkers";
export type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
  originalNightlyPrice: number;
  id: string;
  image: string;
};

function SearchPropertiesMap() {
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
  const [cameraProps, setCameraProps] = useState<MapProps | null>({
    mapId: "9c8e46d54d7a528b",
    id: "9c8e46d54d7a528b",
    reuseMaps: true,
    clickableIcons: true,
    mapTypeControl: false,
    gestureHandling: "cooperative",
    fullscreenControl: true,
  });
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
            originalNightlyPrice: property.originalNightlyPrice,
            id: property.id,
            image: property.imageUrls[0]!,
          })),
      ) as Poi[] | [];
      console.log(propertiesCoordinates);
      setMarkers(propertiesCoordinates);
      console.log(center);
    }
  }, [properties]);

  const handleCameraChanged = useCallback(
    (ev: MapCameraChangedEvent) => {
      const newCenter = {
        lat: ev.detail.center.lat,
        lng: ev.detail.center.lng,
      };
      setCenter(newCenter);
      console.log(newCenter);
      console.log("bounders");
      console.log(ev.detail.bounds);
    },
    [setCenter],
  );

  return (
    <div className=" max-w-[700px] rounded-md border shadow-md lg:h-[600px] xl:h-[800px]">
      {!filters ? (
        <div> Search a city</div>
      ) : apiIsLoaded ? (
        center && (
          <Map
            {...cameraProps}
            defaultZoom={10}
            defaultCenter={center!}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              handleCameraChanged(ev)
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

export default SearchPropertiesMap;
