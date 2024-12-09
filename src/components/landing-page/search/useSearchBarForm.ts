import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { useZodForm } from "@/utils/useZodForm";
import { useEffect } from "react";
import { defaultSearchOrReqValues, searchSchema } from "./schemas";

export function useSearchBarForm({
  afterSubmit = undefined,
}: {
  afterSubmit?: () => void;
} = {}) {
  const form = useZodForm({
    schema: searchSchema,
    defaultValues: defaultSearchOrReqValues,
    reValidateMode: "onSubmit",
  });

  const { guests, filter, maxNightlyPrice, checkIn, checkOut } =
    useCitiesFilter((state) => state);

  const setGuests = useCitiesFilter((state) => state.setGuests);
  const setFilter = useCitiesFilter((state) => state.setFilter);
  const setLocationBoundingBox = useCitiesFilter(
    (state) => state.setLocationBoundingBox,
  );
  const setMaxNightlyPrice = useCitiesFilter(
    (state) => state.setMaxNightlyPrice,
  );
  const setCheckIn = useCitiesFilter((state) => state.setCheckIn);
  const setCheckOut = useCitiesFilter((state) => state.setCheckOut);

  useEffect(() => {
    if (!filter) form.setValue("location", undefined);
    if (!checkIn) form.setValue("checkIn", undefined);
    if (!checkOut) form.setValue("checkOut", undefined);
    if (!guests) form.setValue("numGuests", undefined);
    if (!maxNightlyPrice) form.setValue("maxNightlyPriceUSD", undefined);
  }, [checkIn, checkOut, filter, form, guests, maxNightlyPrice]);

  const utils = api.useUtils();

  const onSubmit = form.handleSubmit(
    async ({ checkIn, checkOut, location, maxNightlyPriceUSD, numGuests }) => {
      if (location) {
        const { coordinates } = await utils.offers.getCoordinates.fetch({
          location,
        });

        const { lat, lng } = coordinates.location!;

        const bounds = coordinates.bounds;

        setFilter({
          id: "",
          label: "",
          lat,
          long: lng,
        });

        if (bounds) {
          const { northeast, southwest } = bounds;
          const { lat: northeastLat, lng: northeastLng } = northeast;
          const { lat: southwestLat, lng: southwestLng } = southwest;

          setLocationBoundingBox({
            northeastLat,
            northeastLng,
            southwestLat,
            southwestLng,
          });
        }
      } else {
        setFilter(undefined);
      }

      setGuests(numGuests ?? 0);
      setMaxNightlyPrice((maxNightlyPriceUSD ?? 0) * 100);
      setCheckIn(checkIn);
      setCheckOut(checkOut);

      afterSubmit?.();
    },
  );

  return {
    form,
    onSubmit,
  };
}
