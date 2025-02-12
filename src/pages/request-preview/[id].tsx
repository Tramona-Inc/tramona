import { api } from "@/utils/api";
import { useRouter } from "next/router";
import HostRequestCard from "@/components/requests/HostRequestCard";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout/index";
import Spinner from "@/components/_common/Spinner";
import { NextSeo, NextSeoProps } from "next-seo";
import { GetServerSideProps } from "next";


function Page({ serverRequestId }: { serverRequestId: string }) {
  const router = useRouter();
  const [open] = useState(true);

  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "https://3eef-2603-8000-c73d-b5bd-8d1f-a729-328a-8043.ngrok-free.app";

  const requestId = serverRequestId ? parseInt(serverRequestId) : undefined; // Directly check for query.id

  const handleUserClick = () => {
    sessionStorage.setItem("requestPreviewSource", "true");
    void router.push("/auth/signup");
  };

  const { data: request, isLoading } = api.requests.getByIdForPreview.useQuery(
    { id: requestId ?? 0 }, // Keep requestId for query, it will be undefined initially, which is fine
    { enabled: !!requestId }, // Enable query only if requestId is valid
  );

  if (requestId === undefined) { // Use requestId (which checks for query.id) for initial spinner
    return <Spinner />;
  }


  if (!isLoading && !request) {
    return <div>No request found</div>;
  }

  return (
    <>
      <NextSeo
        title="Booking Request | Tramona"
        description="Check out this request on Tramona."
        canonical={`${baseUrl}/request-preview/${requestId}`}
        openGraph={{
          url: `${baseUrl}/request-preview/${requestId}`,
          type: "website",
          title: "Booking Request | Tramona",
          description: "Check out this request on Tramona.",
          images: [
            {
              url: `${baseUrl}/api/og/route?requestId=${requestId}&type=requestPreview`,
              width: 1200,
              height: 630,
              alt: "Request Preview Image",
              type: "image/png",
            },
          ],
        }}
      />
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
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

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const serverRequestId = parseInt(context.query.id as string);

  return {
    props: {
      serverRequestId: serverRequestId.toString(),
    },
  };
};
