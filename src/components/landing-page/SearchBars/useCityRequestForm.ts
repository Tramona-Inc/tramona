import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { useZodForm } from "@/utils/useZodForm";
import { getNumNights } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { cityRequestSchema } from "./schemas";
import SuperJSON from "superjson";

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
  const { mutateAsync: createRequests, isLoading: isSubmitting } =
    api.requests.create.useMutation();

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
        console.log("newRequest", newRequest);
        const { madeByGroupId } = await createRequests(newRequest);
        form.reset();
        afterSubmit?.();
        setMadeByGroupId?.(madeByGroupId);
      } catch (error) {
        errorToast();
      }
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting,
  };
}

export type CityRequestForm = ReturnType<typeof useCityRequestForm>["form"];
