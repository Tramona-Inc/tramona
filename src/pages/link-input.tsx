import linkInputBg from "public/assets/images/link-input-bg.jpg";
import priceComparison from "public/assets/images/pricecomparison.jpg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Clock8, Handshake, CircleDollarSign } from "lucide-react";
import { TestimonialCarousel } from "@/components/landing-page/_sections/testimonials/TestimonialCarousel";
import LinkRequestForm from "../components/link-input/LinkRequestForm";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";

export default function Page() {
  return (
    <DashboardLayout>
      <section className="relative bg-white pb-4">
        <div className="relative h-[500px] lg:h-[511px]">
          <div className="absolute inset-0">
            <Image
              src={linkInputBg}
              alt=""
              fill
              objectFit="cover"
              placeholder="blur"
              className="select-none"
            />
          </div>

          <div className="relative grid h-full grid-cols-1 p-4 lg:grid-cols-1">
            <div className="-mt-56 flex flex-col justify-center lg:-mt-36">
              <div className="relative pt-10 text-center">
                <h1 className="mx-auto max-w-3xl text-balance text-[32px] font-bold text-gray-900 lg:text-5xl">
                  Already have a property you like?
                </h1>
                <p className="mx-auto max-w-[38rem] pt-4 text-[14px] font-bold opacity-70 lg:pt-4 lg:text-base">
                  Let us get you the same property, or their next door neighbor,
                  for a better price
                </p>
                <div className="mx-auto mt-8 max-w-3xl">
                  <LinkRequestForm />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* gap */}
        <div className="h-10 lg:h-12"></div>

        {/* the "how to" */}
        <div className="flex max-w-full items-center justify-center">
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-4 lg:px-2">
            <div className="flex max-w-[22rem] flex-row items-center space-x-3 rounded-lg border-2 bg-white p-4">
              <div className="rounded-lg border-2 border-[#004236] p-2">
                <Clock8 className="h-6 w-6 text-[#004236]" />
              </div>
              <p className="text-start text-[20px] font-semibold">
                Enter a link of a rental you want
              </p>
            </div>
            <div className="flex max-w-[22rem] flex-row items-center space-x-3 rounded-lg border-2 bg-white p-4">
              <div className="rounded-lg border-2 border-[#004236] p-2">
                <Handshake className="h-6 w-6 text-[#004236]" />
              </div>
              <p className="text-start text-xl font-semibold">
                We&apos;ll get it without the Airbnb fees
              </p>
            </div>
            <div className="flex max-w-[22rem] flex-row items-center space-x-3 rounded-lg border-2 bg-white p-4">
              <div className="rounded-lg border-2 border-[#004236] p-2">
                <CircleDollarSign className="h-6 w-6 text-[#004236]" />
              </div>
              <p className="text-start text-xl font-semibold">
                Hosts in the area will also get a chance to send you matches
              </p>
            </div>
          </div>
        </div>

        {/* airbnb vs tramona price comparison */}
        <div className="mt-20 space-y-4 lg:mt-24 lg:space-y-12">
          <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
            <span className="text-teal-900">How?</span> Negotiation, No fees. No
            markups.
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

        <div className="mx-4 mt-28 flex flex-col items-center justify-center space-y-4">
          <p className="text-center text-2xl font-bold">
            We work with hundreds of thousands of your favorite hosts. Insert
            the link to your dream stay.
          </p>
          <Button
            type="submit"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            size="xl"
          >
            Enter Link
          </Button>
        </div>

        <h2 className="mt-28 text-center text-[40px] font-bold lg:text-4xl">
          What people are saying
        </h2>
        <div className="mx-4 mt-20 flex justify-center space-y-4 lg:mx-0 lg:mt-16 lg:space-y-8">
          <TestimonialCarousel />
        </div>
      </section>

      <div className="mt-32 bg-teal-700/15 px-4 py-8 lg:rounded-xl">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
          <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
            Have more questions?
          </h2>
          <div className="font-medium">
            Check out our FAQ for any questions, or send us a message directly
          </div>
          <Button asChild size="lg" className="w-40 rounded-full">
            <Link href="/faq">FAQ</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
