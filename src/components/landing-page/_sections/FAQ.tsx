import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import React from "react";

const FAQ = () => {
  const items = [
    {
      question: "How much does it cost to sign up?",
      answer: "Tramona is completely free to sign up and use.",
    },
    {
      question: "How exactly does it work?",
      answer:
        "The traveler submits the price they want with some other details about their travels, and that request gets sent out to the hosts. Hosts send matches or counter offers back, and the traveler gets to choose which one fits for them.",
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

  return (
    <section className="mx-4 md:mx-12 lg:mx-24">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h1 className="mb-2 text-left text-3xl font-bold md:text-4xl">
            Frequently asked questions
          </h1>
          <Link
            href="/faq"
            className="text-md font-medium text-black underline"
          >
            See full FAQ
          </Link>
        </div>
        <div>
          <Accordion type="multiple">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`${index}`}>
                <AccordionTrigger className="font-bold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
