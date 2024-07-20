import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { useZodForm } from "@/utils/useZodForm";
import { searchSchema } from "./schemas";

export function useSearchBarForm({
  afterSubmit = undefined,
}: {
  afterSubmit?: () => void;
} = {}) {
  const form = useZodForm({
    schema: searchSchema,
    reValidateMode: "onSubmit",
  });

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

  const utils = api.useUtils();

  const onSubmit = form.handleSubmit(
    async ({ date, location, maxNightlyPriceUSD, numGuests }) => {
      if (location) {
        const { coordinates } = await utils.offers.getCoordinates.fetch({
          location,
        });

        const { lat, lng } = coordinates.location!;

        const bounds = coordinates.bounds;

        setFilter({
          id: "",
          label: location,
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
      setCheckIn(date.from);
      setCheckOut(date.to);

      afterSubmit?.();
    },
  );

  return {
    form,
    onSubmit,
  };
}
