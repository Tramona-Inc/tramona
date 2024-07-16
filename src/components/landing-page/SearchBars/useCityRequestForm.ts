import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { useZodForm } from "@/utils/useZodForm";
import { getNumNights } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  defaultSearchOrReqValues,
  multiCityRequestSchema,
  type CityRequestDefaultVals,
} from "./schemas";

export function useCityRequestForm({
  setCurTab,
  afterSubmit,
  handleSetOpen,
  handleShowConfetti,
}: {
  setCurTab: (val: number) => void;
  afterSubmit?: (madeByGroupIds?: number[]) => void;
  handleSetOpen: (val: boolean) => void;
  handleShowConfetti: (val: boolean) => void;
}) {
  const form = useZodForm({
    schema: multiCityRequestSchema,
    defaultValues: { data: defaultSearchOrReqValues },
  });

  const { status } = useSession();
  const router = useRouter();
  const { mutateAsync: createRequests } =
    api.requests.createMultiple.useMutation();

  const onSubmit = form.handleSubmit(async ({ data }) => {
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
      localStorage.setItem("unsentRequests", JSON.stringify(newRequest));
      void router.push("/auth/signin").then(() => {
        toast({
          title: `Request saved: ${newRequest.location}`,
          description: "It will be sent after you sign in",
        });
      });
    } else {
      handleSetOpen(true);
      handleShowConfetti(true);
      await createRequests(newRequests)
        .then((result) => {
          // we need to do this instead of form.reset() since i
          // worked around needing to give defaultValues to useForm
          form.reset();

          form.setValue(
            "data",
            defaultSearchOrReqValues as CityRequestDefaultVals,
          );
          setCurTab(0);
          afterSubmit?.(result.madeByGroupIds);
        })
        .catch(() => errorToast());

      //figure out which hosts to send the request to
    }
  });

  return {
    form,
    onSubmit,
  };
}

export type CityRequestForm = ReturnType<typeof useCityRequestForm>["form"];
