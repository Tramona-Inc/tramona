import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { useZodForm } from "@/utils/useZodForm";
import { getNumNights } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  type CityRequestDefaultVals,
  defaultSearchOrReqValues,
  multiCityRequestSchema,
} from "./schemas";

// import {CongratsDialog} from './CongratsDialog'

export function useCityRequestForm({
  setCurTab,
  afterSubmit,
}: {
  setCurTab: (val: number) => void;
  afterSubmit?: (madeByGroupIds?: number[]) => void;
}) {
  // const [open, setOpen] = useState(true);
  const form = useZodForm({
    schema: multiCityRequestSchema,
    defaultValues: { data: [defaultSearchOrReqValues] },
  });

  const { status } = useSession();
  const router = useRouter();
  const { mutateAsync: createRequests } =
    api.requests.createMultiple.useMutation();

  const onSubmit = form.handleSubmit(async ({ data }) => {
    // const CongratsDialog = (): ReactElement => {
    //   return (
    //     <CongratsDialog />
    //   )
    // };
    const newRequests = data.map((request) => {
      const { date: _date, maxNightlyPriceUSD, ...restData } = request;
      const checkIn = request.date.from;
      const checkOut = request.date.to;
      const numNights = getNumNights(checkIn, checkOut);

      return {
        checkIn: checkIn,
        checkOut: checkOut,
        maxTotalPrice: Math.round(numNights * maxNightlyPriceUSD * 100),
        ...restData,
      };
    });
    // const CongratsDialog = () => (
    //   <>
    //   <congratsDialog />
    //   </>
    // );

    if (status === "unauthenticated") {
      localStorage.setItem("unsentRequests", JSON.stringify(newRequests));
      localStorage.setItem("showCongratsDialog", "true")
      void router.push("/auth/signin").then(() => {
        if (newRequests.length === 1) {
          toast({
            title: `Request saved: ${newRequests[0]!.location}`,
            description: "It will be sent after you sign in",
          });
        } else {
          toast({
            title: `Saved ${newRequests.length} requests`,
            description: "They will be sent after you sign in",
          });
        }
      });
    } else {
      await createRequests(newRequests)
        .then((result) => {

          // we need to do this instead of form.reset() since i
          // worked around needing to give defaultValues to useForm
          form.reset();

          form.setValue("data", [
            defaultSearchOrReqValues as CityRequestDefaultVals,
          ]);
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
