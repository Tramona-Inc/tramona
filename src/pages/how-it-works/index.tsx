import Head from "next/head";
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
import { howItWorksTestimonals } from "@/components/landing-page/_sections/testimonials/testimonials-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AccordionFaq from "@/components/_common/AccordionFaq";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="relative overflow-x-hidden bg-white">
        <Head>
          <title>How It Works | Tramona</title>
        </Head>
        <div className="mb-12 space-y-12 md:mb-20 md:space-y-20">
          <section className="relative -mb-1">
            <div className="relative h-[30vh] w-full">
              <Image
                src="/assets/images/why-list/host-banner.png"
                alt="How It Works Banner"
                fill
                objectFit="cover"
                objectPosition="center"
                priority
              />
            </div>
            <span className="absolute inset-0 bg-black opacity-50"></span>
            <div className="absolute top-6 left-0 right-0 px-6 md:px-12">
              <div className="relative z-10 max-w-4xl text-left text-white">
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
          <h1 className="mb-12 mt-12 text-center text-2xl font-semibold">
              Sign up now to start booking your empty nights
          </h1>
          <div className="w-full bg-[#FAF9F6] py-8">
            <div className="mx-auto max-w-screen-xl space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col items-center text-center">
                  <FaShoppingBag className="mb-4 text-4xl text-[#004236]" />
                  <h3 className="text-lg font-bold">Book it now</h3>
                  <p className="max-w-lg text-sm text-muted-foreground">
                    Classic booking process you&apos;re familiar with. Search for a property and book it just like you would anywhere else. Low fees and 24/7
                    support with 100% rebooking guarantee if something goes
                    wrong.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <FaLock className="mb-4 text-4xl text-[#004236]" />
                  <h3 className="text-lg font-bold">Place a bid</h3>
                  <p className="max-w-lg text-sm text-muted-foreground">
                    See a property you like with a vacancy? Place a bid and see if the hosts accept.
                    When hosts have empty nights, no one wins. When a bid is
                    accepted, all outstanding bids are automatically cancelled. Once the bid is accepted, your card will instantly be charged.
                  </p>
                  <p className="mt-2 max-w-lg text-xs text-muted-foreground">
                    Submit multiple bids to explore various host offers and
                    secure the best deal.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <FaPaperPlane className="mb-4 text-4xl text-[#004236]" />
                  <h3 className="text-lg font-bold">Make a request</h3>
                  <p className="max-w-lg text-sm text-muted-foreground">
                    Name your own price and send it to all hosts with vacancies. Receive
                    exclusive, one- of-a kind offers from hosts. Compare multiple offers and
                    choose the best fit. Perfect for flexible travelers seeking
                    the best deals.
                  </p>
                  <p className="mt-2 max-w-lg text-xs text-muted-foreground">
                    Submit multiple requests to receive diverse, tailored
                    pricing options from hosts.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <FaLink className="mb-4 text-4xl text-[#004236]" />
                  <h3 className="text-lg font-bold">Link insert</h3>
                  <p className="max-w-lg text-sm text-muted-foreground">
                    Have a specific property in mind? Submit the link and let
                    your request reach that property and similar ones nearby.
                    All local hosts can make offers, expanding your options.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <button
                    onClick={() => {
                      window.location.href = "/why-list";
                    }}
                    className="rounded-lg bg-[#004236] px-6 py-3 text-lg font-bold text-white hover:bg-[#003228] transition-colors"
                  >
                    Host? Learn how hosting works
                  </button>
                  <p className="max-w-lg text-sm text-muted-foreground">
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-12 py-6">
            <p className="text-center text-2xl font-semibold lg:text-3xl">
              When nights are empty, no one wins. Tramona makes the
              rental market more efficient.
            </p>
            <p className="mt-4 text-center text-base">
              <span className="font-normal">
                Try it before you book anywhere else, see what deals you can get.
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-[#FAF9F6] px-12 py-8">
            <h2 className="mb-8 text-center text-2xl font-semibold">
              How it works for hosts
            </h2>

            <div className="w-full max-w-4xl space-y-6">
              <div className="flex items-center rounded-lg bg-white p-6 shadow-sm">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#004236] font-bold text-white">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#004236]">
                    Link your Tramona and Airbnb account
                  </h3>
                  <p className="text-sm text-gray-600">
                    Instantly sync with Airbnb for a hassle-free setup. Keep your calendar, pricing, and availability up to date automatically. Say goodbye to double bookings.
                  </p>
                </div>
              </div>

              <div className="flex items-center rounded-lg bg-white p-6 shadow-sm">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#004236] font-bold text-white">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#004236]">
                    Set your preferences
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customize your pricing strategy, set rates based on vacancies, and choose between automated or manual control of your bookings.
                  </p>
                </div>
              </div>

              <div className="flex items-center rounded-lg bg-white p-6 shadow-sm">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#004236] font-bold text-white">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#004236]">
                    Get bookings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tramona was built to increase your bookings. Accept, deny or counter requests, and choose to accept or deny bids. Hosts always have full control.                  </p>
                </div>
              </div>

              <div className="mb-6 flex items-center rounded-lg bg-white p-6 shadow-sm">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#004236] font-bold text-white">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#004236]">
                    Enjoy the benefits
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enjoy and utilize all the benefits of hosting on Tramona. We take care of taxes the same way Airbnb does, you can add a co host, give exclusive disconts while keeping your property full price else where, etc.
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-12"></div>
            <Link href="/why-list">
              <Button size="lg" className="bg-primaryGreen text-white" onClick={() => window.location.href = "/demo"}>
                View the host side demo
              </Button>
            </Link>
          </div>
          <div className="mx-12 space-y-6">
            <h2 className="text-center text-2xl font-semibold">
              Unique, exclusive prices that can’t be found on other platforms
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <FaChartBar className="mb-4 text-4xl text-[#004236]" />
                <h3 className="text-lg font-bold">24/7 Support</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Access to assistance at any time of the day or night.
                  Immediate help with booking issues, questions, and unexpected
                  situations. Support is just a message away.
                </p>
                <p className="mt-2 cursor-pointer text-sm font-medium text-[#004236]">
                  <Link href="/help-center">Learn More ++++</Link>
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaClock className="mb-4 text-4xl text-[#004236]" />
                <h3 className="text-lg font-bold">Rebooking Guarantee</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  If your booking falls through, we&apos;ll help you find a new
                  place fast. No extra cost for rebooking assistance in case of
                  cancellations. Reliable backup options to keep your travel
                  plans on track.
                </p>
                <p className="mt-2 cursor-pointer text-sm font-medium text-[#004236]">
                  <Link href="/rebooking-guarantee">Learn More ++++</Link>
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaLayerGroup className="mb-4 text-4xl text-[#004236]" />
                <h3 className="text-lg font-bold">
                  Best Prices on Airbnbs Anywhere
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Find unbeatable prices for Airbnbs on Tramona. Access
                  exclusive deals and discounts not available on other
                  platforms. Save money on every booking without sacrificing
                  quality.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaShieldAlt className="mb-4 text-4xl text-[#004236]" />
                <h3 className="text-lg font-bold">
                  Same Features You Are Used To
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Similar features to other major platforms, making it easy to
                  use. All the essentials like messaging, secure payments, and
                  verified hosts. Flexible cancellation policies.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaExchangeAlt className="mb-4 text-4xl text-[#004236]" />
                <h3 className="text-lg font-bold">Flexible Booking Options</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Choose how you want to get the best deals. Customize your
                  booking experience to match your budget. More flexibility
                  means more savings and choices.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <FaCheckCircle className="mb-4 text-4xl text-[#004236]" />
                <h3 className="text-lg font-bold">No BS</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  No hidden fees or surprises. Transparent pricing and policies
                  from start to finish. A straightforward platform focused on
                  allowing you to travel more.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-6 bg-[#FAF9F6] px-12 py-8">
            <div className="flex flex-col items-center justify-center space-y-6 md:flex-row md:space-x-8 md:space-y-0">
              <div className="max-w-lg text-center md:text-left">
                <p className="text-xl font-semibold text-[#004236]">
                  Tramona allows is the only platform with the goal for people to travel more, and hosts to make more money. We work for you.
                </p>
              </div>

              <div className="w-full max-w-md">
                <Image
                  src="/assets/images/landing-page/how_it_works_interior.png"
                  alt="Interior of a cozy house"
                  className="rounded-lg object-cover shadow-md"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>

          <div className="mx-0 flex max-w-full justify-center space-y-4 px-4 lg:mx-4 lg:mt-16 lg:flex lg:space-y-8">
            {useIsSm() ? (
              <MobileTestimonialCarousel testimonials={howItWorksTestimonals}/>
            ) : (
              <TestimonialCarousel testimonials={howItWorksTestimonals}/>
            )}
          </div>

          <div className="flex flex-col items-center justify-center bg-[#FAF9F6] px-12 py-8">
            <h2 className="mb-4 text-center text-2xl font-semibold">
              Booking on Tramona vs other platforms
            </h2>

            <p className="mb-4 text-center text-sm text-muted-foreground">
              We&apos;ve created a comparison chart to showcase the savings our
              travelers experience on Tramona compared to Airbnb.
            </p>

            <div className="overflow-x-auto">
              <table className="mx-auto w-full max-w-5xl border-collapse text-left text-sm">
                <thead className="bg-[#F6F6F6]">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-[#004236]">
                      Location
                    </th>
                    <th className="px-4 py-3 font-semibold text-[#004236]">
                      Airbnb Price
                    </th>
                    <th className="px-4 py-3 font-semibold text-[#004236]">
                      Tramona Price
                    </th>
                    <th className="px-4 py-3 font-semibold text-[#004236]">
                      Your Savings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3">Miami</td>
                    <td className="px-4 py-3">$150/night</td>
                    <td className="px-4 py-3 text-green-500">↓ $120/night</td>
                    <td className="px-4 py-3 text-green-500">
                      $30/night (20% off)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3">Austin</td>
                    <td className="px-4 py-3">$200/night</td>
                    <td className="px-4 py-3 text-green-500">↓ $160/night</td>
                    <td className="px-4 py-3 text-green-500">
                      $40/night (20% off)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">NYC</td>
                    <td className="px-4 py-3">$250/night</td>
                    <td className="px-4 py-3 text-green-500">↓ $200/night</td>
                    <td className="px-4 py-3 text-green-500">
                      $50/night (20% off)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mx-auto mt-4 max-w-5xl rounded-lg bg-green-100 p-4 text-center">
              <p className="text-sm text-green-700">
                Tramona gives travelers access to deals they won’t find
                elsewhere, making it the perfect platform for finding affordable
                stays and for hosts to fill those empty nights effortlessly.
              </p>
            </div>
          </div>

          <div className="w-full max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center md:flex-row md:items-center md:justify-center gap-8">

              {/* Image Section */}
              <div className="w-full max-w-md flex justify-center">
                <Image
                  src="/assets/images/landing-page/try_before_you_book.png"
                  alt="Cozy house with people sitting"
                  className="rounded-lg object-cover shadow-md"
                  width={400}
                  height={400}
                />
              </div>

              {/* Text Section */}
              <div className="w-full max-w-lg text-center md:text-center flex flex-col items-center">
                <h2 className="mb-4 text-2xl font-semibold">
                  Try it before you book
                </h2>
                <p className="text-base leading-relaxed text-[#004236]">
                  Already committed to traveling? Submit a request or place bids to get the best prices on the market. Each deal you get will be a one-of-a-kind deal.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
      <div className="bg-[#FAF9F6] p-20">
        <FAQ />
      </div>
      <div className="bg-primaryGreen py-8 pb-[calc(var(--mobile-header-height)+1.5rem)] lg:pb-8">
        <div className="text-center text-white">
          <h2 className="text-2xl font-semibold">
            Start your journey with Tramona now
          </h2>
          <div className="mt-6 flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-x-6 md:space-y-0">
            <Link href="/?tab=name-price">
              <Button
                size="lg"
                className="bg-primaryGreen bg-white text-primaryGreen"
              >
                Name Your Own Price
              </Button>
            </Link>
            <Link href="/unclaimed-offers">
              <Button
                size="lg"
                className="bg-primaryGreen bg-white text-primaryGreen"
              >
                Book it Now
              </Button>
            </Link>
            <Link href="/host-onboarding">
              <Button
                size="lg"
                className="bg-primaryGreen bg-white text-primaryGreen"
              >
                Become a host
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const FAQ = () => {
  return (
    <section className="mx-auto max-w-7xl pb-footer-height">
      <div className="flex flex-col space-y-6 p-4 md:grid md:grid-cols-3 md:gap-6">
        <span className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl font-semibold md:text-4xl">
            Frequently asked questions
          </h1>
        </span>
        <div className="col-span-2 border-t">
          <AccordionFaq accordionItems={whyListAccordionItems} />
          <span className="mt-8 flex justify-center md:justify-start">
            <Link href="/faq">
              <Button size="lg" className="bg-primaryGreen text-white">
                View FAQ
              </Button>
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
};

const whyListAccordionItems = [
  {
    question: "How much does it cost to sign up?",
    answer: "Tramona is completely free to sign up and use.",
  },
  {
    question: "What happens if I don't like the price?",
    answer:
      "If you dont like the prices, submit another offer! We dont need your credit card until you purchase your trip so there is no harm in sending a request.",
  },
  {
    question: "When do I have to put my credit card in?",
    answer:
      "We only ask for your credit card when you are ready to pay. Make a request, it's easy.",
  },
];
