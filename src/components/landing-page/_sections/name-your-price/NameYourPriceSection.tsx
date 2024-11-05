import OverviewRequestCards from "./OverviewRequestCards";
import { Button } from "@/components/ui/button";
import { TestimonialCarousel } from "../testimonials/TestimonialCarousel";

import Typewriter from "typewriter-effect";
import CityRequestFormContainer from "../../SearchBars/CityRequestFormContainer";
import HowTramonaWorks from "./HowTramonaWorks";
import HostSection from "./HostSection";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

export function NameYourPriceSection() {
  return (
    <div className="mt-12 flex flex-col items-center gap-y-20 lg:gap-y-24">
      <div className="flex w-full flex-col items-center gap-y-4">
        <h1 className="mx-auto max-w-3xl text-balance text-3xl font-bold text-primaryGreen lg:text-4xl">
          Name your own Price
        </h1>
        <p className="text-lg font-semibold text-muted-foreground lg:block lg:text-xl">
          Send a request to every host in{" "}
          <span className="font-bold text-teal-900">
            <Typewriter
              component={"span"}
              options={{
                strings: ["SEATTLE", "PARIS", "MIAMI", "ANY CITY"],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
        </p>
        <CityRequestFormContainer />
      </div>
      {/* other  sections */}
      <OverviewRequestCards className="w-11/12 lg:w-2/3" />
      <HowTramonaWorks className="w-11/12" />
      <div className="mx-0 flex max-w-full justify-center space-y-4 px-4 lg:mx-4 lg:flex lg:space-y-8">
        <TestimonialCarousel />
      </div>
      <HostSection className="w-full" />

      {/* FAQ */}
      <section className="w-11/12 bg-gray-50">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto w-5/6 max-w-5xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Can I counter offer requests?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Yes, as a host, you have the option to counter traveler
                requests, giving you flexibility and control over each booking.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Can I invite a co-host?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Absolutely. Tramona allows you to add a co-host to help manage
                requests and bookings on your property.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Why list on Tramona?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Tramona allows you to list your property at full price and still
                receive direct booking requests. You can offer exclusive
                discounts only when you choose, helping you fill empty nights
                without compromising on price.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                <div className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Can I sync my calendar with other platforms?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Yes! Tramona integrates with other platforms to prevent double
                bookings, making it easy to manage your calendar.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="font-semibold text-[#004236] hover:underline"
            >
              See full FAQ
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="mb-20 w-full bg-gradient-to-r from-[#004236] to-[#006a56] py-10 text-white md:mb-0">
        <div className="px-4 sm:px-6 md:px-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-y-4 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to Experience the Best of Short-Term Rentals?
            </h2>
            <p className="mb-4 text-lg sm:text-xl">
              Join Tramona today to access unbeatable deals on unique stays or
              to start earning more on your empty nights.
            </p>
            <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link href="/">
                <Button className="w-full bg-white px-4 text-[#004236] hover:bg-gray-100 sm:w-auto sm:px-8">
                  Book One-of-a-Kind Prices
                </Button>
              </Link>
              <Link href="/for-hosts">
                <Button className="w-full bg-white px-4 text-[#004236] hover:bg-gray-100 sm:w-auto sm:px-8">
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
