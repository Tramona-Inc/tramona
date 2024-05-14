import { useZodForm } from "@/utils/useZodForm";
import { searchSchema, defaultSearchOrReqValues } from "./schemas";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { api } from "@/utils/api";

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

  const setGuests = useCitiesFilter((state) => state.setGuests);
  const setFilter = useCitiesFilter((state) => state.setFilter);
  const setMaxNightlyPrice = useCitiesFilter(
    (state) => state.setMaxNightlyPrice,
  );
  const setCheckIn = useCitiesFilter((state) => state.setCheckIn);
  const setCheckOut = useCitiesFilter((state) => state.setCheckOut);

  const utils = api.useUtils();

  const onSubmit = form.handleSubmit(
    async ({ date, location, maxNightlyPriceUSD, numGuests }) => {
      if (location) {
        const {
          coordinates: { lat, lng },
        } = await utils.offers.getCoordinates.fetch({
          location,
        });

        setFilter({ id: "", label: "", lat, long: lng });
      } else {
        setFilter(undefined);
      }

      setGuests(numGuests ?? 0);
      setMaxNightlyPrice((maxNightlyPriceUSD ?? 0) * 100);
      setCheckIn(date?.from);
      setCheckOut(date?.to);

      afterSubmit?.();
    },
  );

  return {
    form,
    onSubmit,
  };
}
