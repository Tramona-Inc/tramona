import { useRouter } from "next/router";
import { useMap, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { formatCurrency } from "@/utils/utils";
import { type Poi } from "./SearchPropertiesMap";
import { useCallback, useState } from "react";
import Image from "next/image";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";

const PoiMarkers = (props: { pois: Poi[] | [] }) => {
  const [_selectedMarker, setSelectedMarker] = useState<Poi | null>(null);
  const [infoWindowShownIndex, setInfoWindowShownIndex] = useState<
    number | null
  >(null);
  const map = useMap("9c8e46d54d7a528b");
  const router = useRouter();

  const handleMarkerClick = useCallback(
    (poi: Poi, index: number) => {
      if (!map) return;
      setSelectedMarker(poi);
      setInfoWindowShownIndex((prevIndex) =>
        prevIndex === index ? null : index,
      );
    },
    [map],
  );

  const handleClose = useCallback(() => {
    setSelectedMarker(null);
    setInfoWindowShownIndex(null);
  }, []);

  return (
    <div>
      {props.pois.map((poi: Poi, index) => (
        <div key={index}>
          <AdvancedMarker
            title={poi.key}
            position={poi.location}
            onClick={() => handleMarkerClick(poi, index)}
            clickable={true}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="z-40 rounded-xl bg-primaryGreen p-2 text-white">
                {formatCurrency(
                  poi.originalNightlyPrice * AVG_AIRBNB_MARKUP,
                ).trim()}
                /night
              </div>
            </div>
          </AdvancedMarker>
          {infoWindowShownIndex === index && (
            <InfoWindow
              position={poi.location}
              onCloseClick={handleClose}
              pixelOffset={[0, -25]}
            >
              <div className="flex items-center justify-center overscroll-x-none rounded-xl">
                <div
                  onClick={() => void router.push(`/property/${poi.id}`)}
                  className="ml-2 mr-1 flex max-w-72 cursor-pointer flex-col items-center justify-center gap-y-1 text-left text-sm font-medium"
                >
                  <Image
                    src={poi.image}
                    className="w-full rounded-lg border object-fill shadow-md"
                    width={260}
                    height={200}
                    alt=""
                  />
                  {poi.key}
                  <span className="text-center text-sm font-semibold">
                    {" "}
                    {formatCurrency(
                      poi.originalNightlyPrice * AVG_AIRBNB_MARKUP,
                    )}
                    /night{" "}
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

export default PoiMarkers;
