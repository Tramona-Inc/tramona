import Head from "next/head";

import MastHead from "@/components/landing-page/_sections/MastHead";
import HowItWorks from "@/components/landing-page/_sections/HowItWorks";
import SocialFeed from "@/components/landing-page/_sections/SocialFeed";
import ForHosts from "@/components/landing-page/_sections/ForHosts";
import ReferAndEarn from "@/components/landing-page/_sections/ReferAndEarn";
import HelpEndThis from "@/components/landing-page/_sections/HelpEndThis";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";

export default function LandingPage() {
  useMaybeSendUnsentRequests();

  return (
    <>
      <div className="relative overflow-x-hidden">
        <Head>
          <title>Tramona</title>
        </Head>
        {/* Section 1: hero & form */}
        <MastHead />

        {/* Section 2: How it works  */}
        {/* <How /> */}
        <HowItWorks />

        {/* Section 3: Message to Host*/}
        {/* <Hosts /> */}
        <SocialFeed />

        {/* Section 4: Travel More Save More */}
        {/* <Save /> */}
        <ForHosts />
        <ReferAndEarn />
        <HelpEndThis />

        {/* Hack to display coin image out of bounds */}
        {/* without -> displays coin image below */}
        <div className="relative overflow-x-hidden overflow-y-hidden">
          {/* Section 5: Gift your friends */}
          {/* <Gift /> */}

          {/* Section 5: Current State of Travel */}
          {/* <CurrentState /> */}
        </div>

        {/* Section 5: Tramona Loop */}
        {/* <TramonaLoop /> */}

        {/* Section 6: Reviews */}
        {/* <Reviews /> */}

        {/* Jungle Image */}
        {/* <Jungle /> */}
      </div>
    </>
  );
}
