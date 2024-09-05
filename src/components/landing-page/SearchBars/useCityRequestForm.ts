import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { useZodForm } from "@/utils/useZodForm";
import { getNumNights } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { cityRequestSchema } from "./schemas";
import SuperJSON from "superjson";

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const isInIntegrityArizonaOperatingArea = (
  lat: number,
  lng: number,
  radius: number,
) => {
  const locations = [
    { name: "Lake Havasu", lat: 34.4839, lng: -114.3225 },
    { name: "Parker Strip", lat: 34.2983, lng: -114.1439 },
  ];

  for (const location of locations) {
    const distance = haversineDistance(lat, lng, location.lat, location.lng);
    if (distance <= radius) {
      return { isInArea: true, location: location.name };
    }
  }

  return { isInArea: false, location: "dummy" };
};

export function useCityRequestForm({
  afterSubmit,
  setMadeByGroupId,
}: {
  afterSubmit?: () => void;
  setMadeByGroupId?: (val: number) => void;
}) {
  const form = useZodForm({
    schema: cityRequestSchema,
    defaultValues: { amenities: [] },
  });

  const { status } = useSession();
  const router = useRouter();
  const { mutateAsync: createRequests } = api.requests.create.useMutation();
  const { mutateAsync: scrapeOffers } =
    api.offers.scrapeOfferForRequest.useMutation();


  const onSubmit = form.handleSubmit(async (data) => {
    const { date: _date, maxNightlyPriceUSD, ...restData } = data;
    const checkIn = data.date.from;
    const checkOut = data.date.to;
    const numNights = getNumNights(checkIn, checkOut);

    const newRequest = {
      checkIn: checkIn,
      checkOut: checkOut,
      maxTotalPrice: Math.round(numNights * maxNightlyPriceUSD * 100),
      ...restData,
    };

    if (status === "unauthenticated") {
      localStorage.setItem("unsentRequest", SuperJSON.stringify(newRequest));
      void router.push("/auth/signin").then(() => {
        toast({
          title: `Request saved: ${newRequest.location}`,
          description: "It will be sent after you sign in",
        });
      });
    } else {
      try {
        const { requestId, madeByGroupId } = await createRequests(newRequest);
        form.reset();
        afterSubmit?.();
        setMadeByGroupId?.(madeByGroupId);
        // scrape offers only for request in the area where IntegrityArizona has properties
        const { isInArea, location } = isInIntegrityArizonaOperatingArea(
          newRequest.latLng.lat,
          newRequest.latLng.lng,
          25, // search radius: 25 km
        );
        if (isInArea) {
          await scrapeOffers({
            requestId: requestId,
            numOfOffers: 10,
            scrapersToExecute: ["arizonaScraper"],
            location: location,
          });
        }
      } catch (error) {
        errorToast();
      }

    }
  });

  return {
    form,
    onSubmit,
  };
}

export type CityRequestForm = ReturnType<typeof useCityRequestForm>["form"];
