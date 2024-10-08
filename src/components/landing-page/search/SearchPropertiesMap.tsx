import {
  Map,
  type MapCameraChangedEvent,
  type MapProps,
  useMap,
  useApiIsLoaded,
} from "@vis.gl/react-google-maps";
import Spinner from "@/components/_common/Spinner";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { debounce } from "lodash";

import PoiMarkers from "./PoiMarkers";
import { useAdjustedProperties } from "./AdjustedPropertiesContext";
import { useLoading } from "@/components/unclaimed-offers/UnclaimedMapLoadingContext";
import type { RouterOutputs } from "@/utils/api";
import type { InfiniteQueryObserverResult } from "@tanstack/react-query";

export type fetchNextPageOfAdjustedPropertiesType =
  RouterOutputs["properties"]["getByBoundaryInfiniteScroll"];

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
  setFunctionRef,
  mapBoundaries,
  setMapBoundaries,
}: {
  setFunctionRef: (
    ref: () => Promise<
      InfiniteQueryObserverResult<fetchNextPageOfAdjustedPropertiesType>
    >,
  ) => void;
  mapBoundaries: MapBoundary | null;
  setMapBoundaries: (boundaries: MapBoundary) => void;
}) {
  const filters = useCitiesFilter((state) => state);
  const { setIsLoading } = useLoading();
  const { adjustedProperties, setAdjustedProperties } = useAdjustedProperties();

  const [isFilterUndefined, setIsFilterUndefined] = useState(true);
  useEffect(() => {
    const isAnyFilterSet =
      filters.filter != null ||
      filters.guests > 0 ||
      filters.beds > 0 ||
      filters.bedrooms > 0 ||
      filters.bathrooms > 0 ||
      filters.houseRules.length > 0 ||
      filters.roomType != null ||
      filters.checkIn != null ||
      filters.checkOut != null ||
      filters.radius !== 50;

    setIsFilterUndefined(!isAnyFilterSet);
  }, [filters, setIsFilterUndefined]);

  const { data: initialProperties } =
    api.properties.getAllInfiniteScroll.useInfiniteQuery(
      {
        guests: filters.guests,
        beds: filters.beds,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        maxNightlyPrice: filters.maxNightlyPrice,
        latLngPoint: filters.filter ? {
          lat: filters.filter.lat,
          lng: filters.filter.long,
        } : undefined,
        houseRules: filters.houseRules,
        roomType: filters.roomType,
        checkIn: filters.checkIn,
        checkOut: filters.checkOut,
        radius: filters.radius,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
      },
    );

  const [markers, setMarkers] = useState<Poi[]>([]);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);

  const [cameraProps] = useState<MapProps | null>({
    mapId: "9c8e46d54d7a528b",
    id: "9c8e46d54d7a528b",
    reuseMaps: true,
    clickableIcons: true,
    mapTypeControl: false,
    gestureHandling: "cooperative",
    fullscreenControl: true,
  });

  const map = useMap("9c8e46d54d7a528b");
  const apiIsLoaded = useApiIsLoaded();

  const {
    data: fetchedAdjustedProperties,
    fetchNextPage: fetchNextPageOfAdjustedProperties,
    isLoading,
    isFetching,
  } = api.properties.getByBoundaryInfiniteScroll.useInfiniteQuery(
    {
      boundaries: mapBoundaries,
      latLngPoint: filters.filter ? {
        lat: filters.filter.lat,
        lng: filters.filter.long,
      } : undefined,
      radius: filters.radius,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    setIsLoading(isLoading || isFetching);
  }, [isLoading, isFetching, setIsLoading]);

  useEffect(() => {
    if (fetchedAdjustedProperties) {
      console.log("setting adjusted properties");
      setAdjustedProperties(fetchedAdjustedProperties);
    }
  }, [fetchedAdjustedProperties, setAdjustedProperties]);

  const location = useMemo(() => {
    if (filters.filter) {
      return {
        lat: filters.filter.lat,
        lng: filters.filter.long,
      };
    }
    return null;
  }, [filters]);

  useEffect(() => {
    console.log("setting function ref from propertiesMap");
    setFunctionRef(fetchNextPageOfAdjustedProperties);
  }, [fetchNextPageOfAdjustedProperties, setFunctionRef]);

  useEffect(() => {
    if (location?.lat && location.lng) {
      setCenter(location);
      if (map) {
        map.panTo(location);
        console.log("panning to location");
      } else {
        console.log("map not ready");
      }
    }
  }, [location, map]);

  const propertiesCoordinates = useMemo(() => {
    if (adjustedProperties && mapBoundaries !== null) {
      return adjustedProperties.pages.flatMap((page) =>
        page.data.map((property) => ({
          key: property.name,
          location: {
            lat: property.latLngPoint.y,
            lng: property.latLngPoint.x,
          },
          originalNightlyPrice: property.originalNightlyPrice,
          id: `${property.id}`,
          image: property.imageUrls[0]!,
        })),
      );
    } else if (initialProperties) {
      return initialProperties.pages.flatMap((page) =>
        page.data.map((property) => ({
          key: property.name,
          location: {
            lat: property.latLngPoint.y,
            lng: property.latLngPoint.x,
          },
          originalNightlyPrice: property.originalNightlyPrice,
          id: `${property.id}`,
          image: property.imageUrls[0]!,
        })),
      );
    }
    return [];
  }, [adjustedProperties, initialProperties, mapBoundaries]);

  useEffect(() => {
    setMarkers(propertiesCoordinates as Poi[]);
  }, [propertiesCoordinates]);

  const handleCameraChanged = debounce((ev: MapCameraChangedEvent) => {
    const newCenter = {
      lat: ev.detail.center.lat,
      lng: ev.detail.center.lng,
    };
    setCenter(newCenter);

    setMapBoundaries({
      north: ev.detail.bounds.north,
      south: ev.detail.bounds.south,
      east: ev.detail.bounds.east,
      west: ev.detail.bounds.west,
    });
    void fetchNextPageOfAdjustedProperties();
  }, 700);

  return (
    <div className="h-full w-full">
      {isFilterUndefined ? (
        <div className="flex h-full w-full items-center justify-center rounded-xl border shadow-md">
          Search for a city...
        </div>
      ) : apiIsLoaded ? (
        center && (
          <Map
            {...cameraProps}
            defaultZoom={6}
            defaultCenter={center}
            onCameraChanged={handleCameraChanged}
            disableDefaultUI={true}
            zoomControl={true}
            fullscreenControl={false}
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
