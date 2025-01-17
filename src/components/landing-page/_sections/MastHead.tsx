// MastHead.tsx
import { NameYourPriceSection } from "./name-your-price/NameYourPriceSection";
import landingBg2 from "public/assets/images/landing-page/man_standing_on_rock.png";
import { useRouter } from "next/router";
import { AdjustedPropertiesProvider } from "../search/AdjustedPropertiesContext";
import { DesktopSearchTab } from "../search/DesktopSearchTab";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight, HelpCircle } from "lucide-react";
import OverviewRequestCards from "./name-your-price/OverviewRequestCards";
import HowTramonaWorks from "./name-your-price/HowTramonaWorks";
import { TestimonialCarousel } from "./testimonials/TestimonialCarousel";
import { landingPageTestimonals } from "./testimonials/testimonials-data";
import UnclaimedMap from "@/components/unclaimed-offers/UnclaimedMap";

export default function MastHead() {
  const router = useRouter();
  const { query } = router;
  const activeTab = query.tab ?? "search";
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleSectionRef = useRef<HTMLDivElement>(null);
  const [hasPassedButtons, setHasPassedButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);

      if (toggleSectionRef.current) {
        const buttonPosition = toggleSectionRef.current.offsetTop;
        setHasPassedButtons(scrollPosition > buttonPosition + 400);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (tab: string) => {
    void router.push(
      {
        pathname: router.pathname,
        query: { ...query, tab },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    );

    if (toggleSectionRef.current) {
      const headerOffset = 250;
      const elementPosition =
        toggleSectionRef.current.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToHowItWorks = () => {
    window.scrollTo({
      top: 3000,
      behavior: "smooth",
    });
  };

  const faqData = [
    {
      question: "Can I counter offer requests?",
      answer:
        "Yes, as a host, you have the option to counter traveler requests, giving you flexibility and control over each booking.",
    },
    {
      question: "Can I invite a co-host?",
      answer:
        "Absolutely. Tramona allows you to add a co-host to help manage requests and bookings on your property.",
    },
    {
      question: "Why list on Tramona?",
      answer:
        "Tramona allows you to list your property at full price and still receive direct booking requests. You can offer exclusive discounts only when you choose, helping you fill empty nights without compromising on price.",
    },
    {
      question: "Can I sync my calendar with other platforms?",
      answer:
        "Yes! Tramona integrates with other platforms to prevent double bookings, making it easy to manage your calendar.",
    },
  ];

  return (
    <AdjustedPropertiesProvider>
      <div className="bg-background-offWhite">
        <div
          className={`sticky -top-24 z-20 -mt-24 flex w-full translate-y-24 flex-col items-center justify-center border-b-2 transition-all duration-300 ease-in-out lg:top-16 lg:mt-0 lg:translate-y-0 ${
            isScrolled
              ? "border-white bg-white shadow-md"
              : "border-transparent bg-transparent lg:bg-white"
          }`}
        >
          <DesktopSearchTab
            isCompact={isScrolled}
            handleTabChange={handleTabChange}
            isLandingPage={true}
          />

          {/* Booking Toggle in Sticky Header */}
          <div
            className={`w-full transition-all duration-300 ease-in-out ${
              hasPassedButtons
                ? "mt-1 h-9 opacity-100"
                : "pointer-events-none h-0 opacity-0"
            }`}
          >
            <div className="mx-auto max-w-sm px-4 md:max-w-md lg:max-w-2xl">
              <div className="flex justify-center gap-12 lg:gap-60">
                <button
                  onClick={() => handleTabChange("search")}
                  className={`group relative py-2 text-center text-sm transition-all duration-200`}
                >
                  <span
                    className={`${
                      activeTab === "search"
                        ? "text-primaryGreen"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  >
                    Book it now
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full scale-x-125 transition-transform duration-200 ${
                      activeTab === "search"
                        ? "bg-primaryGreen"
                        : "bg-transparent group-hover:bg-gray-200"
                    }`}
                  />
                </button>
                <button
                  onClick={() => handleTabChange("name-price")}
                  className={`group relative py-2 text-center text-sm transition-all duration-200`}
                >
                  <span
                    className={`${
                      activeTab === "name-price"
                        ? "text-primaryGreen"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  >
                    Name your own price
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full scale-x-125 transition-transform duration-200 ${
                      activeTab === "name-price"
                        ? "bg-primaryGreen"
                        : "bg-transparent group-hover:bg-gray-200"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative h-96">
            <Image
              src={landingBg2}
              alt=""
              fill
              quality={100}
              unoptimized={true}
              className="object-cover object-center brightness-90"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />

            <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center pl-4 text-left lg:hidden">
              <h2 className="mt-8 text-left text-3xl font-bold text-white sm:text-4xl">
                Lets turn empty nights into bookings
              </h2>
              <h3 className="mt-6 text-lg font-semibold text-white">
                When hosts have empty nights, no one wins
              </h3>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Name your own price or book it now
              </h3>
              <h3 className="mt-4 text-lg font-semibold text-white">
                <Link href={"/how-it-works"} className="flex items-center">
                  How it works
                  <ChevronRight className="" />
                </Link>
              </h3>
            </div>

            <div className="absolute inset-0 mx-auto hidden max-w-7xl flex-col justify-center pl-4 text-left lg:flex">
              <h2 className="mt-8 text-left text-5xl font-bold text-white">
                Turn empty nights into opportunities
              </h2>
              <h3 className="mt-6 text-xl font-semibold text-white">
                Name your own price or book it now
              </h3>
              <h3 className="mt-2 text-xl font-semibold text-white">
                When hosts have empty nights, no one wins
              </h3>
              <h3 className="mt-4 text-lg font-semibold text-white">
                <button
                  className="flex items-center"
                  onClick={scrollToHowItWorks}
                >
                  How it works
                  <ChevronRight className="" />
                </button>
              </h3>
            </div>
          </div>
        </div>

        <div className="relative -mt-4">
          {/* Original Booking Toggle */}
          <div
            ref={toggleSectionRef}
            className={`mx-auto mb-6 max-w-sm transition-all duration-300 md:max-w-md lg:max-w-2xl ${
              hasPassedButtons ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="mx-auto max-w-sm px-4 md:max-w-md lg:max-w-2xl">
              <div className="flex w-full overflow-hidden rounded-full border border-[#004236] bg-white">
                <button
                  onClick={() => handleTabChange("search")}
                  className={`w-1/2 px-8 py-1 text-center text-sm font-medium transition-all duration-200 md:py-3 ${
                    activeTab === "search"
                      ? "bg-[#004236] text-white"
                      : "bg-white text-[#004236]"
                  }`}
                >
                  Book it now
                </button>
                <button
                  onClick={() => handleTabChange("name-price")}
                  className={`w-1/2 px-8 py-2 text-center text-sm font-medium leading-tight transition-all duration-200 md:py-3 ${
                    activeTab === "name-price"
                      ? "bg-[#004236] text-white"
                      : "bg-white text-[#004236]"
                  }`}
                >
                  Name your own price
                </button>
              </div>
            </div>
          </div>

          {activeTab === "search" ? <UnclaimedMap /> : <NameYourPriceSection />}
        </div>

        <div className="mt-12 flex flex-col items-center gap-y-20 lg:gap-y-24">
          {/* other  sections */}
          <OverviewRequestCards />
          <HowTramonaWorks className="max-w-6xl" />
          <div className="mx-0 flex max-w-full justify-center space-y-4 px-4 lg:mx-4 lg:flex lg:space-y-8">
            <TestimonialCarousel testimonials={landingPageTestimonals} />
          </div>

          <div className="mx-2 my-12 flex flex-col items-center gap-y-20 lg:gap-y-24">
            {/* FAQ */}
            <section className="w-full space-y-8 bg-gray-50">
              <h2 className="text-center text-3xl font-bold">
                Frequently Asked Questions
              </h2>
              <Accordion
                type="single"
                collapsible
                className="mx-auto max-w-2xl"
              >
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={index.toString()}>
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <HelpCircle className="mr-2 h-5 w-5" />
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="text-center">
                <Link
                  href="/faq"
                  className="font-semibold text-[#004236] hover:underline"
                >
                  See full FAQ
                </Link>
              </div>
            </section>

            {/* Final CTA Banner */}
            <section className="mb-4 w-full bg-gradient-to-r from-[#004236] to-[#006a56] py-10 text-white md:mb-0">
              <div className="px-4 sm:px-6 md:px-8">
                <div className="mx-auto flex max-w-3xl flex-col gap-y-4 text-center">
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Ready to Experience the Best of Short-Term Rentals?
                  </h2>
                  <p className="mb-4 text-lg sm:text-xl">
                    Join Tramona today to access unbeatable deals on unique
                    stays or to start earning more on your empty nights.
                  </p>
                  <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <Link href="/">
                      <Button className="w-full bg-white px-4 text-[#004236] hover:bg-gray-100 sm:w-auto sm:px-8">
                        Book One-of-a-Kind Prices
                      </Button>
                    </Link>
                    <Link href="/why-list">
                      <Button className="w-full bg-white px-4 text-[#004236] hover:bg-gray-100 sm:w-auto sm:px-8">
                        List Your Property
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdjustedPropertiesProvider>
  );
}
