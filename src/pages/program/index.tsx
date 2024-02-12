import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

import * as SliderPrimitive from "@radix-ui/react-slider";
import PinkStarIcon from "@/components/_icons/PinkStarIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CopyToClipboardBtn from "@/components/_utils/CopyToClipboardBtn";

import { cn } from "@/utils/utils";
import { api } from "@/utils/api";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-b-lg bg-white/20">
      <SliderPrimitive.Range className="absolute h-full bg-pink-500" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-pink-500 bg-gray-900 transition-all hover:scale-125 hover:cursor-pointer focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

function ExploreEarningsCard() {
  const avgAnnualTravelSpendings = 169.2;

  const tiers = [
    {
      name: "Partner",
      percent: 30,
      orMore: false,
    },
    {
      name: "Ambassador",
      percent: 50,
      orMore: false,
    },
  ] as const;

  const [tab, setTab] = useState(0);
  const [referrals, setReferrals] = useState(200);

  const currentTier = tiers[tab];
  if (!currentTier) return <div>Loading...</div>;

  const earnings = Math.floor(
    referrals * avgAnnualTravelSpendings * (currentTier.percent / 100),
  );

  const fmtdEarnings = `$${earnings.toLocaleString()}${
    currentTier.orMore ? "+" : ""
  }`;

  return (
    <div className="min-w-max space-y-6 rounded-3xl border-2 border-slate-700 bg-slate-800 p-6 text-slate-50">
      <div className="flex">
        {tiers.map((tier, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`border-b-4 px-2 py-3 text-xs font-semibold sm:px-4 sm:text-base ${
              i === tab
                ? "border-pink-500 text-slate-50"
                : "border-transparent text-slate-400 hover:border-pink-500/20"
            }`}
          >
            {tier.name}{" "}
            <span className="hidden rounded-full bg-slate-700 px-2 py-1 text-xs sm:inline">
              {tier.percent}%{tier.orMore}
            </span>
          </button>
        ))}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wide text-white/60">
          With
        </p>
        <div>
          <div className="rounded-t-lg bg-zinc-900 p-4 pb-2">
            <span className="inline-block text-3xl font-extrabold text-slate-50">
              {referrals}
            </span>{" "}
            <span className="text-sm font-semibold text-slate-400">
              referrals
            </span>
          </div>
          <Slider
            defaultValue={[referrals]}
            min={50}
            max={1000}
            step={10}
            onValueChange={(value) => setReferrals(value[0]!)}
          />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          You could earn
        </p>
        <p className="text-5xl font-extrabold">
          {fmtdEarnings}
          <span className="pl-2 text-sm font-semibold text-slate-400">
            /year
          </span>
        </p>
      </div>
      <p className="text-right text-sm text-slate-400/75">
        *Based on average ARR of ${avgAnnualTravelSpendings.toFixed(2)}/user
      </p>
    </div>
  );
}

function IntroSection() {
  return (
    <section className="relative">
      <div className="flex flex-col-reverse items-center lg:flex-row lg:space-x-10 xl:space-x-20">
        <div className="max-w-xl space-y-5 lg:space-y-10">
          <h1 className="font-semibold">TRAMONA PARTNERSHIP PROGRAM</h1>
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Earn money when your friends travel
          </h2>
          <p className="text-lg tracking-tight sm:text-2xl">
            At Tramona, we think we are only as good as our people. Because of
            that, we have created one of the most generous partnership programs.
          </p>
          <Link
            href="/auth/signup"
            className={buttonVariants({ variant: "darkPrimary", size: "lg" })}
          >
            Sign Up Now
          </Link>
        </div>
        <div className="py-10 md:py-5">
          <Image
            src={"/assets/images/partners-landing.png"}
            width={500}
            height={500}
            alt="Refer and Earn"
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}

function ProgramTiers() {
  const { status } = useSession();
  const { data } = api.users.myReferralCode.useQuery();

  return (
    <section className="w-full bg-blue-400">
      <h2 className="text-center text-4xl font-bold sm:text-5xl">
        Introducing the Tramona way
      </h2>
      <p className="text-center text-lg sm:text-2xl">
        Split profits with us off <strong>everyone</strong> that uses your
        referral code!
      </p>

      <div className="flex flex-col gap-5 lg:flex-row">
        <Card className="relative w-[400px] max-w-lg rounded-3xl border-black xl:w-[500px]">
          <div className="absolute inset-x-0 -top-0 mx-auto w-24 -translate-y-1/2 rounded-full bg-black py-1 text-center text-sm font-bold text-white sm:text-base">
            TIER 1
          </div>

          <CardContent className="flex flex-col space-y-5 lg:px-4 lg:py-2">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold md:text-3xl">Partner</h3>
              <p className="sm:text-2xl">
                Earn 30% of what we make off everyone you refer
              </p>
            </div>

            <Link
              href="/program/partner"
              className="self-center font-medium text-blue-400 underline underline-offset-2 hover:text-blue-300 lg:text-lg"
            >
              Learn More
            </Link>
          </CardContent>

          {status === "loading" && (
            <Button variant="ghost" disabled isLoading>
              Loading
            </Button>
          )}

          {status === "unauthenticated" && (
            <Link
              href="/program/partner"
              className="ml-auto rounded-lg border-2 border-zinc-950 bg-blue-300 px-10 py-2 text-lg font-semibold text-zinc-950 hover:bg-blue-200"
            >
              Apply
            </Link>
          )}

          {status === "authenticated" && (
            <CardFooter className="-mx-4 border-t-2 border-zinc-950">
              <p className="w-full text-center font-semibold lg:text-lg">
                {data?.referralCode}
              </p>
              <CopyToClipboardBtn
                message={data?.referralCode ?? ""}
                render={({ justCopied, copyMessage }) => (
                  <Button
                    variant="darkPrimary"
                    onClick={copyMessage}
                    className="w-full rounded-none py-5 lg:text-lg"
                  >
                    {justCopied ? "Copied!" : "Share Code"}
                  </Button>
                )}
              />
            </CardFooter>
          )}
        </Card>

        <Card className="relative w-[400px] max-w-lg rounded-3xl border-black xl:w-[500px]">
          <div className="absolute inset-x-0 -top-0 mx-auto w-24 -translate-y-1/2 rounded-full bg-black py-1 text-center text-sm font-bold text-white sm:text-base">
            TIER 2
          </div>

          <CardContent className="flex flex-col space-y-5 lg:px-4 lg:py-2">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold md:text-3xl">Ambassador</h3>
              <p className="sm:text-2xl">
                Earn 50% of what we make off everyone you refer
              </p>
            </div>
          </CardContent>

          <Link
            href="/program/ambassador"
            className="ml-auto rounded-lg border-2 border-zinc-950 bg-blue-300 px-10 py-2 text-lg font-semibold text-zinc-950 hover:bg-blue-200"
          >
            Apply
          </Link>
        </Card>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-fuchsia-400">
      <h2 className="text-center text-4xl font-bold sm:text-6xl">
        How it works
      </h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="relative space-y-6 rounded-3xl border-2 border-black bg-white p-6 lg:max-w-md">
          <div className="absolute right-4 top-0 text-9xl font-extrabold text-black/10">
            1
          </div>
          <h2 className="pt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Sign Up
          </h2>
          <p className="text-lg font-medium tracking-tight sm:text-xl">
            Sign up, access our partner portal, and get your{" "}
            <mark>custom affiliate link</mark>.
          </p>
        </div>
        <div className="relative space-y-6 rounded-3xl border-2 border-black bg-white p-6 lg:max-w-md">
          <div className="absolute right-4 top-0 text-9xl font-extrabold text-black/10">
            2
          </div>
          <h2 className="pt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Share
          </h2>
          <p className="text-lg font-medium tracking-tight sm:text-xl">
            <mark>Share your link</mark> with your contacts and social media
            followers.
          </p>
        </div>
        <div className="relative space-y-6 rounded-3xl border-2 border-black bg-white p-6 lg:max-w-md">
          <div className="absolute right-4 top-0 text-9xl font-extrabold text-black/10">
            3
          </div>
          <h2 className="pt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Earn
          </h2>
          <p className="text-lg font-medium tracking-tight sm:text-xl">
            <mark>Earn $$</mark> based on every persons travel you refer
          </p>
        </div>
      </div>
    </section>
  );
}

function ExploreEarnings() {
  return (
    <section className="bg-slate-900">
      <div className="grid gap-6 md:gap-10 xl:grid-cols-2 xl:gap-16">
        <div className="relative space-y-6 xl:max-w-2xl">
          <div className="absolute -top-20 sm:-top-16 lg:-top-20">
            <PinkStarIcon />
          </div>
          <h2 className="text-center text-4xl font-bold tracking-tight text-white sm:text-left sm:text-6xl">
            Explore how much you could earn
          </h2>
          <p className="text-lg tracking-tight text-zinc-400 sm:text-2xl">
            Earnings are <strong className="text-zinc-300">uncapped</strong>.
            The more people you refer, the more you earn.
          </p>
        </div>

        <div className="space-y-10">
          <ExploreEarningsCard />
          <Link
            href="/profile"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "rounded-xl lg:px-10 lg:py-6 lg:text-xl",
            })}
          >
            Start earning now
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="bg-white">
      <h2 className="text-center text-4xl font-bold sm:text-6xl">Questions?</h2>
      <div className="w-full max-w-2xl pt-16">
        <Accordion type="multiple" className="sm:text-xl">
          <AccordionItem value="0">
            <AccordionTrigger>
              Where can I post my referral code?
            </AccordionTrigger>
            <AccordionContent>
              Anywhere you want! We recommend posting it on your social media
              accounts, but you can also send it to your friends and family
              directly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="1">
            <AccordionTrigger>How are payouts made?</AccordionTrigger>
            <AccordionContent>
              We&apos;ll send you a check or a direct deposit to your bank
              account.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="2">
            <AccordionTrigger>What is the max I can earn?</AccordionTrigger>
            <AccordionContent>
              There is no limit! The more people you refer, the more you earn.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="3">
            <AccordionTrigger>
              How long do the payouts last for?
            </AccordionTrigger>
            <AccordionContent>
              You will receive payouts for as long as the person you referred
              uses Tramona.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="4">
            <AccordionTrigger>
              What if I refer someone and they dont travel?
            </AccordionTrigger>
            <AccordionContent>
              That&apos;s okay! You will still receive a payout whenever they do
              use Tramona.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="5">
            <AccordionTrigger>
              Why is the referral so generous?
            </AccordionTrigger>
            <AccordionContent>
              We believe in the power of word-of-mouth marketing. We&apos;re so
              confident you&apos;ll love our service that we&apos;re willing to
              share our profits with you.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <div className="[&>*]:flex [&>*]:min-h-[calc(100vh-4.25rem)] [&>*]:flex-col [&>*]:items-center [&>*]:justify-center [&>*]:gap-8 [&>*]:px-4 [&>*]:py-16 [&>*]:sm:px-16">
      <Head>
        <title>Partners | Tramona</title>
      </Head>

      <IntroSection />

      <ProgramTiers />

      <HowItWorks />

      <ExploreEarnings />

      <FAQ />
    </div>
  );
}
