import Image from "next/image";
import Head from "next/head";
import AccordionFaq from "@/components/_common/AccordionFaq";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TestimonialCarousel } from "@/components/landing-page/_sections/testimonials/TestimonialCarousel";
import { MobileTestimonialCarousel } from "@/components/landing-page/_sections/testimonials/MobileTestimonialCarousel";
import { whyListTestimonals } from "@/components/landing-page/_sections/testimonials/testimonials-data";
import { useIsSm } from "@/utils/utils";
import React from "react";
import HostCalculator from "@/components/host/HostCalculator";
import { StickyTopBar } from "@/pages/for-hosts";
import { MobileStickyBar } from "@/pages/for-hosts";
import HeyHosts from "@/components/landing-page/_sections/hey-hosts/HeyHosts";
import {
  FaInfoCircle,
  FaSlidersH,
  FaCheck,
  FaRegHandshake,
} from "react-icons/fa";
import {
  BsLightningCharge,
  BsCalendar4,
  BsSliders,
  BsClipboard,
  BsPerson,
} from "react-icons/bs";
import { RiRobot2Line } from "react-icons/ri";

import RequestFeed from "@/components/activity-feed/RequestFeed";
import { type FeedRequestItem } from "@/components/activity-feed/ActivityFeed";
import { getFeed } from "@/server/api/routers/feedRouter";
import { type InferGetStaticPropsType } from "next";

const ForHostsPage = ({
  requestFeed,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="relative  overflow-x-hidden bg-white md:pb-0">
      <Head>
        <title>For Hosts | Tramona</title>
      </Head>
      <div>
        <div className="bg-white pb-10">
          <Banner />
          <div className="md:hidden">
            <MobileStickyBar />
          </div>
          <div className="hidden md:block">
            <StickyTopBar />
          </div>
          <SignUpNow requestFeed={requestFeed} />
        </div>
        <div className="bg-[#FAF9F6] p-10">
          <h1 className="mt-12 text-center text-3xl font-semibold">
            How Tramona Works for Hosts
          </h1>
          <p className="mb-12 mt-1 text-center text-lg font-normal text-gray-500">
            Say goodbye to empty nights
          </p>
          <HowItWorks />
        </div>
        <div>
          <h1 className="mt-12 text-center text-3xl font-semibold">
            Automation vs Manual
          </h1>
          <p className="mb-12 mt-1 text-center text-lg font-normal text-gray-500">
            Tramoma can be as hands on or hands off as you want.
          </p>
          <AutoManual />
          <p className="text-med mb-12 mt-8 text-center font-normal text-gray-500">
            Tramona makes switching between automation and manual controls
            effortless, so you can adapt your approach as your hosting needs
            change.
          </p>
        </div>
        <div className="bg-[#FAF9F6]">
          <Features2 />
        </div>
        <div className="mt-12 bg-white">
          <KeyFeatures />
        </div>
        <hr className="mx-8 border-t border-gray-300" />
        <Features />
        <HostCalculator />
        <div className="mx-0 flex max-w-full justify-center space-y-4 px-4 lg:mx-4 lg:mb-16 lg:mt-16 lg:flex lg:space-y-8">
          {useIsSm() ? (
            <MobileTestimonialCarousel testimonials={whyListTestimonals} />
          ) : (
            <TestimonialCarousel testimonials={whyListTestimonals} />
          )}
        </div>
        <div className="bg-[#FAF9F6] p-8">
          <ListInAMinute />
        </div>
        <div>
          <h2 className="mx-4 mb-16 mt-12 text-center text-3xl font-semibold">
            Anything we can answer? Book a call with <br />
            our onboarding team
          </h2>
          <Questions />
        </div>
        <div className="pb-4 md:pb-20 flex justify-center">
          <HeyHosts />
        </div>
        <div className="bg-[#FAF9F6] p-20 pb-4 md:pb-8">
          <FAQ />
        </div>
      </div>
      <div className="mt-0 bg-primaryGreen py-8">
        <div className="text-center text-white">
          <h2 className="text-2xl font-semibold">
            Turn hard-to-book dates into profitable stays
          </h2>
          <div className="mt-6 flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-x-6 md:space-y-0">
            <Link href="/why-list">
              <Button
                size="lg"
                className="bg-primaryGreen bg-white text-primaryGreen"
              >
                Become a host
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <section className="mx-auto max-w-7xl pb-8 md:pb-1">
      <div className="flex flex-col space-y-6 p-2 md:grid md:grid-cols-3 md:gap-6">
        <span className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl font-semibold md:text-4xl">
            Frequently asked questions
          </h1>
        </span>
        <div className="col-span-2 border-t">
          <AccordionFaq accordionItems={whyListAccordionItems} />
          <span className="mt-8 flex justify-center md:justify-start">
            <Link href="/faq">
              <Button size="lg" className="bg-primaryGreen text-white">
                View FAQ
              </Button>
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
};

const whyListAccordionItems = [
  {
    question: "Does Tramona help with Taxes?",
    answer:
      "Yes, Tramona handles all the same taxes other sites like Airbnb and VRBO do.",
  },
  {
    question: "How and when do I get paid?",
    answer:
      "Tramona collets the full amount from the traveler at the time of the booking, and pays the host 24 hours after check in. All payment are securely handled via Stripe.",
  },
  {
    question: "How much protection does Tramona offer?",
    answer:
      "Tramona offers $50,000 of protection per booking. You also have the opportunity to add a security deposit.",
  },
];

const Banner = () => {
  const image = "/assets/images/why-list/beach2.png";
  return (
    <section className="relative -mb-1">
      <div className="relative h-[40vh] w-full">
        <Image
          src={image}
          alt="beach banner"
          fill
          priority
          quality={100}
          placeholder="blur"
          blurDataURL={image}
          className="object-cover object-center"
        />
      </div>
      <span className="absolute inset-0 bg-black opacity-50"></span>
      <div className="absolute inset-0 flex items-center px-6">
        <div className="relative z-10 ml-1 max-w-4xl text-left text-white xl:mx-4">
          <h2 className="text-sm font-medium uppercase tracking-wide md:text-lg">
            FOR HOSTS
          </h2>
          <h3 className="mt-2 text-xl font-bold leading-snug md:text-3xl lg:text-4xl">
            The booking platform designed to help you fill every night with
            paying guests
          </h3>
          <p className="mt-4 text-sm md:text-base lg:text-lg">
            Earn 10-15% more annually by filling empty nights and paying less
            fees
          </p>
        </div>
      </div>
    </section>
  );
};

export async function getStaticProps() {
  const requestFeed = await getFeed({ maxNumEntries: 10 }).then((r) =>
    r.filter((r) => r.type === "request"),
  );
  return {
    props: { requestFeed },
    revalidate: 60 * 5, // 5 minutes
  };
}

const SignUpNow = ({ requestFeed }: { requestFeed: FeedRequestItem[] }) => {
  return (
    <section className="flex justify-center">
      <div className="mx-12 flex flex-col justify-center gap-8 md:mx-36 lg:mx-24 lg:max-w-[70vw] lg:flex-row">
        <div className="flex-1">
          <h1 className="mb-20 mt-10 text-center text-lg font-medium md:text-2xl">
            Tramona charges 5-10% less in fees than other platforms, while
            offering $50,000 in protection per booking. Allowing hosts and
            travelers to earn more on the same booking elsewhere.
          </h1>
          <div className="h-[450px] rounded-lg border px-2 py-2 shadow-xl">
            <RequestFeed requestFeed={requestFeed} />
          </div>
          <h2 className="mb-12 mt-12 text-center text-2xl font-medium">
            Everyday we have requests that go un-booked.
          </h2>
          <div className="mb-2 flex justify-center">
            <Link href="/host-onboarding">
              <Button size="lg" className="bg-primaryGreen text-white">
                Sign up and start earning more
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <ul className="mx-auto mb-12 flex flex-col items-stretch gap-8 md:flex-row md:justify-center">
      {/* Book it Now */}
      <li className="flex flex-col rounded-xl bg-white p-6 text-left shadow-lg md:w-96">
        <h3 className="mb-4 text-center text-xl font-bold text-[primaryGreen]">
          {" "}
          {/* Reduced mb-6 to mb-4 */}
          1. Book it Now
        </h3>
        <p className="mb-4 text-center font-medium md:text-left">
          {" "}
          {/* Added mb-4 for consistent spacing */}
          Just like on Airbnb or Vrbo, your property is showcased beautifully.
          Travelers can instantly book their stay.
        </p>
        <div className="mt-6 flex items-center">
          {" "}
          {/* Added mt-6 for consistent top spacing */}
          <FaInfoCircle />
          <h4 className="ml-2 font-bold">How it Works:</h4>{" "}
          {/* Removed m-3 and simplified ml-2 */}
        </div>
        <p className="mt-2 text-gray-500">
          {" "}
          {/* Added mt-2 for spacing from h4 */}
          When you sign up as a host, your Tramona account instantly syncs with
          Airbnb. Getting your availability, pricing, and other booking details.
        </p>
        <hr className="my-4 border-t border-gray-300" />
        <div className="mt-4 flex items-center">
          {" "}
          {/* Added mt-4 for consistent top spacing */}
          <FaSlidersH />
          <h4 className="ml-2 font-bold">Your Flexibility:</h4>{" "}
          {/* Removed m-2 and simplified ml-2 */}
        </div>
        <ul className="ml-1 mt-2">
          {" "}
          {/* Added mt-2 for spacing from h4 */}
          <li className="mb-1 flex items-center text-gray-500">
            {" "}
            {/* Added mb-1 for spacing between list items */}
            <FaCheck className="mr-2" size={12} /> Choose between book it now or
            request to book.
          </li>
          <li className="flex items-center text-gray-500">
            <FaCheck className="mr-2" size={18} /> Your property starts on
            request to book.
          </li>
        </ul>
      </li>

      {/* Receiving Bids */}
      <li className="flex flex-col rounded-xl bg-white p-6 text-left shadow-lg md:w-96">
        <h3 className="mb-4 text-center text-xl font-bold text-[primaryGreen]">
          {" "}
          {/* Reduced mb-6 to mb-4 */}
          2. Receiving Bids
        </h3>
        <p className="mb-4 text-center font-medium md:text-left">
          {" "}
          {/* Added mb-4 for consistent spacing */}
          Travelers can send offers for your vacant nights.
        </p>

        <div className="mt-6 flex items-center">
          {" "}
          {/* Changed mt-4 to mt-6 for consistency */}
          <FaInfoCircle />
          <h4 className="ml-2 font-bold">How it Works:</h4>{" "}
          {/* Removed m-3 and simplified ml-2 */}
        </div>
        <p className="mt-2 text-gray-500">
          {" "}
          {/* Added mt-2 for spacing from h4 */}
          Travelers can book instantly or place a bid. You can accept, reject,
          or set automatic rules to approve bids that meet your criteria. Only
          see the offers that match your preferences.
        </p>

        <hr className="my-4 border-t border-gray-300" />

        <div className="mt-4 flex items-center">
          {" "}
          {/* Added mt-4 for consistent top spacing */}
          <FaSlidersH />
          <h4 className="ml-2 font-bold">Your Flexibility:</h4>{" "}
          {/* Removed m-2 and simplified ml-2 */}
        </div>

        <ul className="ml-1 mt-2">
          {" "}
          {/* Added mt-2 for spacing from h4 */}
          <li className="mb-1 flex items-center text-gray-500">
            {" "}
            {/* Added mb-1 for spacing between list items */}
            <FaCheck className="mr-2" size={12} /> Choose to automatically
            accept bids that meet your hidden price preferences
          </li>
          <li className="mb-1 flex items-center text-gray-500">
            {" "}
            {/* Added mb-1 for spacing between list items */}
            <FaCheck className="mr-2" size={12} /> Set preferences for offers
            you would consider, ignore the rest
          </li>
          <li className="flex items-center text-gray-500">
            <FaCheck className="mr-2" size={12} /> If Book It Now is off,
            travelers can only submit bids
          </li>
        </ul>
      </li>

      {/* Receiving Requests */}
      <li className="flex flex-col rounded-xl bg-white p-6 text-left shadow-lg md:w-96">
        <h3 className="mb-4 text-center text-xl font-bold text-[primaryGreen]">
          {" "}
          {/* Reduced mb-6 to mb-4 */}
          3. Receiving Requests
        </h3>
        <p className="mb-4 text-center font-semibold md:text-left">
          {" "}
          {/* Added mb-4 for consistent spacing */}
          Never let a night sit empty, always have options.
        </p>
        <div className="mt-6 flex items-center">
          {" "}
          {/* Added mt-6 for consistent top spacing */}
          <FaInfoCircle />
          <h4 className="ml-2 font-bold">How it Works:</h4>{" "}
          {/* Removed m-3 and simplified ml-2 */}
        </div>
        <p className="mt-2 text-gray-500">
          {" "}
          {/* Added mt-2 for spacing from h4 */}
          Travelers specify their budget, dates, and preferences, and send a
          request. That request is sent to all hosts on Tramona with an empty
          night. Hosts have the option to accept, deny, or counteroffer all
          requests.
        </p>
        <hr className="my-4 border-t border-gray-300" />
        <div className="mt-4 flex items-center">
          {" "}
          {/* Added mt-4 for consistent top spacing */}
          <FaSlidersH />
          <h4 className="ml-2 font-bold">Your Flexibility:</h4>{" "}
          {/* Removed m-2 and simplified ml-2 */}
        </div>
        <ul className="ml-1 mt-2">
          {" "}
          {/* Added mt-2 for spacing from h4 */}
          <li className="mb-1 flex items-center text-gray-500">
            {" "}
            {/* Added mb-1 for spacing between list items */}
            <FaCheck className="mr-2" size={16} /> Choose to maually respond or
            automatically respond to each match.
          </li>
          <li className="flex items-center text-gray-500">
            <FaCheck className="mr-2" size={18} /> Flexibility to accept,
            decline or counteroffer all requests.
          </li>
        </ul>
      </li>
    </ul>
  );
};

const AutoManual = () => {
  return (
    <div className="mx-6 grid gap-8 sm:grid-cols-1 md:grid-cols-2">
      {/* Automation Section */}
      <div className="flex flex-col rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <RiRobot2Line className="mr-2 text-2xl text-primaryGreen" />
          <h3 className="text-xl font-bold">Automation</h3>
        </div>
        <p className="mb-4 text-center text-gray-500">
          Automate everything. Save time with your rental.
        </p>
        <div className="space-y-4">
          <div className="flex items-start">
            <BsLightningCharge className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Instant Matching:</strong> Automatically respond to
              matches based on your preferences.
            </p>
          </div>
          <div className="flex items-start">
            <BsCalendar4 className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Book It Now:</strong> Enable travelers to book instantly
              without needing approval.
            </p>
          </div>
          <div className="flex items-start">
            <BsSliders className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Custom Rules:</strong> Set a hidden discount for dates not
              booked a certain number of days out.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Ideal for saving time and maximizing occupancy.
        </p>
      </div>

      {/* Manual Section */}
      <div className="flex flex-col rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <FaRegHandshake className="mr-2 text-2xl text-primaryGreen" />
          <h3 className="text-xl font-bold">Manual</h3>
        </div>
        <p className="mb-4 text-center text-gray-500">
          Manually decide which bookings you allow.
        </p>
        <div className="space-y-4">
          <div className="flex items-start">
            <BsClipboard className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Set request to book:</strong> Approve each booking
              manually.
            </p>
          </div>
          <div className="flex items-start">
            <BsPerson className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Respond to requests:</strong> Accept, deny, or submit
              counteroffers.
            </p>
          </div>
          <div className="flex items-start">
            <BsCalendar4 className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Inspect traveler details:</strong> Verify profiles before
              confirming bookings.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Perfect for hosts who prefer a hands-on approach to guest selection.
        </p>
      </div>
    </div>
  );
};

const Questions = () => {
  return (
    <ul className="mx-12 mb-12 flex flex-wrap justify-center gap-24">
      <div className="flex flex-col items-center">
        <Link
          href="https://calendly.com/tramona"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="lg" className="bg-primaryGreen text-white">
            Book a Call
          </Button>
        </Link>
      </div>
    </ul>
  );
};

const KeyFeatures = () => {
  return (
    <section className="mx-12 mb-8 flex flex-row flex-wrap justify-center gap-8">
      <Image
        src="/assets/images/why-list/key-features.png"
        className="my-16 h-auto w-full rounded-3xl object-cover md:my-0 md:h-[600px] md:w-[440px]"
        alt="mountain trail"
        width={512}
        height={699}
      />
      <div className="flex max-w-xl flex-grow flex-col justify-start">
        <h2 className="mb-4 text-4xl font-semibold">Key Features for Hosts</h2>
        {/* Feature List */}
        <ul className="mt-6 flex flex-col gap-4">
          <KeyFeatureItem
            title="Easy Sync with Airbnb"
            description="Import all your properties and preferences in <b>less than 1 minute</b>
      by syncing with Airbnb. This also syncs your calendar to ensure no double bookings."
          />
          <KeyFeatureItem
            title="Verified Travelers"
            description="All travelers are verified and undergo <b>3 levels of verification</b>."
          />
          <KeyFeatureItem
            title="Taxes Handled"
            description="We handle all taxes Airbnb and Vrbo handle."
          />
          <KeyFeatureItem
            title="Property Protection"
            description="We protect up to <b>50k of protection per booking</b> and also allow for
      security deposits."
          />
          <KeyFeatureItem
            title="Lowest Fees on the Market"
            description="Tramona charges the <b>lowest fees</b> on the market and is completely free to sign up. We only charge 2.5% for hosts, and 5.5% for travelers."
          />
          <KeyFeatureItem
            title="Co-hosting"
            description="Invite a co-host, choose which permissions to give them, and have them help run your listing."
          />
        </ul>
      </div>
    </section>
  );
};

const KeyFeatureItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <li className="flex flex-col">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p
        className="text-base font-normal"
        dangerouslySetInnerHTML={{ __html: description }}
      ></p>
    </li>
  );
};

type Tabs = {
  id: number;
  title: string;
  info: string;
  image: string;
};

const contents: Tabs[] = [
  {
    id: 0,
    title: "Directly with Airbnb",
    info: "Instantly sign up with Airbnb Via our partner hospitable. This will redirect you to Airbnb and allow an effortless onboarding.",
    image: "/assets/images/host-welcome/1.jpeg",
  },

  {
    id: 1,
    title: "We sign you up",
    info: "Have any questions? Schedule a call and we will help onboard you and answer all questions in the meantime.",
    image: "/assets/images/host-welcome/3.png",
  },
];

type Tabs2 = {
  id: number;
  title: string;
  image: string;
};

const content2: Tabs2[] = [
  {
    id: 0,
    title: "24/7 Support",
    image: "/assets/images/why-list/support.png",
  },

  {
    id: 1,
    title: "Secure payments",
    image: "/assets/images/why-list/secure-payments.png",
  },

  {
    id: 2,
    title: "Optional Security Deposit",
    image: "/assets/images/why-list/security.png",
  },
];

const Features = () => {
  return (
    <section className="py-12">
      <ul className="flex flex-wrap justify-center gap-8">
        {content2.map((content2) => (
          <li
            key={content2.id}
            className="w-72 overflow-hidden rounded-lg bg-white shadow-lg"
          >
            <span className="relative block h-48">
              <Image
                src={content2.image}
                objectFit="cover"
                layout="fill"
                alt={content2.title}
              />
            </span>
            <span className="p-4 text-center">
              <h2 className="text-lg font-semibold">{content2.title}</h2>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center text-lg font-bold">
        <Link href="">
          <Button size="lg" className="bg-primaryGreen text-white">
            Demo
          </Button>
        </Link>
      </div>
    </section>
  );
};

const Features2 = () => {
  return (
    <section className="mb-12 mt-12 py-12">
      <div className="flex flex-col items-center space-y-12">
        {/* First Row: Image on left, text on right */}
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-x-16 gap-y-4 px-6 text-center sm:flex-row sm:text-left">
          <div className="relative h-40 w-72 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 shadow-md">
            <Image
              src="/assets/images/why-list/Why-list-request.png"
              objectFit="contain"
              layout="fill"
              alt="Requests"
            />
          </div>
          <h2 className="text-md font-medium text-[#333]">
            See all incoming requests for your empty nights, accept deny or
            reject them. Hosts can also set preferences so they only see
            requests that match their criteria.
          </h2>
        </div>

        {/* Second Row: Text on left, image on right */}
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-x-16 gap-y-4 px-6 text-center sm:flex-row-reverse sm:text-left">
          <div className="relative h-40 w-72 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 shadow-md">
            <Image
              src="/assets/images/why-list/Why-list-cohost.png"
              objectFit="contain"
              layout="fill"
              alt="Cal"
            />
          </div>
          <h2 className="text-md font-medium text-[#333]">
            Easily invite a co-host to help manage your listing. We have
            multiple permissions to choose from. From full access to only being
            able to preform certain actions.
          </h2>
        </div>

        {/* Third Row: Image on left, text on right */}
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-x-16 gap-y-4 px-6 text-center sm:flex-row sm:text-left">
          <div className="relative h-40 w-72 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 shadow-md">
            <Image
              src="/assets/images/why-list/Why-list-cal.png"
              objectFit="contain"
              layout="fill"
              alt="Customized Pricing"
            />
          </div>
          <h2 className="text-md font-medium text-[#333]">
            Customize Tramona how you like. Put the prices you would consider,
            turn on or off instant booking, and sync your calendar directlly
            with Airbnb to eliminate double bookings.
          </h2>
        </div>
      </div>
    </section>
  );
};

const ListInAMinute = () => {
  return (
    <section className="flex flex-col items-center gap-6 bg-[#f8f8f8] p-8">
      <h1 className="mb-8 text-center text-2xl font-semibold">
        List your property in under a minute with our simple sign-up process
      </h1>
      <ul className="flex list-none flex-wrap justify-center gap-8 p-0">
        {contents.map((content) => (
          <li
            key={content.id}
            className="flex w-[300px] flex-col items-center rounded-lg bg-white p-4 text-center shadow-md"
          >
            <span className="relative mb-4 block h-[200px] w-full overflow-hidden rounded-lg">
              <Image
                src={content.image}
                objectFit="cover"
                layout="fill"
                alt={content.title}
              />
            </span>
            <span>
              <h2 className="mb-2 text-lg font-bold">{content.title}</h2>
              <p className="text-sm text-[#666]">{content.info}</p>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ForHostsPage;
