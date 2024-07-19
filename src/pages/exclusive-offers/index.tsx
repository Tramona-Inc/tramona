import ActivityFeed from "@/components/activity-feed/ActivityFeed";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { NextSeo } from "next-seo";

export default function ExclusiveOffersPage() {
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "https://6fb1-104-32-193-204.ngrok-free.app/"; //change to your live server

  return (
    <>
      <NextSeo
        title="Feed"
        description="Peek at who is getting great deals."
        canonical={`${baseUrl}/activity-feed`}
        openGraph={{
          url: `${baseUrl}/activity-feed`,
          type: "website",
          title: "Feed",
          description: "Peek at who is getting great deals.",
          images: [
            {
              url: `https://www.tramona.com/assets/images/landing-page/main.png`,
              width: 900,
              height: 800,
              alt: "Tramona",
              type: "image/jpeg",
            },
          ],
          site_name: "Tramona",
        }}
      />
      <DashboardLayout type="guest">
        <div className="flex min-h-screen-minus-header items-center justify-center px-4 pb-footer-height pt-5">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center">
              <h1 className="flex-1 py-4 text-2xl font-bold tracking-tight text-black lg:text-4xl">
                Recent Deals
              </h1>
            </div>
            <ActivityFeed />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
