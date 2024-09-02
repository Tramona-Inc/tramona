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
      localStorage.setItem("unsentRequests", JSON.stringify(newRequest));
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
        // scrape offers only for request in AZ, USA. this is a temp solution and need to be revamped
        if (newRequest.location.endsWith("AZ, USA")) {
          await scrapeOffers({ requestId: requestId, numOfOffers: 10 });
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
