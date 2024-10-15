"use client";

import { useState } from "react";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import {
  AlertTriangle,
  FileText,
  Info,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function Component() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleCardHover = (cardId: string) => {
    setActiveCard(cardId);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-primary">
            Report Center
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage property damages and insurance claims efficiently
          </p>
        </div>

        <Tabs defaultValue="report" className="mb-8">
          <TabsList className="my-3 grid w-full grid-cols-2 rounded-lg">
            <TabsTrigger value="report">Report Options</TabsTrigger>
            <TabsTrigger value="status">Report Status</TabsTrigger>
          </TabsList>
          <TabsContent value="report">
            <div className="grid gap-8 md:grid-cols-2">
              <Card
                className={`transition-shadow duration-300 ${activeCard === "damages" ? "shadow-lg" : ""}`}
                onMouseEnter={() => handleCardHover("damages")}
                onMouseLeave={() => handleCardHover("")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <FileText className="h-6 w-6 text-primary" />
                    Report Damages
                  </CardTitle>
                  <CardDescription>
                    Document and report any damages to your property quickly and
                    easily
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="what-to-report">
                      <AccordionTrigger>What should I report?</AccordionTrigger>
                      <AccordionContent>
                        Report any physical damages to the property, including
                        but not limited to broken furniture, stained carpets,
                        damaged appliances, or structural issues caused by
                        guests.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="reporting-process">
                      <AccordionTrigger>
                        What&apos;s the reporting process?
                      </AccordionTrigger>
                      <AccordionContent>
                        1. Fill out the damage report form 2. Upload photos or
                        videos of the damage 3. Provide an estimated cost of
                        repair 4. Submit the report for review
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link
                      href="/host/report/security-deposit"
                      className="flex items-center justify-center gap-2"
                    >
                      Report Damages
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card
                className={`transition-shadow duration-300 ${activeCard === "insurance" ? "shadow-lg" : ""}`}
                onMouseEnter={() => handleCardHover("insurance")}
                onMouseLeave={() => handleCardHover("")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                    File Insurance Claim
                  </CardTitle>
                  <CardDescription>
                    If damages exceed your security deposit, file a claim with
                    our comprehensive insurance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="when-to-file">
                      <AccordionTrigger>
                        When should I file a claim?
                      </AccordionTrigger>
                      <AccordionContent>
                        File an insurance claim when the cost of damages exceeds
                        the security deposit amount, or for damages not
                        typically covered by security deposits, such as
                        extensive property damage.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="claim-process">
                      <AccordionTrigger>
                        What&apos;s the claim process?
                      </AccordionTrigger>
                      <AccordionContent>
                        1. Gather all necessary documentation 2. Fill out the
                        insurance claim form 3. Provide detailed descriptions
                        and evidence of damages 4. Submit the claim for review
                        by our insurance team
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="secondary" className="w-full">
                    <Link
                      href="/host/report/resolution-form"
                      className="flex items-center justify-center gap-2"
                    >
                      File Insurance Claim
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>
                  View the status of your recent damage reports and insurance
                  claims
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>Damage Report #1234</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Under Review
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Insurance Claim #5678</span>
                    </div>
                    <span className="text-sm text-green-500">Approved</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Reports
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you&apos;re unsure about which option to choose or need
                assistance with the reporting process, our support team is here
                to help. Don&apos;t hesitate to reach out!
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Processing Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  Damage Reports: Typically reviewed within 2-3 business days
                </li>
                <li>
                  Insurance Claims: Usually processed within 5-7 business days
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            Please ensure all damage reports and insurance claims are submitted
            within 14 days of the guest&apos;s checkout to ensure timely
            processing.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
}
