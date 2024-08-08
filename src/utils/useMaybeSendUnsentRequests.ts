import { requestInsertSchema } from "@/server/db/schema";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "./api";
import { errorToast, successfulRequestToast } from "./toasts";
import { z } from "zod";

export function useMaybeSendUnsentRequests() {
  const { status } = useSession();

  const { mutateAsync: createRequests } = api.requests.create.useMutation();

  useEffect(() => {
    if (status !== "authenticated") return;

    const unsentRequestsJSON = localStorage.getItem("unsentRequests");
    if (!unsentRequestsJSON) return;
    localStorage.removeItem("unsentRequests");

    const res = requestInsertSchema
      .omit({ madeByGroupId: true, requestGroupId: true })
      // overwrite checkIn and checkOut because JSON.parse doesnt handle dates
      .extend({ checkIn: z.coerce.date(), checkOut: z.coerce.date() })
      .safeParse(JSON.parse(unsentRequestsJSON));

    if (!res.success) return;

    const { data: unsentRequest } = res;

    void createRequests(unsentRequest)
      .then(() => successfulRequestToast(unsentRequest))
      .catch(() => {
        errorToast();
        localStorage.setItem("unsentRequests", unsentRequestsJSON);
      });
  }, [createRequests, status]);
}
