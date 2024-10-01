import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type AccordionItems = {
  question: string;
  answer: string;
}[];

export default function AccordionFaq({
  accordionItems,
}: {
  accordionItems: AccordionItems;
}) {
  return (
    <Accordion type="multiple">
      {accordionItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="py-4">
          <AccordionTrigger className="font-bold">
            {item.question}
          </AccordionTrigger>
          <AccordionContent>
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
