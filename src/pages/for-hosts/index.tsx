import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

import MainLayout from "@/components/_common/Layout/MainLayout";
import HowItWorksHost from "@/pages/how-it-works-host";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RequestFeed from "@/components/activity-feed/RequestFeed";

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
    <section className="space-y-10 bg-white px-4 py-10 md:px-6 lg:px-8">
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

function IntroSection() {
  return (
    <div className="[&>*]:flex [&>*]:min-h-[calc(100vh-4.25rem)] [&>*]:flex-col [&>*]:items-center [&>*]:justify-center [&>*]:gap-8 [&>*]:px-4 [&>*]:py-16 [&>*]:md:px-16">
      <section className="relative bg-white">
        <div className="flex flex-col-reverse items-center lg:flex-row lg:space-x-10 xl:space-x-20">
          <div className="max-w-xl space-y-5 lg:space-y-10">
            <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
              Welcome Hosts!
            </h2>
            <p className="text-lg tracking-tight md:text-2xl">
              Tramona is a travel service built specifically to decrease your
              vacancies and increase your month-over-month profit.
            </p>
            <Link
              href="host-onboarding"
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
        <div className="rounded-lg border px-2 py-2 shadow-xl">
          <RequestFeed />
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

function ReadytoListOnTramona() {
  return (
    <>
      <section className="mx-auto mt-4 hidden max-w-7xl p-2 text-end sm:block">
        <div className="flex items-center justify-end space-x-2">
          <div className="text-sm">Ready to list on Tramona?</div>
          <Link
            href="/host-onboarding"
            className={buttonVariants({
              variant: "greenPrimary",
              size: "sm",
            })}
          >
            Become a Host
          </Link>
        </div>
      </section>
      <section className="fixed bottom-0 z-10 w-full bg-white p-4 shadow-inner sm:hidden">
        <div className="flex flex-col justify-center gap-4 shadow-2xl">
          <div className="text-center font-semibold">
            Ready to list on Tramona?
          </div>
          <Link
            href="/host-onboarding"
            className={buttonVariants({
              variant: "greenPrimary",
              size: "sm",
            })}
          >
            Become a Host
          </Link>
        </div>
      </section>
    </>
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

export default function HostWelcome() {
  return (
    <MainLayout className="mx-auto max-w-full">
      <div className="relative overflow-x-hidden bg-white">
        <Head>
          <title>Hosts | Tramona</title>
        </Head>

        <ReadytoListOnTramona />

        <hr className="mx-24 mb-12 mt-2 h-px border-0"></hr>

        <IntroSection />

        <hr className="mx-24 mb-12 mt-24 h-px border-0"></hr>

        <ListInAMinute />

        <hr className="mx-24 mb-12 mt-24 h-px border-0"></hr>

        <HowItWorksHost />

        <hr className="mx-24 mb-12 mt-24 h-px border-0"></hr>

        <DamageProtection />

        <hr className="mx-24 mb-12 mt-24 h-px border-0"></hr>

        <WhatAreYouWaitingFor />

        <hr className="mx-24 mb-12 mt-24 h-px border-0"></hr>

        <FAQ />

        <hr className="mx-24 mb-12 mt-24 h-px border-0"></hr>
      </div>
    </MainLayout>
  );
}
