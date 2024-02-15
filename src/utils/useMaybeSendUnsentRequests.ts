import { requestInsertSchema } from "@/server/db/schema";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "./api";
import { errorToast, successfulRequestToast } from "./toasts";
import { z } from "zod";

export function useMaybeSendUnsentRequests() {
  const { status } = useSession();

  const mutation = api.requests.create.useMutation();
  const utils = api.useUtils();

  useEffect(() => {
    if (status !== "authenticated") return;

    const unsentRequestsJSON = localStorage.getItem("unsentRequests");
    if (!unsentRequestsJSON) return;
    localStorage.removeItem("unsentRequests");

    const res = requestInsertSchema
      .omit({ userId: true })
      // overwrite checkIn and checkOut because JSON.parse doesnt handle dates
      .extend({ checkIn: z.coerce.date(), checkOut: z.coerce.date() })
      .safeParse(JSON.parse(unsentRequestsJSON));

    if (!res.success) return;

    const { data: unsentRequests } = res;

    void (async () => {
      try {
        await mutation.mutateAsync(unsentRequests).catch(() => {
          throw new Error();
        });
        await utils.requests.invalidate();
        successfulRequestToast({
          ...unsentRequests,
          numGuests: unsentRequests.numGuests ?? 1,
        });
      } catch (e) {
        errorToast();
        localStorage.setItem("unsentRequests", unsentRequestsJSON);
      }
    })();
  }, [mutation, status, utils.requests]);
}
