import Link from "next/link";
import { Button } from "@/components/ui/button";
import AccordionFaq from "@/components/_common/AccordionFaq";

const whyListAccordionItems = [
  {
    question: "Does Tramona help with Taxes?",
    answer:
      "Yes, Tramona handles all the same taxes other sites like Airbnb and VRBO do.",
  },
  {
    question: "How and when do I get paid?",
    answer:
      "Tramona collets the full amount from the traveler at the time of the booking, and pays the host 24 hours after check in. All payment are securely handled via Stripe.",
  },
  {
    question: "How much protection does Tramona offer?",
    answer:
      "Tramona offers $50,000 of protection per booking. You also have the opportunity to add a security deposit.",
  },
];

export const FAQ = () => {
  return (
    <section className="mx-auto max-w-7xl pb-8 md:pb-1">
      <div className="flex flex-col space-y-6 p-2 md:grid md:grid-cols-3 md:gap-6">
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