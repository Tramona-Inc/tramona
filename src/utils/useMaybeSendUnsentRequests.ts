import {
  MAX_REQUEST_GROUP_SIZE,
  requestInsertSchema,
} from "@/server/db/schema";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "./api";
import { errorToast, successfulRequestToast } from "./toasts";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";

export function useMaybeSendUnsentRequests() {
  const { status } = useSession();

  const { mutateAsync: createRequests } =
    api.requests.createMultiple.useMutation();
  const utils = api.useUtils();

  useEffect(() => {
    if (status !== "authenticated") return;

    const unsentRequestsJSON = localStorage.getItem("unsentRequests");
    if (!unsentRequestsJSON) return;
    localStorage.removeItem("unsentRequests");

    const res = requestInsertSchema
      .omit({ madeByGroupId: true, requestGroupId: true })
      // overwrite checkIn and checkOut because JSON.parse doesnt handle dates
      .extend({ checkIn: z.coerce.date(), checkOut: z.coerce.date() })
      .array()
      .nonempty()
      .max(MAX_REQUEST_GROUP_SIZE)
      .safeParse(JSON.parse(unsentRequestsJSON));

    if (!res.success) return;

    const { data: unsentRequests } = res;

    void (async () => {
      try {
        createRequests(unsentRequests).catch(() => {
          throw new Error();
        });
        await utils.requests.invalidate();

        if (unsentRequests.length === 1) {
          const req = unsentRequests[0];
          successfulRequestToast({
            ...req,
            numGuests: req.numGuests ?? 1,
          });
        } else {
          toast({
            title: `Successfully submitted ${unsentRequests.length} requests`,
          });
        }
      } catch (e) {
        errorToast();
        localStorage.setItem("unsentRequests", unsentRequestsJSON);
      }
    })();
  }, [createRequests, status, utils.requests]);
}
