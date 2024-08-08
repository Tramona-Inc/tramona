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
          <div className="flex items-center justify-center w-full h-52 bg-[#F6F6F6] px-12">
            <p className="text-center lg:text-3xl text-2xl font-semibold">
            When there’s vacancies, no one wins. We allow more travel to happen by filling everyone&apos;s calendar
            </p>
          </div>
          <SocialFeed />
          <hr className="border-none" />
          <div className="flex items-center justify-center w-full h-52 bg-[#F6F6F6] md:px-28 lg:px-32">
            <p className="text-center lg:text-3xl text-2xl font-semibold">
            Tramona is free and we take ~50% less in fees than Airbnb, Booking.com and VRBO
            </p>
          </div>

          <div className="flex flex-col items-center justify-center mx-12">
            <h2 className="md:text-3xl text-2xl mb-4">
            Safety is our number 1 priority
            </h2>
            <p className="text-lg text-muted-foreground">
            At Tramona, safety is our number 1 priority. We have countless precautions set up to make sure travelers, and hosts are safe.
            </p>
            <p className="text-lg text-muted-foreground">
            See a few below
            </p>
          </div>

          <div className="md:mx-28 mx-12">
            <h1 className="text-28 md:text-2xl font-semibold">
              Traveler Safety
            </h1>
            <hr className="border-black border-solid h-px"/>
            {/* <Separator /> */}
            <ul className="list-disc list-inside">

            <li className="pt-4 md:text-base text-[14px]">
            We require every host to also be listed on Airbnb, Vrbo, and booking.com, which means they are not only verified by us, but also them.
            </li>
            <li className="pt-2 md:text-base text-[14px]">
              Travelers can see the property on Airbnb, Booking.com, or VRBO before the book, to ensure there is adaqcuate reviews
            </li>
            <li className="pt-2 md:text-base text-[14px]">
            We have a 24/7 concierge service to answer questions or concerns any time they come up
            </li>
            <li className="pt-2 md:text-base text-[14px]">
            Money does not get transfered to the host until after check in to ensure its smooth or money back
            </li>
            </ul>
          </div>

          <div className="md:mx-28 mx-12">
            <h1 className="text-28 md:text-2xl font-semibold">
              Host Safety
            </h1>
            <hr className="border-black border-solid h-px"/>
            {/* <Separator /> */}
            <ul className="list-disc list-inside">
            <li className="pt-4 md:text-base text-[14px]">
            All travelers not only go though our behind the scenes verification process, but we also work with a 3rd party to double travelers are who they say they are
            </li>
            <li className="pt-2 md:text-base text-[14px]">
            In the off chance something goes wrong, we provide $50,000 of coverage per booking
            </li>
            <li className="pt-2 md:text-base text-[14px]">
            If hosts want a 3rd level of verification, we partner with Stripe to require travelers to go through an even more lengthy verification process
            </li>
            </ul>
          </div>

          
          <hr className="border-none" />
          <ReferAndEarn />
          <ForHosts />
          <hr className="border-none" />
          <div className="mx-4 space-y-10 text-center text-xl font-bold md:text-2xl md:mx-12">
            <h2>
              We built Tramona for 1 reason. Allow people to travel more. There
              are lots of vacancies, but people always want to travel, we are
              filling that discrepancy.
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
