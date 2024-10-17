import React from "react";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostCalculator from "@/components/host/HostCalculator";
import Head from "next/head";
import { Pencil, CheckCircle, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AccordionFaq from "@/components/_common/AccordionFaq";

export const whyListAccordionItems = [
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

export default function ForHostsPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>For Hosts | Tramona</title>
      </Head>
      <div className="mx-auto space-y-16 px-4 pb-16 sm:space-y-28 sm:pb-32">
        <HeroSection />
        <AboutSection />
        <WhyListSection />
        <HotelIndustrySection />
        <HowItWorksSection />
        <SecuritySection />
        <KeyFeaturesSection />
        <FAQ />
      </div>
    </DashboardLayout>
  );
}

function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl pt-8">
      <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="mb-6 text-4xl font-bold text-primaryGreen sm:text-5xl">
            For Hosts
          </h1>
          <h2 className="mb-6 text-3xl font-semibold sm:text-4xl">
            Maximize Your Bookings
            <br />
            with Tramona
          </h2>
          <p className="text-lg text-gray-600 sm:text-xl">
            The Priceline for Short-Term Rentals
          </p>
        </div>
        <div className="mt-8 flex w-full justify-center lg:mt-0 lg:flex-1">
          <HostCalculator />
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="mx-auto max-w-6xl pb-12">
      <div className="flex flex-col items-center lg:flex-row lg:space-x-6">
        <div className="mb-8 flex-1 text-center lg:mb-0 lg:w-1/2 lg:text-left">
          <h2 className="mb-6 text-3xl font-semibold text-gray-600">About</h2>
          <h3 className="mb-4 text-3xl font-bold text-primaryGreen sm:text-4xl">
            What is Tramona?
          </h3>

          <p className="mb-4 text-base leading-relaxed text-gray-700 lg:pr-20">
            Tramona is a booking platform designed to help you{" "}
            <span className="font-bold text-black">
              fill those hard-to-book dates
            </span>
            that typically go vacant, complementing your existing channels like
            Airbnb and VRBO. With Tramona, you can unlock more revenue by
            offering exclusive deals to travelers while maintaining your premium
            pricing on other platforms. Think of us as the Priceline for
            short-term rentals,{" "}
            <span className="font-bold text-black">
              ensuring that your calendar stays full
            </span>{" "}
            without sacrificing your pricing strategy.
          </p>
        </div>
        <div className="relative ml-12 flex justify-center md:ml-20 lg:w-1/2 lg:justify-end">
          <Image
            src="/assets/images/why-list/productive.png"
            alt="Host using laptop"
            width={265}
            height={265}
            className="rounded-lg"
          />
          <div className="absolute -bottom-16 -left-16 transform md:-left-32 lg:left-auto lg:right-44 lg:translate-x-0">
            <Card className="w-[289px] overflow-hidden drop-shadow-md">
              <CardHeader className="">
                <div className="relative h-[102px] w-full">
                  <Image
                    src="/assets/images/why-list/cardimage.png"
                    alt="Beautiful Villa on the Beach"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="">
                <h3 className="text-lg font-bold text-primaryGreen">
                  Beautiful Villa on the Beach
                </h3>
                <p className="text-sm text-gray-500">Orlando, FL, USA</p>
                <Badge className="mt-2 bg-blue-600 font-light text-white">
                  6 offers
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyListSection() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col-reverse items-center md:flex-row md:items-center md:space-x-8">
        <div className="mb-8 flex flex-1 justify-center space-y-4 md:mb-0">
          <div className="space-y-4">
            {["$1200/night", "$1180/night", "$1174/night"].map(
              (price, index) => (
                <Card
                  key={index}
                  className="h-24 w-full drop-shadow-lg sm:w-96"
                >
                  <CardContent>
                    <h3 className="mb-2 text-sm font-semibold text-blue-600">
                      Counter offer
                    </h3>
                    <div className="grid grid-cols-3 grid-rows-2 items-center gap-x-2">
                      <p className="font-bold text-gray-700">{price}</p>
                      <div className="h-2 rounded bg-gray-300"></div>
                      <div className="h-2 w-3/4 rounded bg-gray-300"></div>
                      <div className="h-2 w-3/4 rounded bg-gray-300"></div>
                      <div className="-mt-4 h-2 w-2/3 rounded bg-gray-300"></div>
                      <div className="-mt-4 h-2 rounded bg-gray-300"></div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </div>
        <div className="flex-1 text-center lg:text-left">
          <h2 className="mb-2 text-3xl font-bold leading-relaxed text-primaryGreen sm:text-4xl">
            Why List on Tramona?
          </h2>
          <p className="mb-4 leading-relaxed text-gray-600 lg:pr-12">
            Maximize your income by{" "}
            <span className="font-bold text-black">
              turning empty nights into bookings
            </span>
            . With 82% of travelers actively seeking deals, Tramona is where
            they come to find them. You stay in control—whether you prefer
            instant bookings, a "Request to Book" option, or the ability to
            negotiate directly by accepting, countering, or rejecting any offer.{" "}
            <span className="font-bold text-black">
              You&apos;re never forced to give discounts
            </span>
            , but you have the option to when you need to fill an empty night.
          </p>
        </div>
      </div>
    </section>
  );
}

function HotelIndustrySection() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="mb-4 text-3xl font-bold text-primaryGreen sm:text-4xl">
            Learn from the Hotel
            <br />
            Industry&apos;s Success
          </h2>
          <div className="md:pr-16">
            <p className="mb-4 leading-relaxed text-gray-600">
              This strategy mimics the way top hotels like Hilton and Marriott
              operate. They don&apos;t offer steep discounts on their websites
              to protect their brand while leveraging platforms like Priceline,
              Trivago, and HotelTonight to discreetly offload vacant rooms. This
              approach lets businesses unload inventory without hurting their
              brand or existing direct bookings.
            </p>
            <p className="font-bold leading-relaxed text-black">
              Now, you can apply this same successful strategy to your
              short-term rental with Tramona.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-1 justify-center space-x-4 md:mt-0">
          <Image
            src="/assets/images/why-list/ellipse.png"
            alt="Hilton logo"
            className="object-contain"
            width={500}
            height={500}
          />
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      title: "Sign up with Tramona",
      description:
        "Automatically import your properties and link your calendar with Airbnb. When travelers request bookings, you'll be notified to approve or decline.",
      icon: <Pencil />,
    },
    {
      title: "Decide to accept the booking",
      description:
        "You then get to set your price restrictions and accept, counter offer and reject requests.",
      icon: <CheckCircle />,
    },
    {
      title: "Make a Match Manually or Automatically",
      description:
        "Submit matches yourself or set your property to auto-match for smart bookings. Join our 'Book it Now' page for more visibility.",
      icon: <MapPinIcon />,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl">
      <h2 className="mb-12 text-center text-3xl font-bold text-primaryGreen sm:text-4xl">
        How Tramona Works for You
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center md:items-start md:text-left"
          >
            <div className="mb-4 text-4xl text-primaryGreen">{step.icon}</div>
            <h3 className="mb-6 text-xl font-bold text-primaryGreen sm:text-2xl">
              {step.title}
            </h3>
            <p className="leading-relaxed text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SecuritySection() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-8">
        <div className="flex-1 text-center md:pr-32 md:text-left">
          <h2 className="mb-6 text-2xl font-bold text-gray-600 sm:text-3xl">
            List With Confidence
          </h2>
          <h3 className="mb-4 text-3xl font-bold text-primaryGreen sm:text-4xl">
            Your Security and Peace
            <br /> of Mind Are Our Priority
          </h3>
          <p className="mb-4 leading-relaxed text-gray-600">
            At Tramona, we understand that trust is essential when sharing your
            space. That&apos;s why we&apos;ve implemented robust security
            measures and verification processes, providing a secure and reliable
            platform that gives you the confidence to accept bookings and
            maximize your revenue.
          </p>
        </div>
        <div className="relative mt-8 flex-1 md:mt-0">
          <Image
            src="/assets/images/why-list/usinglaptop.png"
            alt="Host using laptop"
            className="rounded-lg"
            width={373}
            height={334}
          />
          <div className="absolute bottom-0 right-20 flex translate-y-1/4 transform items-center space-x-2 border-8 border-primaryGreen bg-white p-3 shadow-lg">
            <div className="flex h-6 w-6 items-center justify-center rounded-full text-primaryGreen">
              <CheckCircle />
            </div>
            <span className="font-semibold text-gray-700">100% Secure</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function KeyFeaturesSection() {
  const features = [
    {
      title: "Verified Travelers",
      description: "All travelers undergo 3 levels of verification.",
    },
    {
      title: "Secure Payments",
      description:
        "We use encrypted payment systems to handle transactions safely and efficiently.",
    },
    {
      title: "Property Protection",
      description:
        "Comprehensive coverage to protect your property against damages and unexpected costs.",
    },
    {
      title: "Cost For Hosts",
      description:
        "Tramona is completely free to sign up, and we only charge 2.5% on the host side cheapest on the market. Travelers pay 5.5%.",
    },
    {
      title: "Support When You Need It",
      description:
        "Our dedicated support team is available 24/7 to assist with any questions or concerns.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col items-center lg:flex-row-reverse lg:space-x-8 lg:space-x-reverse">
        <div className="flex-1 space-y-3 text-left lg:text-left">
          <h2 className="mb-8 text-center text-3xl font-bold text-primaryGreen sm:text-4xl lg:text-left">
            Key Features for Hosts
          </h2>
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col space-y-2 lg:pr-12">
              <span className="text-lg font-bold leading-relaxed text-black">
                {feature.title}
              </span>
              <span className="text-lg leading-relaxed text-gray-700">
                {feature.description}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex-1 lg:mr-8 lg:mt-0">
          <Image
            src="/assets/images/why-list/hiker.png"
            alt="Traveler with backpack"
            className="rounded-lg"
            width={488}
            height={594}
          />
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-col space-y-6 p-4 md:grid md:grid-cols-3 md:gap-6">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl font-bold md:text-4xl">
            Frequently asked questions
          </h1>
        </div>
        <div className="col-span-2 border-t">
          <AccordionFaq accordionItems={whyListAccordionItems} />
          <div className="mt-4 flex justify-center md:justify-start">
            <Link href="/faq">
              <Button size="lg" className="bg-primaryGreen text-white">
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
