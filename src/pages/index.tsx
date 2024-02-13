import Head from "next/head";

import CurrentState from "@/components/landing-page/_sections/CurrentState";
import Hosts from "@/components/landing-page/_sections/Hosts";
import How from "@/components/landing-page/_sections/How";
import Jungle from "@/components/landing-page/_sections/Jungle";
import MastHead from "@/components/landing-page/_sections/MastHead";
import Reviews from "@/components/landing-page/_sections/Reviews";
import TramonaLoop from "@/components/landing-page/_sections/TramonaLoop";
import Gift from "@/components/landing-page/_sections/Gift";
import Save from "@/components/landing-page/_sections/Save";

export default function Home() {
  return (
    <>
      <div className="relative overflow-x-hidden">
        <Head>
          <title>Tramona</title>
        </Head>
        {/* Section 1: hero & form */}
        <MastHead />

        {/* Section 2: How it works  */}
        <How />

        {/* Section 3: Message to Host*/}
        <Hosts />

        {/* Section 4: Travel More Save More */}
        <Save />

        {/* Hack to display coin image out of bounds */}
        {/* without -> displays coin image below */}
        <div className="relative overflow-x-hidden overflow-y-hidden">
          {/* Section 5: Gift your friends */}
          <Gift />

          {/* Section 5: Current State of Travel */}
          <CurrentState />
        </div>

        {/* Section 5: Tramona Loop */}
        <TramonaLoop />

        {/* Section 6: Reviews */}
        <Reviews />

        {/* Jungle Image */}
        <Jungle />
      </div>
    </>
  );
}
