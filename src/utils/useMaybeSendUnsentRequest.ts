import { requestInsertSchema } from "@/server/db/schema";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "./api";
import { errorToast, successfulRequestToast } from "./toasts";
import { z } from "zod";

export function useMaybeSendUnsentRequest() {
  const { status } = useSession();

  const mutation = api.requests.create.useMutation();
  const utils = api.useUtils();

  useEffect(() => {
    if (status !== "authenticated") return;

    const unsentRequestJSON = localStorage.getItem("unsentRequest");
    if (!unsentRequestJSON) return;
    localStorage.removeItem("unsentRequest");

    const res = requestInsertSchema
      .omit({ userId: true })
      // overwrite checkIn and checkOut because JSON.parse doesnt handle dates
      .extend({ checkIn: z.coerce.date(), checkOut: z.coerce.date() })
      .safeParse(JSON.parse(unsentRequestJSON));

    if (!res.success) return;

    const { data: unsentRequest } = res;

    void (async () => {
      try {
        await mutation.mutateAsync(unsentRequest).catch(() => {
          throw new Error();
        });
        await utils.requests.invalidate();
        successfulRequestToast({
          ...unsentRequest,
          numGuests: unsentRequest.numGuests ?? 1,
        });
      } catch (e) {
        errorToast();
        localStorage.setItem("unsentRequest", unsentRequestJSON);
      }
    })();
  }, [mutation, status, utils.requests]);
}
