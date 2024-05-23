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

function SearchPropertiesMap() {
  const filters = useCitiesFilter((state) => state);
  //Map data after user searches
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

  //everthing related to the map camera changing to get new properties with boundaries
  const [mapBoundaries, setMapBoundaries] = useState<MapBoundary | null>(null);

  //data for when the map moves
  const { data: adjustedProperties } =
    api.properties.getByBoundaryInfiniteScroll.useInfiniteQuery(
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

  //moves camera to new seach location
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

  //setting markers for new properties
  useEffect(() => {
    if (adjustedProperties && mapBoundaries !== null) {
      const propertiesCoordinates = adjustedProperties.pages.flatMap((page) =>
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
      console.log("this is the adjustwed properties");
      setMarkers(propertiesCoordinates);
      console.log(center);
    } else if (initialProperties) {
      const propertiesCoordinates = initialProperties.pages.flatMap((page) =>
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
      // console.log("this is the initial properties");
      console.log(propertiesCoordinates);
      setMarkers(propertiesCoordinates);
      console.log(center);
    }
  }, [initialProperties, adjustedProperties, mapBoundaries]);

  //for when the user moves map
  const handleCameraChanged = useCallback(
    (ev: MapCameraChangedEvent) => {
      const newCenter = {
        lat: ev.detail.center.lat,
        lng: ev.detail.center.lng,
      };
      setCenter(newCenter);
      console.log(newCenter);
      console.log("bounderies");
      console.log(ev.detail.bounds);
      setMapBoundaries({
        north: ev.detail.bounds.north,
        south: ev.detail.bounds.south,
        east: ev.detail.bounds.east,
        west: ev.detail.bounds.west,
      });

      // if (mapBoundaries) {
      //   //call the api to get new properties
      //   properties = fetchBoundaryProperties(mapBoundaries);
      //   console.log("properties");
      //   console.log(properties);
      // }
    },

    [setCenter],
  );

  //fetch data once map sits
  // const fetchBoundaryProperties = useCallback(
  //   (mapBoundaries: MapBoundary) => {
  //     return api.properties.getByBoundaryInfiniteScroll.useInfiniteQuery(
  //       {
  //         boundaries: {
  //           north: mapBoundaries.north,
  //           east: mapBoundaries.east,
  //           south: mapBoundaries.south,
  //           west: mapBoundaries.west,
  //         },
  //         guests: filters.guests,
  //         beds: filters.beds,
  //         bedrooms: filters.bedrooms,
  //         bathrooms: filters.bathrooms,
  //         maxNightlyPrice: filters.maxNightlyPrice,
  //         lat: filters.filter?.lat,
  //         long: filters.filter?.long,
  //         houseRules: filters.houseRules,
  //         roomType: filters.roomType,
  //         checkIn: filters.checkIn,
  //         checkOut: filters.checkOut,
  //         radius: filters.radius,
  //       },
  //       {
  //         getNextPageParam: (lastPage) => lastPage.nextCursor,
  //       },
  //     );
  //   },
  //   [filters],
  // );

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
