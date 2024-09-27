import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Head from "next/head";
import AccordionFaq from "@/components/_common/AccordionFaq";
import { hostAccordionItems, travelerAccordionItems } from "@/utils/constants";

export default function FAQ() {
  return (
    <>
      <Head>
        <title>FAQ | Tramona</title>
      </Head>

      <DashboardLayout>
        <div className="mx-auto max-w-3xl p-4 pb-32">
          <h1 className="pb-12 pt-20 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h1>

          <Tabs defaultValue="traveler">
            <TabsList className="flex w-full">
              <TabsTrigger value="traveler">Travelers</TabsTrigger>
              <TabsTrigger value="host">Hosts</TabsTrigger>
            </TabsList>

            <TabsContent value="traveler">
              <AccordionFaq accordionItems={travelerAccordionItems} />
            </TabsContent>

            <TabsContent value="host">
              <AccordionFaq accordionItems={hostAccordionItems} />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}
