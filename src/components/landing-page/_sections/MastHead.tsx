import landingBg from "public/assets/images/landing-bg.jpg";
import priceComparison from "public/assets/images/pricecomparison.jpg";
import { Button } from "@/components/ui/button";
import UserAvatarMastHead from "@/components/_common/UserAvatarMasthead";
import { Avatar } from "@/components/ui/avatar";
import CityRequestFormContainer from "../SearchBars/CityRequestFormContainer";
import { TestimonialCarousel } from "./testimonials/TestimonialCarousel";
import Image from "next/image";
import CompletedRequestsSection from "./CompletedRequests";
import Link from "next/link";
import { whyUseTramonaCopy } from "./why-use-tramona-copy";
import { CheckIcon } from "lucide-react";
import { scrollToTop } from "@/utils/utils";

export default function MastHead() {
  return (
    <section className="relative bg-white pb-32">
      <div className="relative sm:mb-24 sm:h-[640px] lg:mb-0">
        <div className="absolute inset-0">
          <Image
            src={landingBg}
            alt=""
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            className="select-none"
          />
        </div>
        <div className="relative grid h-full grid-cols-1 p-4 lg:grid-cols-1">
          <div className="flex flex-col justify-center">
            <div className="relative pt-10 text-center">
              <h1 className="mx-auto max-w-3xl text-balance text-3xl font-bold text-zinc-900 lg:text-5xl">
                Agree on a Price with Hosts Every Time
              </h1>
              <p className="mx-auto max-w-[38rem] pt-4 text-xs font-semibold text-zinc-900 lg:pt-4 lg:text-base">
                Traveling outside your budget, now within reach.
              </p>
              <div className="hidden items-center justify-center pt-4 lg:flex">
                <div className="-ml-2">
                  <UserAvatarMastHead
                    size={"md"}
                    image="/assets/images/fake-reviews/shawnp.jpg"
                  />
                </div>
                <div className="-ml-2">
                  <UserAvatarMastHead
                    size={"md"}
                    image="/assets/images/fake-reviews/biancar.jpg"
                  />
                </div>
                <div className="-ml-2">
                  <UserAvatarMastHead
                    size={"md"}
                    image="/assets/images/fake-reviews/lamarf.jpg"
                  />
                </div>
                <div className="-ml-2">
                  <UserAvatarMastHead
                    size={"md"}
                    image="/assets/images/fake-reviews/susanl.jpg"
                  />
                </div>
                <div className="-ml-2">
                  <Avatar
                    size={"md"}
                    className="flex items-center justify-center border-2 border-[#EBF5F4] bg-teal-900 text-xs font-semibold text-white"
                  >
                    +800
                  </Avatar>
                </div>
                <p className="ml-2 text-xs font-semibold text-[#7E7564]">
                  Properties booked this month
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:p-10">
            <div className="mt-12 flex-1 rounded-2xl border bg-white p-4 shadow-2xl lg:mt-0 lg:max-w-xl">
              <CityRequestFormContainer />
            </div>
          </div>
        </div>
      </div>

      <div className="h-24 lg:h-60"></div>

      <div className="mx-0 mt-8 flex max-w-full justify-center space-y-4 px-4 lg:mx-4 lg:mt-16 lg:flex lg:space-y-8">
        <TestimonialCarousel />
      </div>
      <div className="mx-auto my-40 w-5/6 max-w-7xl text-center text-2xl font-semibold tracking-tight lg:my-48 lg:text-4xl">
        When hosts have no one staying at their property, they would rather make
        something over nothing. With Tramona, your request goes out to every
        host with a vacancy, so you get the best deal, every time.
      </div>

      <div className="mt-20 space-y-4 lg:space-y-12">
        <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
          <span className="text-teal-900">How?</span> Negotiation, 50% less
          fees. No markups.
        </h2>
        <div className="flex justify-center">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-32">
            <div>
              <div className="hidden lg:block">
                <Image
                  src={priceComparison}
                  alt=""
                  height={250}
                  placeholder="blur"
                  className="select-none"
                />
              </div>
              <div className="lg:hidden">
                <Image
                  src={priceComparison}
                  alt=""
                  width={350}
                  placeholder="blur"
                  className="select-none"
                />
              </div>
              <div className="mt-2 text-center text-sm font-extrabold text-[#FF0000] lg:text-lg">
                Airbnb
              </div>
              <div className="text-center text-xl font-extrabold text-[#FF0000] lg:text-2xl">
                $300/night
              </div>
            </div>
            <div>
              <div className="hidden lg:block">
                <Image
                  src={priceComparison}
                  alt=""
                  height={250}
                  placeholder="blur"
                  className="select-none"
                />
              </div>
              <div className="lg:hidden">
                <Image
                  src={priceComparison}
                  alt=""
                  width={350}
                  placeholder="blur"
                  className="select-none"
                />
              </div>
              <div className="mt-2 text-center text-sm font-extrabold text-teal-900 lg:text-lg">
                Tramona
              </div>
              <div className="text-center text-xl font-extrabold text-teal-900 lg:text-2xl">
                $250/night
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="mt-20 p-4 lg:grid lg:grid-cols-2 xl:gap-24">
          <div className="flex flex-col space-y-1 pb-6 text-left lg:mr-24 lg:flex lg:flex-col lg:justify-center lg:space-y-4">
            <h2 className="text-2xl font-extrabold lg:text-4xl">
              See completed requests
            </h2>
            <div className="text-sm font-semibold text-muted-foreground">
              Check out our feed to see recent deals
            </div>
            <div className="hidden lg:block">
              <Button asChild variant="greenPrimary">
                <Link href="/exclusive-offers">View deals</Link>
              </Button>
            </div>
          </div>
          <CompletedRequestsSection />
          <div className="flex justify-center pt-8 lg:hidden">
            <Button asChild variant="greenPrimary" size="lg">
              <Link href="/exclusive-offers">View deals</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl justify-center space-y-4 p-4 lg:mt-28 lg:space-y-8">
        <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
          Why use Tramona?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyUseTramonaCopy.map(({ icon: Icon, title, bullets }) => (
            <div key={title} className="rounded-2xl border p-4">
              <div className="inline-block rounded-lg bg-primaryGreen-background p-2 text-primaryGreen">
                <Icon />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <div className="space-y-2 pt-4">
                {bullets.map((bullet) => (
                  <div key={bullet} className="flex gap-2 text-sm">
                    <CheckIcon className="size-4 shrink-0 text-zinc-400" />
                    <p className="text-zinc-600">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 pt-32 md:grid-cols-2">
        <div className="flex flex-1 flex-col items-center rounded-2xl bg-zinc-100 p-6 text-center">
          <div className="flex-1">
            <h3 className="mb-4 text-3xl font-bold">Looking for a place?</h3>
            <p className="mb-6 text-sm text-zinc-600">
              Tramona keeps guests safe by not only verifying them on Tramona,
              but also making sure they are verified on Airbnb as well.
            </p>
          </div>
          <div className="mb-2 text-4xl font-bold text-teal-900">300,000+</div>
          <p className="mb-6 text-sm text-zinc-600">
            properties your matches will be coming from
          </p>
          <Button
            onClick={scrollToTop}
            variant="greenPrimary"
            size="lg"
            className="rounded-full"
          >
            Submit a request
          </Button>
        </div>

        <div className="flex flex-1 flex-col items-center rounded-2xl bg-zinc-100 p-6 text-center">
          <div className="flex-1">
            <h3 className="mb-4 text-3xl font-bold">Listing your place?</h3>
            <p className="mb-6 text-sm text-zinc-600">
              It&apos;s as easy as making an account and signing up as a host.
              We have API access from the biggest PMS&apos;s, or you can upload
              manually. Once on, wait for requests to roll in.
            </p>
          </div>
          <div className="mb-2 text-4xl font-bold text-teal-900">15%</div>
          <p className="mb-6 text-sm text-zinc-600">
            increase in occupancy when using Tramona
          </p>
          <Button
            asChild
            variant="greenPrimary"
            size="lg"
            className="rounded-full"
          >
            <Link href="/for-hosts">List my place</Link>
          </Button>
        </div>

        <div className="col-span-full flex flex-col items-center gap-2 rounded-2xl bg-zinc-100 p-6">
          <h2 className="text-center text-3xl font-bold">New To Tramona?</h2>
          <div className="text-sm font-medium text-zinc-600">
            Check out our FAQ for any questions, or send us a message directly
          </div>
          <Button
            asChild
            variant="greenPrimary"
            size="lg"
            className="mt-4 w-40 rounded-full"
          >
            <Link href="/faq">FAQ</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
