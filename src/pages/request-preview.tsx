import { api } from "@/utils/api";
import { useRouter } from "next/router";
import HostRequestCard from "@/components/requests/HostRequestCard";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout/index";
import Spinner from "@/components/_common/Spinner";

export default function Page() {
  const router = useRouter();
  const [requestId, setRequestId] = useState<number | null>(null);
  const [open] = useState(true);

  useEffect(() => {
    if (router.isReady && router.query.requestId) {
      const id = Array.isArray(router.query.requestId)
        ? router.query.requestId[0]
        : router.query.requestId;
      setRequestId(Number(id));
    }
  }, [router.isReady, router.query]);

  const handleUserClick = () => {
    sessionStorage.setItem("requestPreviewSource", "true");
    void router.push("/auth/signup");
  };

  const { data: request, isLoading } = api.requests.getById.useQuery(
    { id: requestId ?? 0 }, // Ensure query only runs when ID is available
    { enabled: !!requestId },
  );

  if (!request) {
    return <div>No request found</div>;
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen"><Spinner /></div>
      ) : (
        <HostDashboardLayout>
          <Dialog
            open={open}
            onOpenChange={(open) => {
              if (!open) {
                handleUserClick();
              }
            }}
          >
            <DialogContent className="[&>button]:hidden">
              <HostRequestCard request={request} />
            </DialogContent>
          </Dialog>
        </HostDashboardLayout>
      )}
    </>
  );
}
