import CurrentState from "@/components/LandingPage/CurrentState";
import Hosts from "@/components/LandingPage/Hosts";
import How from "@/components/LandingPage/How";
import Jungle from "@/components/LandingPage/Jungle";
import MastHead from "@/components/LandingPage/MastHead";
import Reviews from "@/components/LandingPage/Reviews";
import TramonaLoop from "@/components/LandingPage/TramonaLoop";
import Gift from "@/components/LandingPage/Gift";
import Save from "@/components/LandingPage/Save";
import Head from "next/head";
// import MainLayout from '@/common/components/layouts/main';

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
