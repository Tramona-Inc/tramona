import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RequestFeed from "@/components/activity-feed/RequestFeed";
import { type FeedRequestItem } from "@/components/activity-feed/ActivityFeed";
import { getFeed } from "@/server/api/routers/feedRouter";
import { type InferGetStaticPropsType } from "next";
import TramonaIcon from "@/components/_icons/TramonaIcon";
import Footer from "@/components/_common/Layout/Footer";
import AccordionFaq from "@/components/_common/AccordionFaq";
import { Check, CircleCheckBig } from "lucide-react";
import Onboarding1 from "@/components/host/onboarding/Onboarding1";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { useRouter } from "next/router";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

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

function MainSection({ requestFeed }: { requestFeed: FeedRequestItem[] }) {
  const router = useRouter();
  const progress = useHostOnboarding((state) => state.progress);
  const setProgress = useHostOnboarding((state) => state.setProgress);

  function onPressNext() {
    setProgress(progress + 1);
    void router.push("/host-onboarding");
  }

  const texts = [
    "Up to $50,000 of protection per bookings",
    "Optional security deposits",
    "24/7 support",
    "3 levels of verification",
    "Complete control over pricing",
    "Manual and automatic booking options",
  ];

  return (
    <section className="relative mx-auto max-w-7xl px-4">
      <div className="flex flex-col-reverse gap-10 lg:flex-row">
        <div className="basis-1/2">
          <h2 className="text-2xl font-bold">
            Sign up and start booking your vacancies
          </h2>
          <div className="py-4 lg:py-6">
            <div className="h-[350px] rounded-lg border px-2 py-2 shadow-xl lg:h-[450px]">
              <RequestFeed requestFeed={requestFeed} />
            </div>
          </div>
          <div className="hidden space-y-1 text-lg lg:block">
            {texts.map((text, index) => (
              <div className="flex items-center gap-2" key={index}>
                <CircleCheckBig className="text-teal-900" />
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 lg:hidden">
            <Questions />
          </div>
        </div>
        <div className="flex basis-1/2 flex-col gap-4">
          <div className="lg:rounded-lg lg:border lg:p-4">
            <Onboarding1 onPressNext={onPressNext} forHost />
          </div>

          <p className="font-semibold lg:text-lg">
            Hosts can expect to make 10-15% more when using Tramona to book
            their empty nights
          </p>
          <div className="space-y-1 text-lg lg:hidden">
            {texts.map((text, index) => (
              <div className="flex items-center gap-2" key={index}>
                <CircleCheckBig className="text-teal-900" />
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="hidden lg:block">
            <Questions />
          </div>
        </div>
      </div>
    </section>
  );
}

function Questions() {
  const router = useRouter();

  const buttons = [
    { title: "FAQ", onClick: () => router.push("/faq") },
    { title: "Watch host side demo", onClick: () => router.push("/demos") },
  ];

  return (
    <div className="space-y-4 lg:rounded-lg lg:border lg:p-4">
      <h1 className="text-2xl font-bold">Questions?</h1>
      <div className="flex flex-col gap-2">
        {buttons.map((button, index) => (
          <Button key={index} onClick={button.onClick}>
            {button.title}
          </Button>
        ))}
      </div>
    </div>
  );
}

function FAQ() {
  const forHostsAccordionItems = [
    {
      question: "Can I counter offer requests?",
      answer:
        "Yes! You have full control over pricing. If a traveler submits a request, you can respond with an offer that fits your availability and pricing preferences.",
    },
    {
      question: "Can I invite a co-host?",
      answer:
        "Yes, Tramona supports co-hosting. You can add a co-host to help manage bookings, respond to traveler inquiries, and coordinate check-ins. They’ll have access to the necessary tools without needing full access to your account.",
    },
    {
      question: "Why list on Tramona?",
      answer:
        "Tramona helps you optimize occupancy and revenue by offering more flexibility. Just like how Priceline allowed hotels to offload unbooked rooms without lowering rates across the board, Tramona allows you to keep your listings at full price on other platforms while accepting offers for lower rates only when you choose. We also take lower fees than platforms like Airbnb and VRBO, meaning you can earn more while giving travelers better deals.",
    },
    {
      question: "Can I sync my calendar with other platforms?",
      answer:
        "Yes, Tramona allows you to sync your calendar with Airbnb. This ensures your availability is updated across all platforms, preventing double bookings.",
    },
  ];

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
              <Image
                src={card.image}
                alt=""
                className="select-none object-cover object-center"
                fill
              />
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
            className="select-none object-cover object-center"
            fill
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

        <MainSection requestFeed={requestFeed} />
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
