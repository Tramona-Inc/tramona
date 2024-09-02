import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostCalculator from "@/components/host/HostCalculator";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="mx-auto space-y-32 px-4 pb-32">
        <Head>
          <title>For Hosts | Tramona</title>
        </Head>

        <IntroSection />
        <InfoSection />
      </div>
    </DashboardLayout>
  );
}

function IntroSection() {
  return (
    <section className="mx-auto max-w-7xl justify-center">
      <div className="flex flex-col items-center space-y-8 lg:flex-row lg:space-x-10 xl:space-x-20">
        <div className="mt-10 max-w-xl space-y-5 lg:mt-0">
          <h2 className="text-center text-4xl font-bold tracking-tight text-primaryGreen md:text-6xl">
            For Hosts
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
  return (
    <div className="mx-auto max-w-4xl justify-center leading-relaxed [&_h2]:pt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_p]:pt-4 [&_p]:text-zinc-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:pt-4 [&_ul]:text-zinc-700">
      <h2>Tramona: A Host&apos;s Best Friend</h2>

      <p>
        Tramona was created to help hosts book vacancies quickly and
        efficiently. We offer a solution similar to Priceline for short-term
        rentals—providing the same properties you&apos;d find on Airbnb but
        without the extra fees and at better price points for those
        tough-to-book dates.
      </p>

      <p>
        Think about the best hotels—Hilton, Marriott, and others. They never
        offer steep discounts on Hilton.com or Marriott.com. They offload their
        empty dates to places like Priceline, Trivago, and HotelTonight. Now
        short term rental hosts have a similar option with Tramona.
      </p>

      <p>
        Tramona is free to use and acts almost like a lead generator for hosts,
        connecting you with travelers who are simply looking for good deals on
        your vacant dates. Whether it&apos;s the busy season or those slower
        months when filling vacancies is more challenging, Tramona is designed
        to help you maximize your bookings. By using Tramona year-round, you can
        ensure that your property is working for you every day of the year.
      </p>

      <p>
        We take around 50% less in fees than Airbnb, allowing both the host and
        traveler to benefit more, not the booking platforms.
      </p>

      <h2>Host Features on Tramona</h2>

      <ul>
        <li>
          <strong>Receive Requests and Make a Match:</strong> Hosts can receive
          booking requests and match them with travelers seeking a stay.
        </li>
        <li>
          <strong>List on Our Firesale Marketplace (Coming Soon):</strong> Have
          a vacancy tonight or tomorrow? List it on our special Firesale
          Marketplace, where travelers with last-minute plans come to book.
        </li>
        <li>
          <strong>Regular Listings (Coming Soon):</strong> Think of this as
          Priceline—if you anticipate a day going vacant, list it here for a
          lower price than Airbnb. Travelers can be persuaded to travel by a
          good deal.
        </li>
        <li>
          <strong>Unclaimed Offers:</strong> If you submit a match to a request
          and it goes unbooked, you can choose to let other travelers book the
          deal you offered.
        </li>
      </ul>

      <p>
        Every traveler wants to know they&apos;re getting a good deal, and
        Tramona makes sure that happens by filling your empty dates.
      </p>

      <h2 className="text-center">Tramona: Agree on a Price Every Time.</h2>
    </div>
  );
}
