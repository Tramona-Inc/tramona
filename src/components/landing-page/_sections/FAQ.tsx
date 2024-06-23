import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

const FAQ = () => {
  const items = [
    {
      question: "How much does it cost to sign up?",
      answer:
        "Tramona is a platform that allows you to book vacation rentals, homes, hotels, and more. We have over 300,000 properties worldwide.",
    },
    {
      question: "How exactly does it work?",
      answer:
        "You can book a property by searching for the location you want to stay in, selecting the dates you want to stay, and then clicking the 'Book Now' button.",
    },
    {
      question: "What happens if I don't like the price?",
      answer:
        "You can become a host by signing up on our website and listing your property. Once your property is listed, guests can book it through our platform.",
    },
    {
      question: "When do I have to put my credit card in?",
      answer: "You can get in touch with customer service by emailing us at",
    },
  ];

  return (
    <section className="mx-4 lg:mx-24">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">
            Frequently asked questions
          </h1>
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
