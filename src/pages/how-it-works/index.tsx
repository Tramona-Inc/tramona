import Head from "next/head";
import MainLayout from "@/components/_common/Layout/MainLayout";
import ForHosts from "@/components/landing-page/_sections/ForHosts";
import HowItWorks from "@/components/landing-page/_sections/HowItWorks";
import ReferAndEarn from "@/components/landing-page/_sections/ReferAndEarn";
import SocialFeed from "@/components/landing-page/_sections/SocialFeed";
import FAQ from "@/components/landing-page/_sections/FAQ";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <MainLayout>
      <div className="relative overflow-x-hidden bg-white">
        <Head>
          <title>How It Works | Tramona</title>
        </Head>
        <div className="mb-12 space-y-12 md:mb-20 md:space-y-20">
          <HowItWorks />
          <div className="flex h-52 w-full items-center justify-center bg-[#F6F6F6] px-12">
            <p className="text-center text-2xl font-semibold lg:text-3xl">
              When there&apos;s vacancies, no one wins. We allow more travel to
              happen by filling everyone&apos;s calendar
            </p>
          </div>
          <SocialFeed />
          <hr className="border-none" />
          <div className="flex h-52 w-full items-center justify-center bg-[#F6F6F6] md:px-28 lg:px-32">
            <p className="text-center text-2xl font-semibold lg:text-3xl">
              Tramona is free and we take ~50% less in fees than Airbnb,
              Booking.com and VRBO
            </p>
          </div>

          <div className="mx-12 flex flex-col items-center justify-center">
            <h2 className="mb-4 text-2xl md:text-3xl">
              Safety is our number 1 priority
            </h2>
            <p className="text-lg text-muted-foreground">
              At Tramona, safety is our number 1 priority. We have countless
              precautions set up to make sure travelers, and hosts are safe.
            </p>
            <p className="text-lg text-muted-foreground">See a few below</p>
          </div>

          <div className="mx-12 md:mx-28">
            <h1 className="text-28 font-semibold md:text-2xl">
              Traveler Safety
            </h1>
            <hr className="h-px border-solid border-black" />
            {/* <Separator /> */}
            <ul className="list-inside list-disc">
              <li className="pt-4 text-[14px] md:text-base">
                We require every host to also be listed on Airbnb, Vrbo, and
                booking.com, which means they are not only verified by us, but
                also them.
              </li>
              <li className="pt-2 text-[14px] md:text-base">
                Travelers can see the property on Airbnb, Booking.com, or VRBO
                before they book, to ensure there are adequate reviews.
              </li>
              <li className="pt-2 text-[14px] md:text-base">
                We have a 24/7 concierge service to answer questions or concerns
                any time they come up.
              </li>
              <li className="pt-2 text-[14px] md:text-base">
                Funds are not transferred to the host until after check-in,
                ensuring a smooth and secure check-in process.
              </li>
            </ul>
          </div>

          <div className="mx-12 md:mx-28">
            <h1 className="text-28 font-semibold md:text-2xl">Host Safety</h1>
            <hr className="h-px border-solid border-black" />
            {/* <Separator /> */}
            <ul className="list-inside list-disc">
              <li className="pt-4 text-[14px] md:text-base">
                All travelers undergo our comprehensive verification process.
                Additionally, we collaborate with a third-party service to
                further ensure travelers are who they claim to be.
              </li>
              <li className="pt-2 text-[14px] md:text-base">
                In the event that something goes wrong, we offer up to $50,000
                of coverage per booking.
              </li>
              <li className="pt-2 text-[14px] md:text-base">
                For hosts seeking an additional layer of verification, we
                partner with Stripe to offer travelers an even more thorough
                verification process.
              </li>
            </ul>
          </div>

          <hr className="border-none" />
          <ReferAndEarn />
          <ForHosts />
          <hr className="border-none" />
          <div className="mx-4 space-y-10 text-center text-xl font-bold md:mx-12 md:text-2xl">
            <h2>
              We built Tramona for one reason. Allow people to travel more.
              There are lots of vacancies, but people always want to travel, we
              are filling that discrepancy.
            </h2>
            <h2>Stay in properties out of your budget, for your budget.</h2>
          </div>
          <FAQ />
          <hr className="border-none" />
        </div>
      </div>
    </MainLayout>
  );
}
