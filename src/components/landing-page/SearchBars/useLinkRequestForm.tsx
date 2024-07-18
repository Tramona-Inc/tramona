import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { useZodForm } from "@/utils/useZodForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { linkRequestSchema } from "./schemas";

export function useLinkRequestForm({
  afterSubmit,
  handleSetOpen,
  handleShowConfetti,
}: {
  afterSubmit?: (madeByGroupIds?: number) => void;
  handleSetOpen: (val: boolean) => void;
  handleShowConfetti: (val: boolean) => void;
}) {
  const form = useZodForm({
    schema: linkRequestSchema,
  });

  const { status } = useSession();
  const router = useRouter();
  const { mutateAsync: createRequestWithLink } =
    api.requests.createRequestWithLink.useMutation();

  const onSubmit = form.handleSubmit(async (data) => {
    const { date: _date, ...restData } = data;
    const checkIn = data.date.from;
    const checkOut = data.date.to;

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
          form.reset();
          afterSubmit?.(result.transactionResults.madeByGroupId);
        })
        .catch(() => errorToast());
    }
  });

  return {
    form,
    onSubmit,
  };
}

export type LinkRequestForm = ReturnType<typeof useLinkRequestForm>["form"];
