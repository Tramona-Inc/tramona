import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Image from "next/image";
import Head from "next/head";
import AccordionFaq from "@/components/_common/AccordionFaq";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TestimonialCarousel } from "@/components/landing-page/_sections/testimonials/TestimonialCarousel";
import { MobileTestimonialCarousel } from "@/components/landing-page/_sections/testimonials/MobileTestimonialCarousel";
import { useIsSm } from "@/utils/utils";
import React from "react";
import HostCalculator from "@/components/host/HostCalculator";
import {
  CircleCheckIcon,
  ClockIcon,
  DollarSignIcon,
  LockIcon,
  MapPinIcon,
  PencilIcon,
  PhoneCallIcon,
  ShieldIcon,
  ToggleLeftIcon,
  UserCheckIcon,
} from "lucide-react";

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

const ForHostsPage = () => {
  return (
    <DashboardLayout>
      <Head>
        <title>For Hosts | Tramona</title>
      </Head>
      <div className="relative mb-12 space-y-20 md:mb-20 md:space-y-32">
        <Banner />
        <OptimizeEarnings />
        <h3 className="mx-4 mb-48 mt-20 text-center text-2xl font-bold text-primaryGreen">
          Hosts can expect to make 10-15% more when using Tramona to book their
          empty nights
        </h3>
        <h2 className="text-center text-4xl font-semibold">
          How Tramona Works
        </h2>
        <HowItWorks />
        <div className="mx-auto max-w-5xl items-center justify-center rounded-2xl bg-[#DEEEFB] p-8">
          <h2 className="text-center text-xl font-bold">
            Hosts have the option to fully automate or make it a manual process,
            you are in control.
          </h2>
        </div>
        <div className="flex justify-center md:mx-16">
          <StepByStepList />
        </div>
        <h2 className="font-mulish mx-4 text-center text-4xl font-bold md:text-5xl">
          When nights are empty, no one wins
        </h2>
        <div className="mx-0 flex max-w-full justify-center space-y-4 px-4 lg:mx-4 lg:mt-16 lg:flex lg:space-y-8">
          {useIsSm() ? <MobileTestimonialCarousel /> : <TestimonialCarousel />}
        </div>

        <h2 className="mb-16 text-center text-4xl font-medium">Questions?</h2>
        <Questions />
        <KeyFeatures />
        <SecurityPrivacy />
        <div className="flex justify-center">
          <HostCalculator />
        </div>
        <ListInAMinute />
        <FAQ />
      </div>
    </DashboardLayout>
  );
};

const FAQ = () => {
  return (
    <section className="mx-auto max-w-7xl pb-footer-height">
      <div className="flex flex-col space-y-6 p-4 md:grid md:grid-cols-3 md:gap-6">
        <span className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl font-bold md:text-4xl">
            Frequently asked questions
          </h1>
        </span>
        <div className="col-span-2 border-t">
          <AccordionFaq accordionItems={whyListAccordionItems} />
          <span className="mt-4 flex justify-center md:justify-start">
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

const Banner = () => {
  return (
    <section className="relative">
      <div className="relative h-[50vh] w-full lg:h-screen-minus-header">
        <Image
          src="/assets/images/why-list/host-banner.png"
          alt="beach banner"
          fill // Fill the parent container
          className="max-h-[600px] object-cover md:max-h-full" // Maintain aspect ratio while covering the entire area
          priority // Optional: Use for images that are important for the initial load
        />
      </div>
      <span className="absolute inset-0 bg-black opacity-50"></span>
      {/* Dark overlay */}
      <div className="absolute inset-0 flex items-center justify-start pr-8 md:justify-end">
        {/* Container for the text */}
        <div className="relative z-10 ml-12 mr-24 flex max-w-xl flex-col items-start text-left">
          {/* Ensure text is above the overlay */}
          <h2 className="lg:my-4lgd:text-2xl my-2 text-lg font-bold text-white">
            FOR HOSTS
          </h2>
          <h3 className="my-2 text-2xl font-bold text-white md:text-3xl lg:text-5xl">
            Let&aposs make sure your calendar is filled
          </h3>
          <p className="my-2 break-words text-xl text-white md:text-2xl lg:text-4xl">
            Built to fill empty and hard to book dates
          </p>
          <Link href="/host-onboarding">
            <Button
              size="lg"
              className="md:text-mt-6 mt-2 bg-primaryGreen text-white lg:mt-8"
            >
              Become a host
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const OptimizeEarnings = () => {
  return (
    <section className="flex justify-center">
      <div className="mx-12 flex w-full flex-col justify-center gap-8 md:mx-36 lg:mx-24 lg:max-w-[70vw] lg:flex-row">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-semibold text-[primaryGreen]">
            Optimize Your Bookings and Maximize Earnings with Tramona
          </h1>
          <p>
            Tramona is a booking platform designed to <b>fill your calendar</b>{" "}
            by supplementing your existing channels like Airbnb or Vrbo.
            There&apos;s nothing more frustrating than having empty nights, and
            that&aposs where Tramona comes in. With our platform, you have a
            simple, effective way to decide if you want to book those vacant
            dates,{" "}
            <b>ensuring you maximize your income without any extra hassle,</b>{" "}
            or lowering pricing on Airbnb.
          </p>
        </div>
        {/* Image container that maintains aspect ratio */}
        <div className="flex flex-1 items-center justify-center lg:max-w-[40%]">
          <span className="relative w-full">
            <Image
              src="/assets/images/why-list/beautiful-villa.png"
              alt="beautiful villa"
              width={435}
              height={345}
              className="h-auto w-full object-contain"
              priority
            />
          </span>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <ul className="mx-6 flex flex-col justify-center gap-8 md:flex-row">
      <li className="flex max-w-xl flex-col rounded-xl border border-solid border-gray-300 p-8 text-center">
        <h3 className="mb-6 text-xl font-semibold text-[primaryGreen]">
          Name your own price
        </h3>
        <p className="text-left">
          Travelers say where they want to go, how much they want to spend, the
          dates and amount of guests. That request goes out to all hosts with a
          vacancy in that area.{" "}
          <b>Hosts then get to accept, counter offer or decline the request.</b>
        </p>
      </li>
      <li className="flex max-w-xl flex-col rounded-xl border border-solid border-gray-300 p-8 text-center">
        <h3 className="mb-6 text-xl font-semibold text-[primaryGreen]">
          Book it now
        </h3>
        <p className="text-left">
          Travelers can go to the book it now pages and book your vacancies
          directly. Just like Name your own price,{" "}
          <b>
            hosts have full control over pricing and can opt in for instant book
            or request to book.
          </b>
        </p>
      </li>
    </ul>
  );
};

const StepByStepItem = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <li className="mx-4 flex min-h-[254px] flex-col items-start gap-5">
      <Icon size={30} className="text-primaryGreen" />
      <p className="text-[20px] font-bold text-primaryGreen">{title}</p>
      <p className="text-[14px] font-medium">{description}</p>
    </li>
  );
};

const StepByStepList = () => {
  return (
    <ul className="grid grid-cols-1 px-16 sm:grid-cols-2 lg:grid-cols-4">
      <StepByStepItem
        icon={PencilIcon}
        title="Sign up with Tramona"
        description="Link your account directly with Airbnb and automatically import your properties and link your calendar."
      />
      <StepByStepItem
        icon={CircleCheckIcon}
        title="Choose how you want to book"
        description="Pricing is 100% flexible and up to you. Keep it a manual booking process or automate it."
      />
      <StepByStepItem
        icon={ClockIcon}
        title="Start receiving requests and bookings"
        description="Submit matches yourself or set your property to auto-match for instant bookings. Join our 'Book it Now' page for more visibility."
      />
      <StepByStepItem
        icon={MapPinIcon}
        title="Enjoy a full calendar"
        description="Travelers who are looking to travel to your area will start to send you offers. You can accept, counteroffer, or reject from here."
      />
    </ul>
  );
};

const Questions = () => {
  return (
    <ul className="mx-12 flex flex-wrap justify-center gap-24">
      <div className="flex flex-col items-center">
        <p className="mb-8 text-center text-xl font-medium">
          Schedule a call with our onboarding team
        </p>
        <Link href="https://calendly.com/tramona">
          <Button size="lg" className="bg-primaryGreen text-white">
            Book a Call
          </Button>
        </Link>
      </div>
      <li className="flex flex-col items-center">
        <p className="mb-8 text-xl font-medium">
          Read some common questions and answers
        </p>
        <Link href="/faq">
          <Button size="lg" className="bg-primaryGreen text-white">
            FAQ
          </Button>
        </Link>
      </li>
    </ul>
  );
};

const KeyFeatures = () => {
  return (
    <section className="mx-12 flex flex-row flex-wrap justify-center gap-8">
      <Image
        src="/assets/images/why-list/key-features.png"
        className="my-16 h-auto w-full rounded-3xl object-cover md:my-0 md:h-[600px] md:w-[440px]"
        alt="mountain trail"
        width={512}
        height={699}
      />
      <div className="flex max-w-xl flex-grow flex-col justify-start">
        <h2 className="text-4xl font-bold text-[primaryGreen]">
          Key Features for Hosts
        </h2>
        {/* Feature List */}
        <ul className="mt-6 flex flex-col gap-4">
          <KeyFeatureItem
            title="Easy sync with Airbnb"
            description="Import all your properties and preferences in less than 1 minute
              by syncing with Airbnb. This also syncs your calendar."
          />
          <KeyFeatureItem
            title="Verified Travelers"
            description="All travelers are verified and undergo 3 levels of verification."
          />
          <KeyFeatureItem
            title="Taxes handled"
            description="We handle all taxes Airbnb"
          />
          <KeyFeatureItem
            title="Property Protection"
            description=" We protect up to 50k of protection per booking and also allow for
              security deposits."
          />
          <KeyFeatureItem
            title="Cost for Hosts"
            description="Tramona is completely free to sign up, and we only charge 2.5% on
              the host side, cheapest on the market. Travelers pay 5.5%."
          />
          <KeyFeatureItem
            title="Co-hosting"
            description="Invite a co-host and have them do the hard stuff"
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
      <p className="text-base font-normal">{description}</p>
    </li>
  );
};

const SecurityPrivacyItem = ({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) => {
  return (
    <li className="flex flex-row items-center gap-2">
      <Icon className="text-primaryGreen" />
      <p className="text-base">{title}</p>
    </li>
  );
};

const SecurityPrivacy = () => {
  return (
    <section className="mx-12 flex flex-row flex-wrap-reverse items-center justify-center gap-12 md:gap-4">
      {/* Text Container */}
      <div className="flex max-w-screen-sm flex-col text-left">
        <h2 className="text-3xl text-gray-600">List With Confidence</h2>
        <h1 className="mt-6 text-4xl text-[primaryGreen]">
          Your Security and Peace of Mind Are Our Priority
        </h1>
        <p className="mt-4 text-base">
          At Tramona, we understand that trust is essential when opening your
          property to travelers. We&aposre committed to providing a secure and
          reliable platform that gives you the confidence to accept bookings and
          maximize your revenue.
        </p>
        <ul className="mt-5 flex flex-col gap-4">
          <SecurityPrivacyItem
            title="Up to $50,0000 of protection per booking"
            icon={ShieldIcon}
          />
          <SecurityPrivacyItem
            title="Optional security deposits"
            icon={LockIcon}
          />
          <SecurityPrivacyItem title="24/7 Support" icon={PhoneCallIcon} />
          <SecurityPrivacyItem
            title="3 levels of verification"
            icon={UserCheckIcon}
          />
          <SecurityPrivacyItem
            title="Complete control over pricing"
            icon={DollarSignIcon}
          />
          <SecurityPrivacyItem
            title="Manual and automatic booking options"
            icon={ToggleLeftIcon}
          />
        </ul>
      </div>
      <span className="mt-16 flex items-center justify-center">
        <Image
          src="/assets/images/why-list/secure.png"
          width={400}
          height={376}
          alt="secure"
          className="object-contain"
        />
      </span>
    </section>
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
    title: "Sign up Manually",
    info: "Manually onboard yourself, you can also just enter a link in this section and most information we need will come instantly over.",
    image: "/assets/images/host-welcome/2.png",
  },
  {
    id: 2,
    title: "We sign you up",
    info: "Have any questions? Schedule a call and we will help onboard you and answer all questions in the meantime.",
    image: "/assets/images/host-welcome/3.png",
  },
];

const ListInAMinute = () => {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 md:space-y-20 md:px-8 lg:px-10 xl:px-12">
      <h1 className="text-center text-3xl font-bold md:text-4xl lg:text-5xl">
        List in less than 1 minute with our effortless sign up flow
      </h1>
      <ul className="flex flex-col gap-6 lg:flex-row">
        {contents.map((content) => (
          <li key={content.id} className="flex basis-1/3 items-center gap-2">
            <span className="relative h-32 w-5/12 overflow-clip rounded-xl lg:h-full">
              <Image
                src={content.image}
                objectFit="cover"
                layout="fill"
                alt={content.title}
              />
            </span>
            <span className="flex-1 space-y-2">
              <h2 className="font-bold">{content.title}</h2>
              <p className="text-sm">{content.info}</p>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ForHostsPage;
