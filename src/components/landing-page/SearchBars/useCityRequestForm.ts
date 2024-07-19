import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { useZodForm } from "@/utils/useZodForm";
import { getNumNights } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { cityRequestSchema } from "./schemas";

export function useCityRequestForm({
  afterSubmit,
  handleSetOpen,
  handleShowConfetti,
}: {
  afterSubmit?: (madeByGroupIds?: number) => void;
  handleSetOpen: (val: boolean) => void;
  handleShowConfetti: (val: boolean) => void;
}) {
  const form = useZodForm({
    schema: cityRequestSchema,
    defaultValues: {
      amenities: [],
    },
  });

  const { status } = useSession();
  const router = useRouter();
  const { mutateAsync: createRequests } = api.requests.create.useMutation();

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
      localStorage.setItem("unsentRequests", JSON.stringify(newRequest));
      void router.push("/auth/signin").then(() => {
        toast({
          title: `Request saved: ${newRequest.location}`,
          description: "It will be sent after you sign in",
        });
      });
    } else {
      console.log("newRequest", newRequest);
      handleSetOpen(true);
      handleShowConfetti(true);
      console.log("newRequest", newRequest);
      await createRequests(newRequest)
        .then((result) => {
          form.reset();
          afterSubmit?.(result.transactionResults.madeByGroupId);
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
