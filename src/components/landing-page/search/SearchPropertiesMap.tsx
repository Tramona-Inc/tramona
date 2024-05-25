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
import { debounce } from "lodash";

import PoiMarkers from "./PoiMarkers";
import MapBoundary from "./MapBoundary";

export type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
  originalNightlyPrice: number;
  id: string;
  image: string;
};

export type MapBoundary = {
  north: number;
  south: number;
  east: number;
  west: number;
};

function SearchPropertiesMap({
  isFilterUndefined,
}: {
  isFilterUndefined: boolean;
}) {
  //zustand
  const filters = useCitiesFilter((state) => state);
  const setFilter = useCitiesFilter((state) => state.setFilter);
  const setRadius = useCitiesFilter((state) => state.setRadius);

  const {
    data: initialProperties,
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

  const [markers, setMarkers] = useState<Poi[]>([]);
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

  const [mapBoundaries, setMapBoundaries] = useState<MapBoundary | null>(null);

  const {
    data: adjustedProperties,
    fetchNextPage: fetchNextPageOfAdjustedProperties,
  } = api.properties.getByBoundaryInfiniteScroll.useInfiniteQuery(
    {
      boundaries: mapBoundaries,
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
  }, [map]);

  const propertiesCoordinates = useMemo(() => {
    if (adjustedProperties && mapBoundaries !== null) {
      return adjustedProperties.pages.flatMap((page) =>
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
    } else if (initialProperties) {
      return initialProperties.pages.flatMap((page) =>
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
    }
    return [];
  }, [adjustedProperties, initialProperties, mapBoundaries]);

  useEffect(() => {
    setMarkers(propertiesCoordinates);
  }, [propertiesCoordinates]);

  const handleCameraChanged = useCallback(
    debounce((ev: MapCameraChangedEvent) => {
      const newCenter = {
        lat: ev.detail.center.lat,
        lng: ev.detail.center.lng,
      };
      setCenter(newCenter);
      setFilter({
        lat: newCenter.lat,
        long: newCenter.lng,
        id: "",
        label: "",
      });
      console.log(newCenter);
      console.log("boundaries");
      console.log(ev.detail.bounds);
      setMapBoundaries({
        north: ev.detail.bounds.north,
        south: ev.detail.bounds.south,
        east: ev.detail.bounds.east,
        west: ev.detail.bounds.west,
      });
      void fetchNextPageOfAdjustedProperties();
    }, 1100),
    [setCenter, fetchNextPageOfAdjustedProperties, setFilter],
  );

  return (
    <div
      className={`  max-w-[700px] rounded-md border shadow-md md:mt-0 md:h-[720px] lg:h-[600px] xl:h-[800px] ${isFilterUndefined ? `h-[705px]` : `h-[795px]`}`}
    >
      {isFilterUndefined ? (
        <div className="flex h-full items-center justify-center">
          {" "}
          Search for a city...
        </div>
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
