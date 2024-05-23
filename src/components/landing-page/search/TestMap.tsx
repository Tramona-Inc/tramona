import {
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
  useMap,
  AdvancedMarker,
  useAdvancedMarkerRef,
  useApiIsLoaded,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { BsHouseFill } from "react-icons/bs";
import { formatCurrency } from "@/utils/utils";

import Spinner from "@/components/_common/Spinner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";

import { useRouter } from "next/router";

type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
  originalNightlyPrice: number;
  id: string;
};

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
            originalNightlyPrice: property.originalNightlyPrice,
            id: property.id,
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
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [selectedMarker, setSelectedMarker] = useState<Poi | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState<{
    [key: number]: boolean;
  }>({});

  const map = useMap("9c8e46d54d7a528b");
  const router = useRouter();
  const handleMarkerClick = useCallback((poi: Poi) => {
    console.log(poi);
    if (!map) return;
    if (!poi) return;
    console.log("marker clicked");
    console.log(poi.location);
  }, []);

  const toggleShowInfoWindow = (index: number) => {
    setInfoWindowShown((prevShow) => ({
      ...prevShow,
      [index]: !prevShow[index],
    }));
  };

  const handleClose = useCallback(() => {
    setSelectedMarker(null);
    setInfoWindowShown((prevShow) => {
      const newShow: Record<number, boolean> = { ...prevShow };
      Object.keys(newShow).forEach((key) => {
        const index = parseInt(key);
        if (!isNaN(index)) {
          newShow[index] = false;
        }
      });
      return newShow;
    });
  }, []);

  // useEffect(() => {
  //   console.log(selectedMarker);
  // }, [selectedMarker]);

  return (
    <div>
      {props.pois.map((poi: Poi, index) => (
        <div key={index}>
          <AdvancedMarker
            title={poi.key}
            position={poi.location}
            onClick={() => {
              handleMarkerClick(poi);
              toggleShowInfoWindow(index);
              setSelectedMarker(poi); // Set the clicked marker as the selected marker
            }}
            clickable={true}
          >
            <BsHouseFill size={30} />
          </AdvancedMarker>
          {infoWindowShown[index] && (
            <InfoWindow
              position={poi.location}
              onCloseClick={handleClose}
              pixelOffset={[0, -25]}
            >
              <div className="">
                <div
                  onClick={() => void router.push(`/property/${poi.id}`)}
                  className=" flex cursor-pointer flex-col gap-y-1 text-center text-xs"
                >
                  {poi.key}
                  <span className="text-sm font-semibold">
                    {" "}
                    {formatCurrency(poi.originalNightlyPrice)}/Night{" "}
                  </span>
                </div>
              </div>
            </InfoWindow>
          )}
        </div>
      ))}
    </div>
  );
};

export default TestMap;
