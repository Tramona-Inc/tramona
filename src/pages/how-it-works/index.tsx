import Head from "next/head";
import ForHosts from "@/components/landing-page/_sections/ForHosts";
import ReferAndEarn from "@/components/landing-page/_sections/ReferAndEarn";
import SocialFeed from "@/components/landing-page/_sections/SocialFeed";
import FAQ from "@/components/landing-page/_sections/FAQ";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Image from "next/image";
import {
  FaChartBar,
  FaClock,
  FaLayerGroup,
  FaShieldAlt,
  FaExchangeAlt,
  FaCheckCircle,
  FaLock,
  FaLink,
  FaPaperPlane,
  FaShoppingBag,
} from "react-icons/fa";
import { useIsSm } from "@/utils/utils";
import { MobileTestimonialCarousel } from "@/components/landing-page/_sections/testimonials/MobileTestimonialCarousel";
import { TestimonialCarousel } from "@/components/landing-page/_sections/testimonials/TestimonialCarousel";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="relative overflow-x-hidden bg-white">
        <Head>
          <title>How It Works | Tramona</title>
        </Head>
        <div className="mb-12 space-y-12 md:mb-20 md:space-y-20">
          <section className="relative">
            <div className="relative h-[40vh] w-full">
              <Image
                src="/assets/images/why-list/host-banner.png"
                alt="beach banner"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="absolute inset-0 bg-black opacity-50"></span>
            <div className="absolute inset-0 flex items-center px-6">
              <div className="relative z-10 text-left text-white max-w-4xl">
                <h2 className="text-sm font-medium uppercase tracking-wide md:text-lg">
                  HOW IT WORKS
                </h2>
                <h3 className="mt-2 text-xl font-bold leading-snug md:text-3xl lg:text-4xl">
                  Tramona connects travelers with unbeatable deals and hosts with more bookings
                </h3>
                <p className="mt-4 text-sm md:text-base lg:text-lg">
                  See what hosts will offer you
                </p>
              </div>
            </div>
          </section>

          <div className="mx-12 my-8 space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col items-center text-center">
                <FaShoppingBag className="text-4xl text-[#004236] mb-4" />
                <h3 className="text-lg font-bold">Book it now</h3>
                <p className="text-sm text-muted-foreground max-w-lg">
                  Classic booking process you're familiar with. Instant confirmation for
                  available properties. Less fees and 24/7 support with 100% rebooking
                  guarantee if something goes wrong.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaLock className="text-4xl text-[#004236] mb-4" />
                <h3 className="text-lg font-bold">Place a bid</h3>
                <p className="text-sm text-muted-foreground max-w-lg">
                  Bid on specific properties you like. Set your price and wait for host
                  acceptance. Multiple bids allowed - when one&apos;s accepted, others
                  cancel automatically. Instant charging upon acceptance.
                </p>
                <p className="mt-2 text-xs text-muted-foreground max-w-lg">
                  Submit multiple bids to explore various host offers and secure the best deal.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaPaperPlane className="text-4xl text-[#004236] mb-4" />
                <h3 className="text-lg font-bold">Make a request</h3>
                <p className="text-sm text-muted-foreground max-w-lg">
                  Send your budget to all hosts with vacancies. Receive tailored offers
                  from hosts. Compare multiple offers and choose the best fit. Perfect for
                  flexible travelers seeking the best deals.
                </p>
                <p className="mt-2 text-xs text-muted-foreground max-w-lg">
                  Submit multiple requests to receive diverse, tailored pricing options from hosts.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaLink className="text-4xl text-[#004236] mb-4" />
                <h3 className="text-lg font-bold">Link insert</h3>
                <p className="text-sm text-muted-foreground max-w-lg">
                  Have a specific property in mind? Submit the link and let your request
                  reach that property and similar ones nearby. All local hosts can make
                  offers, expanding your options.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-12 py-6">
            <p className="text-center text-2xl font-semibold text-[#004236] lg:text-3xl">
              When hosts have empty nights, no one wins. Tramona makes
              the rental market more efficient.
            </p>
            <p className="text-center text-base font-medium mt-4">
              <span className="text-[#004236]">Lowest fees compared to </span>
              <span className="text-red-500">other major </span>
              <span className="text-blue-500">marketplaces</span>
            </p>
          </div>

          <div className="flex flex-col items-center justify-center md:flex-row md:gap-6 px-12 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[#004236]">
                Hosts, Learn More About How Tramona Works for You
              </h2>
              <a href="/for-hosts">
                <button className="mt-4 px-6 py-2 rounded-full bg-[#004236] text-white font-medium text-sm hover:bg-[#003622]">
                  For Hosts
                </button>
              </a>
            </div>
            <div className="w-full max-w-xs">
              <img
                src="/assets/images/landing-page/how_it_works_exterior.png"
                alt="Hosts in front of their house"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="mx-12 my-8 space-y-6">
            <h2 className="text-center text-2xl font-bold text-[#004236]">
              Unique, exclusive prices that can’t be found on other platforms
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <FaChartBar className="text-4xl text-[#004236] mb-4" />
                <h3 className="text-lg font-bold">24/7 Support</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Access to assistance at any time of the day or night. Immediate help
                  with booking issues, questions, and unexpected situations. Support is
                  just a message away.
                </p>
                <p className="mt-2 text-sm font-medium text-[#004236] cursor-pointer">
                  Learn More ++++
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaClock className="text-4xl text-[#004236] mb-4" />
                <h3 className="text-lg font-bold">Rebooking Guarantee</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  If your booking falls through, we'll help you find a new place fast. No
                  extra cost for rebooking assistance in case of cancellations. Reliable
                  backup options to keep your travel plans on track.
                </p>
                <p className="mt-2 text-sm font-medium text-[#004236] cursor-pointer">
                  Learn More ++++
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaLayerGroup className="text-4xl text-[#004236] mb-4" />
                <h3 className="text-lg font-bold">Best Prices on Airbnbs Anywhere</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Find unbeatable prices for Airbnbs on Tramona. Access exclusive deals
                  and discounts not available on other platforms. Save money on every
                  booking without sacrificing quality.
                </p>
                <p className="mt-2 text-sm font-medium text-[#004236] cursor-pointer">
                  Learn More ++++
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaShieldAlt className="text-4xl text-[#004236] mb-4" />
                <h3 className="text-lg font-bold">Same Features You Are Used To</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Similar features to other major platforms, making it easy to use. All
                  the essentials like messaging, secure payments, and verified hosts.
                  Flexible cancellation policies.
                </p>
                <p className="mt-2 text-sm font-medium text-[#004236] cursor-pointer">
                  Learn More ++++
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaExchangeAlt className="text-4xl text-[#004236] mb-4" />
                <h3 className="text-lg font-bold">Flexible Booking Options</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Choose how you want to get the best deals. Customize your booking
                  experience to match your budget. More flexibility means more savings
                  and choices.
                </p>
                <p className="mt-2 text-sm font-medium text-[#004236] cursor-pointer">
                  Learn More ++++
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaCheckCircle className="text-4xl text-[#004236] mb-4" />
                <h3 className="text-lg font-bold">No BS</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  No hidden fees or surprises. Transparent pricing and policies from start
                  to finish. A straightforward platform focused on allowing you to travel
                  more.
                </p>
                <p className="mt-2 text-sm font-medium text-[#004236] cursor-pointer">
                  Learn More ++++
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center px-12 py-8 space-y-6 md:space-y-0 md:space-x-8">
            <div className="text-center md:text-left max-w-lg">
              <p className="text-xl font-semibold text-[#004236]">
                Tramona is the only platform where hosts can turn empty nights into bookings by connecting with travelers looking for deals. That’s why Tramona consistently offers the best prices on the market.
              </p>
            </div>

            <div className="w-full max-w-md">
              <img
                src="/assets/images/landing-page/how_it_works_interior.png"
                alt="Interior of a cozy house"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="mx-0 flex max-w-full justify-center space-y-4 px-4 lg:mx-4 lg:mt-16 lg:flex lg:space-y-8">
            {useIsSm() ? <MobileTestimonialCarousel /> : <TestimonialCarousel />}
          </div>

          <div className="mx-12 my-8 space-y-6">
            <h2 className="text-center text-2xl font-bold text-[#004236]">
              Booking on Tramona vs <span className="text-red-500">other</span> <span className="text-blue-500">platforms</span>
            </h2>

            <p className="text-center text-sm text-muted-foreground">
              We've created a comparison chart to showcase the savings our travelers experience on Tramona compared to Airbnb.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full max-w-5xl mx-auto border-collapse text-left text-sm">
                <thead className="bg-[#F6F6F6]">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-[#004236]">Location</th>
                    <th className="py-3 px-4 font-semibold text-[#004236]">Airbnb Price</th>
                    <th className="py-3 px-4 font-semibold text-[#004236]">Tramona Price</th>
                    <th className="py-3 px-4 font-semibold text-[#004236]">Your Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">Miami</td>
                    <td className="py-3 px-4">$150/night</td>
                    <td className="py-3 px-4 text-green-500">↓ $120/night</td>
                    <td className="py-3 px-4 text-green-500">$30/night (20% off)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Austin</td>
                    <td className="py-3 px-4">$200/night</td>
                    <td className="py-3 px-4 text-green-500">↓ $160/night</td>
                    <td className="py-3 px-4 text-green-500">$40/night (20% off)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">NYC</td>
                    <td className="py-3 px-4">$250/night</td>
                    <td className="py-3 px-4 text-green-500">↓ $200/night</td>
                    <td className="py-3 px-4 text-green-500">$50/night (20% off)</td>
                  </tr>
                </tbody>
              </table>
            </div>

          <div className="mt-4 text-center bg-green-100 p-4 rounded-lg max-w-5xl mx-auto">
            <p className="text-sm text-green-700">
              Tramona gives travelers access to deals they won’t find elsewhere, making it the perfect platform for finding affordable stays and for hosts to fill those empty nights effortlessly.
            </p>
          </div>
        </div>


          <div className="flex flex-col md:flex-row items-center justify-center px-12 py-8 space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-full max-w-md">
              <img
                src="/assets/images/landing-page/try_before_you_book.png"
                alt="Cozy house with people sitting"
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="text-center md:text-left max-w-lg">
              <h2 className="text-2xl font-bold text-[#004236] mb-4">
                Try it before you book
              </h2>
              <p className="text-base text-[#004236] leading-relaxed">
                Already committed to traveling? Submit a request or place bids to get the
                best prices on the market. Each deal you get will be a one-of-a-kind deal.
              </p>
            </div>
          </div>

          <FAQ />
          <div className="mt-6 flex justify-center md:justify-end md:pr-[33%]">
            <a
              href="/faq"
              className="inline-block rounded-full bg-primaryGreen px-6 py-3 text-white text-sm font-medium hover:bg-primaryGreen-dark"
            >
              View FAQ
            </a>
          </div>

          <div className="bg-primaryGreen py-8">
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold">Start your journey with Tramona now</h2>
              <div className="mt-6 flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-y-0 md:space-x-6">
                <a
                  href="/name-your-own-price"
                  className="inline-block rounded-full bg-white px-6 py-3 text-primaryGreen text-sm font-medium hover:bg-gray-100"
                >
                  Name Your Own Price
                </a>
                <a
                  href="/book-it-now"
                  className="inline-block rounded-full bg-white px-6 py-3 text-primaryGreen text-sm font-medium hover:bg-gray-100"
                >
                  Book it Now
                </a>
                <a
                  href="/become-a-host"
                  className="inline-block rounded-full bg-white px-6 py-3 text-primaryGreen text-sm font-medium hover:bg-gray-100"
                >
                  Become a host
                </a>
              </div>
            </div>
          </div>

          <hr className="border-none" />
        </div>
      </div>
    </DashboardLayout>
  );
}
