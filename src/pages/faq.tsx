import { useState } from "react";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Head from "next/head";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { hostsFaqData, travelersFaqData } from "@/utils/constants";
import { Button } from "@/components/ui/button";

export default function FAQ() {
  const [activeTab, setActiveTab] = useState<"travelers" | "hosts">(
    "travelers",
  );
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleAllSections = () => {
    const allQuestions =
      activeTab === "hosts"
        ? hostsFaqData.flatMap((section, sIndex) =>
            section.questions.map((_, qIndex) => `item-${sIndex}-${qIndex}`),
          )
        : (travelersFaqData[0]?.questions.map((_, index) => `item-${index}`) ??
          []);

    if (openSections.length === allQuestions.length) {
      setOpenSections([]);
    } else {
      setOpenSections(allQuestions);
    }
  };

  return (
    <>
      <Head>
        <title>FAQ | Tramona</title>
      </Head>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700&display=swap");
      `}</style>

      <DashboardLayout>
        <div className="font-mulish mx-auto max-w-3xl p-4 pb-32">
          <h1 className="mb-6 text-3xl font-bold">FAQ</h1>

          <Tabs
            defaultValue="travelers"
            onValueChange={(value) =>
              setActiveTab(value as "travelers" | "hosts")
            }
          >
            <TabsList className="mb-8 flex w-full">
              <TabsTrigger
                className={`flex-1 ${activeTab === "travelers" ? "border-b-2 border-[#134E4A] font-bold" : ""}`}
                value="travelers"
              >
                Travelers
              </TabsTrigger>
              <TabsTrigger
                className={`flex-1 ${activeTab === "hosts" ? "border-b-2 border-[#134E4A] font-bold" : ""}`}
                value="hosts"
              >
                Hosts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="travelers">
              <div className="mb-12 grid grid-cols-3 gap-8">
                {[
                  "How it works (Travelers)",
                  "How booking works",
                  "Safety during traveler process",
                ].map((title, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="mb-2 aspect-video w-full overflow-hidden rounded-lg bg-gray-200">
                      <div className="animate-spin-slow h-full w-full bg-gradient-to-r from-gray-300 to-gray-100"></div>
                    </div>
                    <span className="text-center text-sm">{title}</span>
                  </div>
                ))}
              </div>

              {travelersFaqData[0] && (
                <>
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#134E4A]">
                      How it works
                    </h2>
                    <span
                      className="cursor-pointer text-[#134E4A]"
                      onClick={toggleAllSections}
                    >
                      {openSections.length ===
                      travelersFaqData[0].questions.length
                        ? "Close all"
                        : "Open all"}
                    </span>
                  </div>

                  <div className="mb-8">
                    <Accordion
                      type="multiple"
                      value={openSections}
                      onValueChange={setOpenSections}
                    >
                      {travelersFaqData[0].questions.map((item, qIndex) => (
                        <AccordionItem key={qIndex} value={`item-${qIndex}`}>
                          <AccordionTrigger>{item.question}</AccordionTrigger>
                          <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="hosts">
              <div className="mb-12 grid grid-cols-3 gap-8">
                {[
                  "How Tramona Works (Host)",
                  "How to list",
                  "How Tramona benefits you",
                ].map((title, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="mb-2 aspect-video w-full overflow-hidden rounded-lg bg-gray-200">
                      <div className="animate-spin-slow h-full w-full bg-gradient-to-r from-gray-300 to-gray-100"></div>
                    </div>
                    <span className="text-center text-sm">{title}</span>
                  </div>
                ))}
              </div>

              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#134E4A]">
                  How it works
                </h2>
                <span
                  className="cursor-pointer text-[#134E4A]"
                  onClick={toggleAllSections}
                >
                  {openSections.length ===
                  hostsFaqData.flatMap((section) => section.questions).length
                    ? "Close all"
                    : "Open all"}
                </span>
              </div>

              {hostsFaqData.map((section, sIndex) => (
                <div key={sIndex} className="mb-8">
                  {sIndex !== 0 && (
                    <h2 className="mb-4 text-xl font-semibold text-[#134E4A]">
                      {section.category}
                    </h2>
                  )}
                  <Accordion
                    type="multiple"
                    value={openSections}
                    onValueChange={setOpenSections}
                  >
                    {section.questions.map((item, qIndex) => (
                      <AccordionItem
                        key={qIndex}
                        value={`item-${sIndex}-${qIndex}`}
                      >
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <p className="mb-4 text-center text-sm">
            Anything we didn&apos;t answer? Send us a message with any other
            questions.
          </p>

          <div className="flex justify-center">
            <Link href={activeTab === "hosts" ? "/for-hosts" : "/"} passHref>
              <Button className="bg-[#134E4A] text-white hover:bg-[#0D3D3B]">
                {activeTab === "hosts" ? "Become a host" : "Make a request"}
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
