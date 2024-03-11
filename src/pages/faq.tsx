import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Head from "next/head";

export default function FAQ() {
  return (
    <>
      <Head>
        <title>FAQ | Tramona</title>
      </Head>

      <DashboardLayout type="guest">
        <div className="col-span-10 mx-auto max-w-3xl p-4 pb-32 2xl:col-span-11">
          <h1 className="pb-12 pt-20 text-3xl font-bold">
            Frequently Asked Questions
          </h1>

          <Accordion type="multiple">
            <AccordionItem value="0">
              <AccordionTrigger>
                How does Tramona negotiate prices with host partners to fit my
                budget?
              </AccordionTrigger>
              <AccordionContent>
                Tramona sends out your requests to hosts looking to book, and
                hosts can agree or disagree with your price. Most hosts seeking
                bookings tend to accept your offered price.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="1">
              <AccordionTrigger>
                Is there a limit to how much I can customize my nightly price?
              </AccordionTrigger>
              <AccordionContent>
                No, you can set any amount you&apos;re comfortable with.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="2">
              <AccordionTrigger>
                How do I know the quality and safety standards of the Airbnbs
                I&apos;ll be offered?
              </AccordionTrigger>
              <AccordionContent>
                Bookings are made through Airbnb, allowing you to review all
                Airbnb details and be covered by Airbnb&apos;s policies.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="3">
              <AccordionTrigger>
                Are there any additional fees or hidden costs involved in using
                Tramona&apos;s service?
              </AccordionTrigger>
              <AccordionContent>
                No hidden fees or costs. If you appreciate our services, you can
                show your gratitude by tipping us below!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="4">
              <AccordionTrigger>
                What if I don&apos;t find a suitable accommodation within my
                budget? Do I have other options?
              </AccordionTrigger>
              <AccordionContent>
                If you&apos;re not receiving offers, adjusting your desired
                nightly price slightly higher might yield suitable options.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="5">
              <AccordionTrigger>
                Can I see photos and read reviews of the Airbnbs before making a
                decision?
              </AccordionTrigger>
              <AccordionContent>
                Yes, once you log in and view offers from your requests, you can
                see the properties listed on Airbnb.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="6">
              <AccordionTrigger>
                How does payment work? Do I pay Tramona or the host partner
                directly?
              </AccordionTrigger>
              <AccordionContent>
                You pay through Airbnb. After viewing offers, click the book
                button, which redirects you to the Airbnb page. You&apos;ll then
                copy our pre-fabricated message to the host and complete the
                booking on Airbnb.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="7">
              <AccordionTrigger>
                Can I make special requests, like needing a pet-friendly
                accommodation or specific amenities?
              </AccordionTrigger>
              <AccordionContent>
                Yes! Please send your special requests to our email,{" "}
                <a
                  className="underline underline-offset-2 hover:text-black"
                  href="mailto:info@tramona.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  info@tramona.com
                </a>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="8">
              <AccordionTrigger>
                Is there customer support available if I encounter any issues
                during my stay?
              </AccordionTrigger>
              <AccordionContent>
                Feel free to contact us for request-related questions. For
                post-booking support, reach out to Airbnb directly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="9">
              <AccordionTrigger>
                When is the best time to use Tramona for bookings?
              </AccordionTrigger>
              <AccordionContent>
                You can use Tramona at any time. Last-minute bookings often
                secure the best discounts.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="10">
              <AccordionTrigger>
                What is the cancellation policy if my plans change after booking
                through Tramona?
              </AccordionTrigger>
              <AccordionContent>
                Cancellations are managed through Airbnb.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="11">
              <AccordionTrigger>
                Can I book accommodations for a group, or is Tramona only for
                individual travelers?
              </AccordionTrigger>
              <AccordionContent>
                Tramona accommodates any size group.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="12">
              <AccordionTrigger>
                Is Tramona available worldwide, or are there location
                limitations?
              </AccordionTrigger>
              <AccordionContent>
                Tramona operates globally, allowing bookings from anywhere in
                the world.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="13">
              <AccordionTrigger>
                How is my personal information protected?
              </AccordionTrigger>
              <AccordionContent>
                All transactions are conducted through Airbnb. Any data you
                provide to us is kept private and secure.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="14">
              <AccordionTrigger>
                Can I book both short-term and long-term stays through Tramona?
              </AccordionTrigger>
              <AccordionContent>
                Yes, our partner hosts can accommodate stays of any length.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DashboardLayout>
    </>
  );
}
