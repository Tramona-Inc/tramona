import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { useZodForm } from "@/utils/useZodForm";
import { getNumNights } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  defaultSearchOrReqValues,
  multiLinkRequestSchema,
  type MultiLinkRequestVals,
} from "./schemas";

export function useLinkRequestForm({
  setCurTab,
  afterSubmit,
  handleSetOpen,
  handleShowConfetti,
}: {
  setCurTab: (val: number) => void;
  afterSubmit?: (madeByGroupIds?: number) => void;
  handleSetOpen: (val: boolean) => void;
  handleShowConfetti: (val: boolean) => void;
}) {
  const form = useZodForm({
    schema: multiLinkRequestSchema,
    defaultValues: { data: defaultSearchOrReqValues },
  });

  const { status } = useSession();
  const router = useRouter();
  const { mutateAsync: createRequestWithLink } =
    api.requests.createRequestWithLink.useMutation();

  const onSubmit = form.handleSubmit(async ({ data }) => {
    const { date: _date, ...restData } = data;
    const checkIn = data.date.from;
    const checkOut = data.date.to;
    const numNights = getNumNights(checkIn, checkOut);

    const newRequests = {
      checkIn: checkIn,
      checkOut: checkOut,
      ...restData,
    };

    if (status === "unauthenticated") {
      localStorage.setItem("unsentRequests", JSON.stringify(newRequests));
      void router.push("/auth/signin").then(() => {
        toast({
          title: `Request saved: ${newRequests.airbnbLink}`,
          description: "It will be sent after you sign in",
        });
      });
    } else {
      handleSetOpen(true);
      handleShowConfetti(true);
      await createRequestWithLink(newRequests)
        .then((result) => {
          // we need to do this instead of form.reset() since i
          // worked around needing to give defaultValues to useForm
          form.reset();

          form.setValue(
            "data",
            defaultSearchOrReqValues as MultiLinkRequestVals["data"],
          );
          setCurTab(0);
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

export type LinkRequestForm = ReturnType<typeof useLinkRequestForm>["form"];
