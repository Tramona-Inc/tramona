import { NewRequest, requestInsertSchema } from "@/server/db/schema";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api, RouterInputs } from "./api";
import { errorToast, successfulRequestToast } from "./toasts";
import { z } from "zod";
import { linkInputPropertyInsertSchema } from "@/server/db/schema/tables/linkInputProperties";
import SuperJSON from "superjson";

export const newLinkRequestSchema = z.object({
  request: requestInsertSchema.omit({
    madeByGroupId: true,
    latLngPoint: true,
    radius: true,
  }),
  property: linkInputPropertyInsertSchema,
});

export function useSendUnsentRequest() {
  const { status } = useSession();

  const { mutateAsync: createRequest } = api.requests.create.useMutation();
  const { mutateAsync: createRequestWithLink } =
    api.requests.createRequestWithLink.useMutation();

  useEffect(() => {
    if (status !== "authenticated") return;

    const unsentRequestJSON = localStorage.getItem("unsentRequest");
    if (unsentRequestJSON) {
      localStorage.removeItem("unsentRequest");

      const unsentRequest = SuperJSON.parse<NewRequest>(unsentRequestJSON);

      void createRequest(unsentRequest)
        .then(() => successfulRequestToast(unsentRequest))
        .catch(() => {
          errorToast();
          localStorage.setItem("unsentRequest", unsentRequestJSON);
        });
    }

    ///////////////

    const unsentLinkRequestJSON = localStorage.getItem("unsentLinkRequest");
    if (unsentLinkRequestJSON) {
      localStorage.removeItem("unsentLinkRequest");

      const unsentLinkRequest = SuperJSON.parse<
        RouterInputs["requests"]["createRequestWithLink"]
      >(unsentLinkRequestJSON);

      void createRequestWithLink(unsentLinkRequest)
        .then(() => {
          successfulRequestToast(unsentLinkRequest.request);
        })
        .catch(() => {
          errorToast();
          localStorage.setItem("unsentLinkRequest", unsentLinkRequestJSON);
        });
    }
  }, [createRequest, status]);
}
