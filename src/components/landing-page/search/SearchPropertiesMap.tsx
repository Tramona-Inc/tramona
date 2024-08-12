import {
  Map,
  type MapCameraChangedEvent,
  type MapProps,
  useMap,
  useApiIsLoaded,
} from "@vis.gl/react-google-maps";
import Spinner from "@/components/_common/Spinner";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { debounce } from "lodash";

import PoiMarkers from "./PoiMarkers";
import { useAdjustedProperties } from "./AdjustedPropertiesContext";

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
  setFunctionRef,
}: {
  isFilterUndefined: boolean;
  setFunctionRef: (ref: any) => void;
}) {
  //zustand
  const filters = useCitiesFilter((state) => state);
  const setFilter = useCitiesFilter((state) => state.setFilter);
  const setRadius = useCitiesFilter((state) => state.setRadius);
  const { adjustedProperties, setAdjustedProperties } = useAdjustedProperties();

  const { data: initialProperties } =
    api.properties.getAllInfiniteScroll.useInfiniteQuery(
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
        refetchOnWindowFocus: false,
      },
    );

  const [markers, setMarkers] = useState<Poi[]>([]);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  //this is so the map doesnt rerender whe nthe filter changes

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

  //this is for when the user moves the camera
  const {
    data: fetchedAdjustedProperties,
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
      refetchOnWindowFocus: false,
    },
  );
  //when the user presses search
  //saving search as the new location

  useEffect(() => {
    if (fetchedAdjustedProperties) {
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

  //w2hen the SearchListing fetched new properties get the query here
  useEffect(() => {
    console.log("setting function ref from propertiesMap");
    setFunctionRef(fetchNextPageOfAdjustedProperties);
  }, [fetchNextPageOfAdjustedProperties, setFunctionRef]);

  // When the filter changes the location, this use effect will pan the map to the new location
  useEffect(() => {
    //I dont wnat this to run if the center was set by the camera change
    if (location?.lat && location.lng) {
      setCenter(location);
      if (map) {
        map.panTo(location);
        console.log("panning to location");
      } else {
        console.log("map not ready");
      }
    }
  }, [location, map]); //use to be map but is now location // my goal is to make this only run if the

  const propertiesCoordinates = useMemo(() => {
    if (adjustedProperties && mapBoundaries !== null) {
      return adjustedProperties.pages.flatMap((page) =>
        page.data.map((property) => ({
          key: property.name,
          location: {
            lat: property.lat,
            lng: property.long,
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
            lat: property.lat,
            lng: property.long,
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
    <div
      className={`max-w-[700px] rounded-md border shadow-md md:mt-0 md:h-[720px] lg:h-[600px] xl:h-[800px] ${isFilterUndefined ? `h-[705px]` : `h-[705px]`}`}
    >
      {isFilterUndefined ? (
        <div className="flex h-full items-center justify-center">
          Search for a city...
        </div>
      ) : apiIsLoaded ? (
        center && (
          <Map
            {...cameraProps}
            defaultZoom={10}
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
