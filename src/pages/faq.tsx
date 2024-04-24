import MainLayout from "@/components/_common/Layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

      <MainLayout type="marketing">
        <div className="col-span-10 mx-auto max-w-3xl p-4 pb-32 2xl:col-span-11">
          <h1 className="pb-12 pt-20 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h1>

          <Tabs defaultValue="traveler">
            <TabsList className="flex w-full border-0">
              <TabsTrigger
                value="traveler"
                className="px-4 text-lg data-[state=active]:border-b-4 data-[state=active]:border-b-black data-[state=active]:font-bold"
              >
                Travelers
              </TabsTrigger>
              <TabsTrigger
                value="host"
                className="px-4 text-lg data-[state=active]:border-b-4 data-[state=active]:border-b-black data-[state=active]:font-bold"
              >
                Hosts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="traveler">
              <Accordion type="multiple">
                <AccordionItem value="0">
                  <AccordionTrigger>
                    How can I book a stay on Tramona?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can book a stay in two ways:
                    <ol>
                      <li className="list-inside list-decimal">
                        Make an offer on a specific property for specific dates.
                        If your offer is accepted by the host, your card will be
                        charged.
                      </li>
                      <li className="list-inside list-decimal">
                        Submit a city request with your desired dates and
                        budget. Hosts in that city can then accept, deny, or
                        counter your request.
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="1">
                  <AccordionTrigger>
                    How long do hosts have to respond to my offer or city
                    request?
                  </AccordionTrigger>
                  <AccordionContent>
                    Hosts have 24 hours to respond to an offer made on their
                    listing. City requests expire one day before the check-in
                    date.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="2">
                  <AccordionTrigger>
                    How will I know if my offer or city request is accepted,
                    denied, or countered by a host?
                  </AccordionTrigger>
                  <AccordionContent>
                    You will receive notifications via email and text message.
                    Additionally, you can check the status of your offers and
                    requests in the "Offers/Requests" section of the website.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="3">
                  <AccordionTrigger>
                    What happens if my offer on a specific property is accepted
                    by the host?
                  </AccordionTrigger>
                  <AccordionContent>
                    Once your offer is accepted, you will receive confirmation
                    via text and email, and your card will be charged for the
                    booking. You will now see the trip in your 'My Trips'
                    section of your account.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="4">
                  <AccordionTrigger>
                    Can I cancel or modify my offer or city request after it has
                    been submitted?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, you can cancel or modify your offer or city request as
                    long as the host has not yet accepted it. Once offers are
                    accepted, the booking becomes binding according to the terms
                    set by the host. If your city request is accepted, you have
                    24 hours to pay otherwise the host's offer will be canceled.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="5">
                  <AccordionTrigger>
                    Are there any fees associated with making an offer or city
                    request on Tramona?
                  </AccordionTrigger>
                  <AccordionContent>
                    No, there are no fees for making offers or city requests on
                    Tramona. You only pay for your booking if your offer is
                    accepted by the host. Since you name the price, that is
                    exactly what you will be paying.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="6">
                  <AccordionTrigger>
                    How can I contact a host if I have questions about their
                    property or my booking?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can contact the host directly through the messaging
                    system on Tramona. Simply navigate to the listing you're
                    interested in and click on the "Contact Host" button.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="7">
                  <AccordionTrigger>
                    What happens if my city request is not accepted by any
                    hosts?
                  </AccordionTrigger>
                  <AccordionContent>
                    If your city request is not accepted by any hosts, you can
                    consider making offers on specific properties within your
                    desired city or expanding your search to nearby areas. You
                    can also up your budget to try to further incentivize hosts.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="8">
                  <AccordionTrigger>
                    How does negotiation work on Tramona?
                  </AccordionTrigger>
                  <AccordionContent>
                    Negotiation on Tramona occurs when hosts counter a
                    traveler's offer or city request. You can then choose to
                    accept their counteroffer, make a new offer, or continue
                    negotiating until both parties reach an agreement.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="9">
                  <AccordionTrigger>Cancellation Policy</AccordionTrigger>
                  <AccordionContent>
                    Please refer to the cancellation policy page for more info.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="host">
              <Accordion type="multiple">
                <AccordionItem value="0">
                  <AccordionTrigger>
                    How does Tramona handle guest screening?
                  </AccordionTrigger>
                  <AccordionContent>
                    Tramona verifies each guest through a screening process
                    conducted when guests submit a bid or city request. If
                    guests pass the screening process, hosts are covered for up
                    to $50,000 through our partner SuperHog.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="1">
                  <AccordionTrigger>
                    Can I opt out of the guest screening process?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, hosts have the option to opt out of the guest screening
                    process. Please contact Tramona if you wish to opt out of
                    our guest protection.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="2">
                  <AccordionTrigger>
                    How are disputes between travelers and hosts handled?
                  </AccordionTrigger>
                  <AccordionContent>
                    Disputes are handled internally by our dispute resolution
                    team. Each case is handled individually, and we strive to
                    find a fair resolution for all parties involved.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="3">
                  <AccordionTrigger>
                    How can I ensure prompt responses to city requests from
                    travelers?
                  </AccordionTrigger>
                  <AccordionContent>
                    We encourage hosts to respond promptly to city requests by
                    sending reminders about travelers interested in their city.
                    When you send an offer to a traveler for their city request,
                    we require them to respond within 24 hours to your offer.
                    Additionally, city requests expire one day before the
                    check-in date to ensure timely responses.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="4">
                  <AccordionTrigger>
                    Can I set additional requirements for guests, such as age
                    restrictions or house rules?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, as a host, you can set additional requirements for
                    guests on your listing. These may include age restrictions,
                    house rules, or any other preferences you have for your
                    guests.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="5">
                  <AccordionTrigger>
                    How do I receive payment for bookings made through Tramona?
                  </AccordionTrigger>
                  <AccordionContent>
                    Payments for bookings made through Tramona are processed
                    securely via Stripe. Within your host dashboard, navigate to
                    'Finances' and set up your payout account.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="6">
                  <AccordionTrigger>
                    Are there any restrictions on the types of properties I can
                    list on Tramona?
                  </AccordionTrigger>
                  <AccordionContent>
                    Tramona accepts a wide range of properties for listing,
                    including houses, apartments, condos, and more. However, all
                    properties must meet certain quality and safety standards to
                    be listed on our platform.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="7">
                  <AccordionTrigger>
                    Can I communicate with guests before accepting their
                    booking?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, hosts can communicate with guests before accepting
                    their booking. This allows you to ask any questions you may
                    have and ensure that the guest is the right fit for your
                    property.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="8">
                  <AccordionTrigger>How do offers work?</AccordionTrigger>
                  <AccordionContent>
                    When a guest makes an offer on one of your properties, you
                    will be notified via SMS, email and within your Tramona
                    account. Offers that guests send are binding and if you
                    accept their offer, their card will be charged and the dates
                    booked and confirmed. You have the ability to accept, deny
                    or counter a guest's offer. You have 24 hours to make a
                    decision on a guest's offer before it expires.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="9">
                  <AccordionTrigger>
                    How do city requests work?
                  </AccordionTrigger>
                  <AccordionContent>
                    When a guest is not interested in any specific property but
                    simply wants to visit a particular city, they can send a
                    city request through Tramona. As a host with properties in
                    that city, you will receive notifications of all city
                    requests relevant to your listings. Upon receiving a city
                    request, you have the option to accept, deny, or counter the
                    request. It's important to note that a city request is not
                    binding once it has been sent out. However, if you, as a
                    host, choose to accept a city request, the guest will then
                    be required to proceed with payment to finalize the booking.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </>
  );
}
