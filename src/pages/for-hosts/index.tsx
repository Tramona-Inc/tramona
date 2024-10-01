import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RequestFeed from "@/components/activity-feed/RequestFeed";
import { type FeedRequestItem } from "@/components/activity-feed/ActivityFeed";
import { getFeed } from "@/server/api/routers/feedRouter";
import { type InferGetStaticPropsType } from "next";
import HowItWorksHost from "@/components/landing-page/how-it-works-host";
// import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TramonaIcon from "@/components/_icons/TramonaIcon";
import Footer from "@/components/_common/Layout/Footer";
import AccordionFaq from "@/components/_common/AccordionFaq";
import { forHostsAccordionItems } from "@/utils/constants";
import { TestimonialCarousel } from "@/components/landing-page/_sections/testimonials/TestimonialCarousel";
import { Check } from "lucide-react";

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

function IntroSection({ requestFeed }: { requestFeed: FeedRequestItem[] }) {
  return (
    <section className="relative mx-auto flex max-w-7xl justify-center px-2">
      <div className="flex flex-col items-center space-y-8 lg:flex-row lg:space-x-10 xl:space-x-20">
        <div className="max-w-xl space-y-5">
          <h2 className="text-center text-4xl font-bold tracking-tight text-primaryGreen md:text-6xl">
            List on Tramona
          </h2>
          <p className="text-center text-4xl font-semibold tracking-tight md:text-6xl">
            Let&apos;s make sure your calendar is filled
          </p>
          <p className="text-center text-lg font-medium tracking-tight md:text-2xl">
            100% free to use, sign up and let the requests start rolling in
          </p>
        </div>
        <div className="rounded-lg border px-2 py-2 shadow-xl">
          <RequestFeed requestFeed={requestFeed} />
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-3">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold md:text-4xl">
          Frequently asked questions
        </h1>
        <h2 className="text-lg font-bold underline">
          <Link href="/faq">See full FAQ </Link>
        </h2>
      </div>
      <div className="col-span-2 border-t">
        <AccordionFaq accordionItems={forHostsAccordionItems} />
      </div>
    </section>
  );
}

function ListInAMinute() {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 md:space-y-20 md:px-8 lg:px-10 xl:px-12">
      <h1 className="text-center text-3xl font-bold md:text-4xl lg:text-5xl">
        List in less than 1 minute with our effortless sign up flow
      </h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        {contents.map((content) => (
          <div key={content.id} className="flex basis-1/3 items-center gap-2">
            <div className="relative h-32 w-5/12 overflow-clip rounded-xl lg:h-full">
              <Image
                src={content.image}
                objectFit="cover"
                layout="fill"
                alt=""
              />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="font-bold">{content.title}</h2>
              <p className="text-sm">{content.info}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section className="space-y-6 text-balance text-center lg:px-44">
      <h1 className="text-3xl font-bold lg:text-5xl">Questions?</h1>
      <p className="font-semibold lg:text-3xl">
        Please look through our host FAQ video library. We specifically made it
        to answer any and all questions a host might have.
      </p>
      <Button size="lg">Host FAQ Library</Button>
    </section>
  );
}

function TailorYourBookingProcess() {
  const cards = [
    {
      title: "Send matches manually",
      description: "Manually respond to requests through our host dashboard",
      image: "/assets/images/host-welcome/handshake.jpeg",
    },
    {
      title: "Send matches automatically",
      description:
        "Set custom parameters for your vacant dates, and let Tramona automatically match you with suitable travelers.",
      image: "/assets/images/host-welcome/cloud.png",
    },
  ];

  return (
    <section className="mx-4 max-w-7xl lg:mx-auto">
      <h1 className="text-center text-3xl font-bold lg:text-5xl">
        Tailor your booking process
      </h1>
      <div className="mt-12 flex flex-col gap-6 md:flex-row md:justify-center md:gap-10 md:px-20">
        {cards.map((card, index) => (
          <div key={index} className="basis-1/3 space-y-2">
            <div className="relative h-56 w-full overflow-clip rounded-xl">
              <Image src={card.image} alt="" layout="fill" objectFit="cover" />
            </div>
            <div>
              <h2 className="font-semibold lg:text-2xl">{card.title}</h2>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DamageProtection() {
  const items = [
    {
      title: "Guest Identity Verification",
      description:
        "Tramona vets travelers in 3 ways so you are safe and protected when a guest checks in",
      bullets: {
        1: "Our own screening",
        2: "Another screening with a 3rd party",
        3: "An optional in depth, multi-hour screening with Stripe",
      },
    },
    {
      title: "Property Protection",
      description:
        "Tramona offers $50,000 in protection for each booking. This will move up to 1M in the coming months",
    },
    {
      title: "24 Hour Safety Line",
      description:
        "If you ever feel unsafe, our app provides one-tap access to specially-trained safety agents, day or night.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mx-4 flex flex-col gap-6 lg:flex-row lg:gap-12">
        <div className="relative h-64 overflow-clip rounded-lg lg:h-auto lg:w-1/3">
          <Image
            src="/assets/images/host-welcome/safe.jpeg"
            alt=""
            objectFit="cover"
            layout="fill"
          />
        </div>
        <div className="flex-1 space-y-10">
          <h1 className="text-3xl font-bold lg:text-4xl">
            Listing on Tramona is Safe and Effective
          </h1>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div className="flex gap-4" key={index}>
                <div className="text-primaryGreen">
                  <Check size={30} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  <p className="font-semibold">{item.description}</p>
                  {index === 0 && (
                    <ol className="list-inside list-decimal text-sm">
                      <li>{item.bullets?.[1]}</li>
                      <li>{item.bullets?.[2]}</li>
                      <li>{item.bullets?.[3]}</li>
                    </ol>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatAreYouWaitingFor() {
  return (
    <section className="mx-8 space-y-8 md:mx-24 md:space-y-16">
      <h1 className="text-center text-3xl font-bold md:text-5xl">
        What are you waiting for? Requests are coming in now!
      </h1>
      <div className="flex items-center justify-center space-x-4">
        <Link href="/host-onboarding">
          <Button className="h-16 w-80 bg-primaryGreen text-xl">
            Become a Host
          </Button>
        </Link>
      </div>
    </section>
  );
}

function SendUsAnEmail() {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="mx-4 space-y-6 text-center">
        <h2 className="text-3xl font-bold lg:text-4xl">
          Questions? Send us an email and we will get right back to you
        </h2>
        <p className="text-2xl font-semibold lg:text-3xl">info@tramona.com</p>
      </div>
    </section>
  );
}

function StickyTopBar() {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-white px-4 py-3 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/">
          <span className="text-7xl">
            <TramonaIcon />
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <span className="text-xl font-medium">Ready to List?</span>
          <Link href="/host-onboarding">
            <Button className="bg-primaryGreen px-6 py-3 text-lg font-semibold text-white">
              Tramona Setup
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileStickyBar() {
  return (
    <div className="fixed inset-x-0 z-50">
      <div className="fixed left-0 right-0 top-0 bg-white p-4 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center">
          <Link href="/">
            <span className="text-5xl">
              <TramonaIcon />
            </span>
          </Link>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md">
        <Link href="/host-onboarding" className="block">
          <Button className="w-full bg-primaryGreen py-3 text-lg font-semibold text-white">
            Tramona Setup
          </Button>
        </Link>
      </div>
    </div>
  );
}
export async function getStaticProps() {
  const requestFeed = await getFeed({ maxNumEntries: 10 }).then((r) =>
    r.filter((r) => r.type === "request"),
  );
  return {
    props: { requestFeed },
    revalidate: 60 * 5, // 5 minutes
  };
}

export default function HostWelcome({
  requestFeed,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <div className="relative space-y-32 overflow-x-hidden pb-32">
        <Head>
          <title>Hosts | Tramona</title>
        </Head>
        <div className="md:hidden">
          <MobileStickyBar />
        </div>

        <div className="hidden md:block">
          <StickyTopBar />
        </div>

        <IntroSection requestFeed={requestFeed} />
        <HowItWorksHost />
        <TestimonialCarousel />
        <Questions />
        <TailorYourBookingProcess />
        <DamageProtection />
        <ListInAMinute />
        <FAQ />
        <WhatAreYouWaitingFor />
        <SendUsAnEmail />
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
