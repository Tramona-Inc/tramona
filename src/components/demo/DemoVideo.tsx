import Link from "next/link";
import { Button } from "../ui/button";

export default function DemoVideos() {
  return (
    <main className="mt-12 flex min-h-screen flex-col items-center justify-start bg-gray-50">
      {/* Header Section */}
      <section className="w-full px-4 text-center">
        <h1 className="mb-4 text-3xl font-extrabold text-[#000000] md:text-5xl">
          See the Host-Side in Action
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-sm text-gray-700 md:text-lg lg:text-xl">
          Discover how simple it is to manage bookings, connect with Airbnb, and
          fill your empty nights with ease. Watch our walkthrough to see it in
          action before you sign up.
        </p>
      </section>

      {/* Video Section */}
      <section className="flex w-full max-w-5xl flex-col items-center justify-center px-4">
        {/* Video Placeholder */}
        <div className="relative flex aspect-video h-auto w-full rounded-lg bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 shadow-xl">
          <video
            controls
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
          >
            <source src="/assets/videos/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Call-to-Action Below Video */}
        <div className="mt-8 text-center">
          <Link href="/why-list">
            <Button variant="primary" size="lg" className="rounded-lg">
              Start Hosting
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
