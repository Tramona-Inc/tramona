import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import SqwiggleIcon from "@/components/_icons/SqwiggleIcon";
import { liveFeedOffers } from "@/components/offer-card/data";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import React from "react";

import MainLayout from "@/components/_common/Layout/MainLayout";
import { cn } from "@/utils/utils";
import Autoplay from "embla-carousel-autoplay";
import HowItWorks from "@/components/_common/HowItWorks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DamageProtection = () => {
  return (
    <section className="space-y-10 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold sm:text-4xl">
        Your home, protected
      </h1>
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center md:flex-row">
        <div className="flex-1 space-y-6 p-6 text-center md:mr-8 md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Damage Protection for Hosts
          </h2>
          <p className="text-lg text-gray-700 sm:text-xl">
            Discovering damages can be stressful, and your peace of mind is our
            top priority. That&apos;s why we have partnered with Superhog to
            provide all our hosts/property managers with damage protection up to
            $50,000.
          </p>
          <p className="text-lg text-gray-700 sm:text-xl">
            Our collaboration with Superhog ensures a seamless experience for
            you. They specialize in handling incidents and will take charge of
            the process from here.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <div className="h-64 w-full overflow-hidden rounded-lg md:h-auto">
            <Image
              src="/assets/images/landing-page/damage_protection.jpeg"
              alt=""
              width={384}
              height={300}
              unoptimized
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
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
    title: "We make the market efficent",
    info: "More negotiation means more deals. Deals that previously would not have happened. We give you the freedom to choose if you want them.",
    image: "/assets/images/host-welcome/1.avif",
  },
  {
    id: 1,
    title: "We are creating new deals",
    info: "By being on Tramona you have the freedom to do accept deals that work for you. ",
    image: "/assets/images/host-welcome/2.jpg",
  },
  {
    id: 2,
    title: "We increase your month-over-month revenue",
    info: "Customers are often swayed to book a trip when presented with a good deal. Deals increase the likelihood of bookings - which means more money for you!",
    image: "/assets/images/host-welcome/3.avif",
  },
];

function IntroSection() {
  return (
    <div className="[&>*]:flex [&>*]:min-h-[calc(100vh-4.25rem)] [&>*]:flex-col [&>*]:items-center [&>*]:justify-center [&>*]:gap-8 [&>*]:px-4 [&>*]:py-16 [&>*]:sm:px-16">
      <section className="relative bg-white">
        <div className="flex flex-col-reverse items-center lg:flex-row lg:space-x-10 xl:space-x-20">
          <div className="max-w-xl space-y-5 lg:space-y-10">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome Hosts!
            </h2>
            <p className="text-lg tracking-tight sm:text-2xl">
              Tramona is a travel service built specifically to decrease your
              vacancies and increase your month-over-month profit.
            </p>
            <Link
              href="host/onboarding"
              className={buttonVariants({
                variant: "greenPrimary",
                size: "lg",
              })}
            >
              Sign Up Now
            </Link>
          </div>
          <div className="py-10 md:py-5">
            <Image
              src={"/assets/images/host-welcome/4.avif"}
              width={500}
              height={500}
              alt=""
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Partners() {
  const partners = [
    {
      name: "Hostaway",
      image: "/assets/logos/hostaway-logo.png",
    },
    {
      name: "Hostfully",
      image: "/assets/logos/hostfully-logo.png",
    },
    {
      name: "OwnerRez",
      image: "/assets/logos/ownerRez-logo.png",
    },
    {
      name: "Hospitable",
      image: "/assets/logos/hospitable-logo.png",
    },
    {
      name: "Superhog",
      image: "/assets/logos/superhog-logo.png",
    },
  ];

  return (
    <section className="space-y-12 text-center">
      <h1 className="text-4xl font-bold">
        We work with industry leading partners
      </h1>
      <div className="flex flex-wrap items-center justify-evenly">
        {partners.map((partner) => (
          <div key={partner.name}>
            <Image
              src={partner.image}
              alt={partner.name}
              width={150}
              height={150}
            />
          </div>
        ))}
      </div>
      <p className="text-xl font-bold text-muted-foreground">
        Plus more coming soon
      </p>
    </section>
  );
}

function SafetyHotline() {
  return (
    <section className="mx-8 rounded-xl bg-zinc-50 px-2 py-8 sm:mx-24 sm:py-14">
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-bold sm:text-4xl ">
          Tramona has a 24-safety line for hosts and Travelers
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Call our support line at any time, with any questions you may have.
        </p>
      </div>
    </section>
  );
}

function FAQ() {
  const accordionItems = [
    {
      question: "How much does it cost to sign up?",
      answer: "Tramona is completely free to use.",
    },
    {
      question: "How do I see my requests?",
      answer:
        "You can see requests in your dashboard, or by checking your phone. We will send you a text if there is a relevant request.",
    },
    {
      question: "What happens if I don't like the price?",
      answer:
        "If you don't like the price you can send back a counter offer. You can even reject it if you're not interested at all.",
    },
    {
      question: "How does a traveler see the match?",
      answer:
        "Travelers see the match in the requests tab or through their phone. We do this to make the transaction as seamless as possible.",
    },
  ];

  return (
    <section className="mx-8 grid grid-cols-1 gap-6 md:mx-24 md:grid-cols-3">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Frequently asked questions
        </h1>
      </div>
      <div className="col-span-2 border-t">
        <Accordion type="multiple">
          {accordionItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="py-4">
              <AccordionTrigger className="font-bold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function WhyPartnerWithUs() {
  const reasons = [
    {
      title: "Looking for a place?",
      description:
        "Tramona keeps guests safe by not only verifying them on Tramona, but also making sure they are verified on Airbnb as well.",
      number: "300,000+",
      numberDescription: "proprieties your matches will be coming from",
      callToAction: {
        name: "Submit a request",
        href: "/",
      },
    },
    {
      title: "Listing your place",
      description:
        "It's as easy as making an account and connecting to a PMS if you have one. Once on, wait for requests to roll in.",
      number: "15%",
      numberDescription: "fewer vacancies when using Tramona",
      callToAction: {
        name: "List my place",
        href: "/host/properties",
      },
    },
  ];

  return (
    <section className="mx-8 space-y-8 sm:mx-24 sm:space-y-16">
      <h1 className="text-center text-3xl font-bold sm:text-4xl">
        Why partner with us?
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl bg-zinc-50 p-4 text-center sm:p-10"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">{reason.title}</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              {reason.description}
            </p>
            <p className="text-3xl font-bold text-teal-900 sm:text-4xl">
              {reason.number}
            </p>
            <p className="text-sm font-bold sm:text-base">
              {reason.numberDescription}
            </p>
            <div>
              <Link href={reason.callToAction.href}>
                <Button
                  variant="greenPrimary"
                  size="lg"
                  className="rounded-full"
                >
                  {reason.callToAction.name}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HostWelcome() {
  // State to track selected tab and image opacity
  const [tab, setTab] = useState<number>(0);
  const [imageOpacity, setImageOpacity] = useState<number>(1);
  const [api, setApi] = React.useState<CarouselApi>();

  // Filter the selected content based on the tab
  const selectedContent = contents.find((content) => content.id === tab);

  // Handle tab change with fade transition
  const handleTabChange = (content: Tabs) => {
    // Set image opacity to 0 to start the fade-out transition
    setImageOpacity(0);

    // Delay the tab change to allow time for the fade-out transition
    setTimeout(() => {
      // Update the tab
      setTab(content.id);
    }, 250); // Adjust the timeout based on your transition duration
    setTimeout(() => {
      setImageOpacity(1);
    }, 500);
  };

  // Offers with discount greater than 25%
  const selectedOffers = liveFeedOffers.filter(
    (offer) => offer.discountPercent > 25,
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setTab(api.selectedScrollSnap());

    api.on("select", () => {
      setTab(api.selectedScrollSnap());
    });
  }, [api]);
  const steps = [
    {
      number: "1",
      title: "Sign up as a host",
      description:
        "We work with many of the biggest PMS providers, if we don't work with yours please let us know here. If you don't have a PMS, you can also sign up normally",
    },
    {
      number: "2",
      title: "Set your settings in your dashboard",
      description:
        "Travelers come to us and tell us how much they want to spend and where they want to go.",
    },
    {
      number: "3",
      title: "Wait for requests to roll in",
      description:
        "Requests will be sent right to your phone and you can accept, reject, or counter offer.",
    },
  ];

  return (
    <MainLayout>
      <Head>
        <title>Hosts | Tramona</title>
      </Head>

      <div className="">
        <IntroSection />
      </div>

      <HowItWorks steps={steps} title="How does hosting with Tramona work?" />

      <Partners />

      <hr className="mx-24 mb-12 mt-24 h-px border-0"></hr>

      <DamageProtection />

      <hr className="mx-24 mb-12 mt-24 h-px border-0"></hr>

      <SafetyHotline />

      <hr className="mx-24 mb-12 mt-24 h-px border-0"></hr>

      <FAQ />

      <hr className="mx-24 mb-12 mt-24 h-px border-0"></hr>

      <WhyPartnerWithUs />

      <hr className="mx-24 mb-12 mt-24 h-px border-0"></hr>
    </MainLayout>
  );
}
