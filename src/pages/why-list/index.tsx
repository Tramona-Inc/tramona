import MainLayout from "@/components/_common/Layout/MainLayout";
import HostCalculator from "@/components/host/HostCalculator";
import Head from "next/head";

export default function Page() {
  function IntroSection() {
    return (
      <section className="mx-auto max-w-7xl justify-center">
        <div className="flex flex-col items-center space-y-8 lg:flex-row lg:space-x-10 xl:space-x-20">
          <div className="mt-10 max-w-xl space-y-5 lg:mt-0">
            <h2 className="text-center text-4xl font-bold tracking-tight text-primaryGreen md:text-6xl">
              For hosts?
            </h2>
            <p className="text-center text-4xl font-semibold tracking-tight md:text-6xl">
              Tramona: A host&apos;s best friend
            </p>
          </div>
          <HostCalculator />
        </div>
      </section>
    );
  }

  function InfoSection() {
    const sectionOne = [
      {
        text: "To help hosts book vacancies quickly and efficiently, Tramona offers a solution similar to Priceline for short-term rentals—providing the same properties you’d find on Airbnb but without the extra fees.",
      },
      {
        text: "Think about the best hotels—Hilton, Marriott, and others. They are high quality and would never offer steep discounts on Hilton.com or Marriott.com. You shouldn’t either. That’s why they have companies like Priceline, Trivago, and HotelTonight. Well now, you have Tramona.",
      },
      {
        text: "Tramona is free to use and acts almost like a lead generator for hosts, connecting you with travelers who are simply looking for good deals on your vacant dates. Join the hundreds of thousands of properties already on Tramona and see how much you can save. We take around 75% less in fees than Airbnb, allowing both the host and traveler to benefit more, not the big booking platforms. Check out our pricing calculator to see how Tramona can benefit you. Plus, you get to agree on a price every time, ensuring you always get the best deal.",
      },
    ];

    const sectionTwo = [
      {
        text: "Receive Requests and Make a Match: Hosts can receive booking requests and match them with travelers seeking a stay.",
      },
      {
        text: "List on Our Firesale Marketplace: Have a vacancy tonight or tomorrow? List it on our special Firesale Marketplace, where travelers with last-minute plans come to book.",
      },
      {
        text: "Regular Listings: Think of this as Priceline—if you anticipate a day going vacant, list it here for a lower price than Airbnb. Travelers often need to be persuaded by a good deal.",
      },
      {
        text: "Unclaimed Offers: If you submit a match to a request and it goes unbooked, you can choose to let other travelers book the deal you offered.",
      },
    ];

    const sectionThree = [
      {
        text: "Quality of Leads and Booking Requests: We offer 3 levels of traveler verification so you can be sure who you accept is who you get. You can also approve all travelers who want to book if you choose, and Tramona provides up to $50K protection per booking.",
      },
      {
        text: "Traveler Budget Consciousness: Approximately 72% of travelers are budget-conscious and actively seek deals and discounts. Just because travelers are looking for a deal doesn’t mean they are worse travelers. Many are simply looking to maximize their travel experience within their budget, and they value quality stays just as much as those who pay full price.",
      },
      {
        text: "Supplemental Use: While Airbnb should still be your main platform for bookings, Tramona serves as a valuable supplement. Just as Marriott and Hilton use Priceline to offer discounts without altering their luxury status on their main sites, Tramona helps you fill vacancies and reach travelers looking for deals.",
      },
    ];

    return (
      <div className="relative mx-auto max-w-7xl space-y-6 px-2">
        <div className="space-y-6">
          {sectionOne.map((section, index) => (
            <p key={index}>{section.text}</p>
          ))}
        </div>
        <div>
          <h1 className="text-xl font-bold">Host Features on Tramona</h1>
          <ul className="list-outside list-disc pl-4">
            {sectionTwo.map((section, index) => (
              <li key={index}>{section.text}</li>
            ))}
          </ul>
        </div>
        <div>
          <p>
            Every traveler wants to know they’re getting a good deal, and
            Tramona makes sure that happens by filling your empty days.
          </p>
          <p>Tramona: Agree on a Price Every Time.</p>
        </div>
        <div>
          <h2>Note for Hosts:</h2>
          <ul className="list-outside list-disc pl-4">
            {sectionThree.map((section, index) => (
              <li key={index}>{section.text}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto space-y-32 px-4 pb-32">
        <Head>
          <title>For hosts | Tramona</title>
        </Head>

        <IntroSection />
        <InfoSection />
      </div>
    </MainLayout>
  );
}
