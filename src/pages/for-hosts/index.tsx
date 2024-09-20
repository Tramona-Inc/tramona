import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RequestFeed from "@/components/activity-feed/RequestFeed";
import { type FeedRequestItem } from "@/components/activity-feed/ActivityFeed";
import { getFeed } from "@/server/api/routers/feedRouter";
import { type InferGetStaticPropsType } from "next";
import HowItWorksHost from "@/components/landing-page/how-it-works-host";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TramonaIcon from "@/components/_icons/TramonaIcon";
import { useIsMd } from "@/utils/utils";
import Footer from "@/components/_common/Layout/Footer";

const DamageProtection = () => {
  const protectionMethods = [
    {
      id: 0,
      description: "Our own screening",
    },
    {
      id: 1,
      description: "Another screening with a 3rd party",
    },
    {
      id: 2,
      description: "An optional in depth, multi-hour screening with Stripe",
    },
  ];
  return (
    <section className="space-y-10 px-4 py-10 md:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold md:text-5xl">
        Tramona Cover
      </h1>
      <h2 className="text-center text-2xl font-semibold md:text-4xl">
        Listing on Tramona is Safe and Effective
      </h2>
      <div className="mx-auto flex max-w-5xl flex-col items-start">
        <div className="flex-1 space-y-6 p-6 text-center md:mr-8 md:text-left">
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
            Guest Identity Verification
          </h2>
          <h3 className="text-lg font-semibold text-gray-900 md:text-xl">
            Tramona vets travelers in 3 ways so you are safe and protected when
            a guest checks in
          </h3>
          {protectionMethods.map((method) => (
            <div key={method.id}>
              <p className="text-sm text-gray-700 md:text-base">
                {method.id + 1}.&nbsp;{method.description}
              </p>
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-6 p-6 text-center md:mr-8 md:text-left">
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
            Property Protection
          </h2>
          <p className="text-sm text-gray-700 md:text-base">
            Tramona offers $50,000 in protection for each booking. This will
            move up to 1M in the coming months
          </p>
        </div>
        <div className="flex-1 space-y-6 p-6 text-center md:mr-8 md:text-left">
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
            24 Hour Safety Line
          </h2>
          <p className="text-sm text-gray-700 md:text-base">
            If you ever feel unsafe, our app provides one-tap access to
            specially-trained safety agents, day or night.
          </p>
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
    title: "Directly with Airbnb",
    info: "Instantly sign up with Airbnb Via our partner hospitable. This will redirect you to Airbnb and allow an effortless onboarding",
    image: "/assets/images/host-welcome/1.avif",
  },
  {
    id: 1,
    title: "Sign up Manually",
    info: "Manually onboard yourself, you can also just enter a link in this section and most information we need will come instantly over",
    image: "/assets/images/host-welcome/2.jpg",
  },
  {
    id: 2,
    title: "Sign up with PMS",
    info: "Use a PMS? As of now we are partnered with Hostaway. More coming soon!",
    image: "/assets/images/host-welcome/3.avif",
  },
  {
    id: 3,
    title: "We sign you up",
    info: "Have any questions? Schedule a call and we will help onboard you and answer all questions in the meantime.",
    image: "/assets/images/host-welcome/4.avif",
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
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-3">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">
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

function ListInAMinute() {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 md:space-y-24 md:px-8 lg:px-10 xl:px-12">
      <h1 className="text-center text-3xl font-bold md:text-4xl lg:text-5xl">
        List in less than 1 minute with our effortless sign up flow
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8">
        {contents.map((content) => (
          <div
            key={content.id}
            className="rounded-xl bg-zinc-50 p-4 text-center sm:p-6"
          >
            <div className="mx-auto h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36">
              <Image
                src={content.image}
                alt=""
                layout="responsive"
                width={150}
                height={150}
              />
            </div>
            <h2 className="h-10 text-xl font-bold sm:text-2xl md:h-14 md:text-3xl lg:h-24">
              {content.title}
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              {content.info}
            </p>
          </div>
        ))}
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
  const isMd = useIsMd();
  return (
    // <DashboardLayout>
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
        <ListInAMinute />
        <HowItWorksHost />
        <DamageProtection />
        <FAQ />
        <WhatAreYouWaitingFor />
      </div>
      {isMd && <Footer />}
    </div>
    // {/* </DashboardLayout> */}
  );
}
