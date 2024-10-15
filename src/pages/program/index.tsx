import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import CopyToClipboardBtn from "@/components/_utils/CopyToClipboardBtn";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import * as SliderPrimitive from "@radix-ui/react-slider";

import MainLayout from "@/components/_common/Layout/MainLayout";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import HowItWorks from "@/components/_common/HowItWorks";

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

function IntroSection() {
  return (
    <div className="[&>*]:flex [&>*]:min-h-[calc(100vh-4.25rem)] [&>*]:flex-col [&>*]:items-center [&>*]:justify-center [&>*]:gap-8 [&>*]:px-4 [&>*]:py-16 [&>*]:sm:px-16">
      <section className="relative bg-white">
        <div className="flex flex-col-reverse items-center lg:flex-row lg:space-x-10 xl:space-x-20">
          <div className="max-w-xl space-y-5 lg:space-y-10">
            <h1 className="font-semibold">TRAMONA PARTNERSHIP PROGRAM</h1>
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Earn money when your friends travel
            </h2>
            <p className="text-lg tracking-tight sm:text-2xl">
              At Tramona, we think we are only as good as our people. Because of
              that, we have created one of the most generous partnership
              programs.
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
              alt=""
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgramTiers() {
  const { status } = useSession();
  const { data } = api.users.myReferralCode.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  return (
    <div className="[&>*]:flex [&>*]:min-h-[calc(50vh-4.25rem)] [&>*]:flex-col [&>*]:items-center [&>*]:justify-center [&>*]:gap-8 [&>*]:px-4 [&>*]:py-16 [&>*]:sm:px-16">
      <section className="w-full bg-white">
        <h2 className="text-center text-4xl font-bold sm:text-5xl">
          Introducing the Tramona way
        </h2>
        <p className="text-center text-lg sm:text-2xl">
          Split profits with us off <strong>everyone</strong> that uses your
          referral code!
        </p>

        <div className="flex flex-col items-center gap-5 lg:flex-row">
          <Card className="relative w-[345px] max-w-lg rounded-3xl border-black sm:w-[400px] xl:w-[500px]">
            <div className="absolute inset-x-0 -top-0 mx-auto w-24 -translate-y-1/2 rounded-full bg-black py-1 text-center text-sm font-bold text-white sm:text-base">
              TIER 1
            </div>

            <CardContent className="flex flex-col space-y-5 lg:px-4 lg:py-2">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold md:text-3xl">Partner</h3>
                <p className="sm:text-2xl">
                  Earn $25 cash for each user&apos;s first booking!
                </p>
              </div>

              {/* <Link
              href="/program/partner"
              className="self-center font-medium text-blue-400 underline underline-offset-2 hover:text-blue-300 lg:text-lg"
            >
              Learn More
            </Link> */}
            </CardContent>

            {status === "loading" && (
              <Button variant="ghost" disabled isLoading>
                Loading
              </Button>
            )}

            {status === "unauthenticated" && (
              <Link
                href="/program/partner"
                className="ml-auto rounded-lg border-2 border-zinc-950 bg-neutral-900 px-10 py-2 text-lg font-semibold text-white hover:bg-neutral-800"
              >
                Learn More
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

          <Card className="relative w-[345px] max-w-lg rounded-3xl border-black sm:w-[400px] xl:w-[500px]">
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
              className="ml-auto rounded-lg border-2 border-zinc-950 bg-neutral-900 px-10 py-2 text-lg font-semibold text-white hover:bg-neutral-800"
            >
              Apply
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}

// function HowItWorks() {
//   return (
//     <div className="[&>*]:flex [&>*]:min-h-[calc(50vh-4.25rem)] [&>*]:flex-col [&>*]:items-center [&>*]:justify-center [&>*]:gap-8 [&>*]:px-4 [&>*]:py-16 [&>*]:sm:px-16">
//       <section className="bg-neutral-900">
//         <h2 className="text-center text-4xl font-bold text-white sm:text-6xl">
//           How it works
//         </h2>
//         <div className="grid gap-4 lg:grid-cols-3">
//           <div className="relative space-y-6 rounded-3xl border-2 border-black bg-white p-6 lg:max-w-md">
//             <div className="absolute right-4 top-0 text-9xl font-extrabold text-black/10">
//               1
//             </div>
//             <h2 className="pt-6 text-2xl font-bold tracking-tight sm:text-3xl">
//               Sign Up
//             </h2>
//             <p className="text-lg font-medium tracking-tight sm:text-xl">
//               Sign up, access our partner portal, and get your{" "}
//               <mark>custom affiliate link</mark>.
//             </p>
//           </div>
//           <div className="relative space-y-6 rounded-3xl border-2 border-black bg-white p-6 lg:max-w-md">
//             <div className="absolute right-4 top-0 text-9xl font-extrabold text-black/10">
//               2
//             </div>
//             <h2 className="pt-6 text-2xl font-bold tracking-tight sm:text-3xl">
//               Share
//             </h2>
//             <p className="text-lg font-medium tracking-tight sm:text-xl">
//               <mark>Share your link</mark> with your contacts and social media
//               followers.
//             </p>
//           </div>
//           <div className="relative space-y-6 rounded-3xl border-2 border-black bg-white p-6 lg:max-w-md">
//             <div className="absolute right-4 top-0 text-9xl font-extrabold text-black/10">
//               3
//             </div>
//             <h2 className="pt-6 text-2xl font-bold tracking-tight sm:text-3xl">
//               Earn
//             </h2>
//             <p className="text-lg font-medium tracking-tight sm:text-xl">
//               <mark>Earn</mark> based on every persons travel you refer
//             </p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

function FAQ() {
  return (
    <div className="[&>*]:flex [&>*]:min-h-[calc(100vh-4.25rem)] [&>*]:flex-col [&>*]:items-center [&>*]:justify-center [&>*]:gap-8 [&>*]:px-4 [&>*]:py-16 [&>*]:sm:px-16">
      <section className="bg-white">
        <h2 className="text-center text-4xl font-bold sm:text-6xl">
          Questions?
        </h2>
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
                You can use the cash for future trips, or we&apos;ll deposit it
                directly into your bank account.
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
                You are eligible for payouts for individuals you refer, provided
                they take a trip within one year from the date of your referral.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="4">
              <AccordionTrigger>
                What if I refer someone and they dont travel?
              </AccordionTrigger>
              <AccordionContent>
                That&apos;s alright! You will still receive a payout whenever
                they use Tramona, as long as they travel within one year from
                the date you referred them.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="5">
              <AccordionTrigger>
                Why is the referral so generous?
              </AccordionTrigger>
              <AccordionContent>
                We believe in the power of word-of-mouth marketing. We&apos;re
                so confident you&apos;ll love our service that we&apos;re
                willing to share our profits with you.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  const partnershipSteps = [
    {
      number: "1",
      title: "Sign Up",
      description:
        "Sign up, access our partner portal, and get your custom affiliate link.",
    },
    {
      number: "2",
      title: "Share",
      description:
        "Share your link with your contacts and social media followers.",
    },
    {
      number: "3",
      title: "Earn",
      description: "Earn based on every person's travel you refer.",
    },
  ];
  return (
    <MainLayout>
      <div className="relative bg-white">
        <Head>
          <title>Partners | Tramona</title>
        </Head>
        <div className="">
          <IntroSection />
        </div>
        <hr className="mx-24 mb-24 h-px border-0 bg-neutral-300"></hr>
        <div className="">
          <ProgramTiers />
        </div>

        <div className="">
          <HowItWorks
            title="How Tramona Partnership Works?"
            steps={partnershipSteps}
          />
        </div>
        <div className="">
          <FAQ />
        </div>
      </div>
    </MainLayout>
  );
}
