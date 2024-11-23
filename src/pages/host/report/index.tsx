"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  FileText,
  Info,
  ChevronRight,
  Clock,
  ShieldCheckIcon,
} from "lucide-react";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import MyClaimOverview from "./claim/MyClaimOverview";
import BackButton from "@/components/_common/BackButton";

export default function RefinedReportCenterDashboard() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleCardHover = (cardId: string) => {
    setActiveCard(cardId);
  };

  return (
    <DashboardLayout>
      <BackButton href="/host" />
      <div className="container mx-auto max-w-7xl px-4 py-5">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-4xl font-bold text-primary">
            Report Center
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage property incidents with efficiency
          </p>
        </div>
        <Alert className="">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            Please submit all damage reports and protection incidents within 14
            days of the guest&apos;s checkout to ensure timely processing.
          </AlertDescription>
        </Alert>
        <MyClaimOverview />
        <div className="grid gap-6 md:grid-cols-2">
          <Card
            className={`transition-shadow duration-300 ${
              activeCard === "misconduct" ? "shadow-lg" : ""
            }`}
            onMouseEnter={() => handleCardHover("misconduct")}
            onMouseLeave={() => handleCardHover("")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="h-6 w-6 text-primary" />
                Report Misconduct
              </CardTitle>
              <CardDescription>
                Document and report any inappropriate behavior or rule
                violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-to-report">
                  <AccordionTrigger>What should I report?</AccordionTrigger>
                  <AccordionContent>
                    Report any violations of house rules, inappropriate
                    behavior, or communications that negatively impact your
                    property or guests.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="reporting-process">
                  <AccordionTrigger>What&apos;s the process?</AccordionTrigger>
                  <AccordionContent>
                    Fill out the form, provide details, upload evidence, and
                    submit for review.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link
                  href="/host/report/misconduct"
                  className="flex items-center justify-center gap-2"
                >
                  Report Misconduct
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card
            className={`transition-shadow duration-300 ${
              activeCard === "protection" ? "shadow-lg" : ""
            }`}
            onMouseEnter={() => handleCardHover("protection")}
            onMouseLeave={() => handleCardHover("")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ShieldCheckIcon className="h-6 w-6 text-primary" />
                File Protection Incident
              </CardTitle>
              <CardDescription>
                Report property damages and get assistance with refunds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="when-to-file">
                  <AccordionTrigger>What should I report?</AccordionTrigger>
                  <AccordionContent>
                    Report any physical damages to the property, including
                    furniture, appliances, or structural issues caused by
                    guests.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="incident-process">
                  <AccordionTrigger>What&apos;s the process?</AccordionTrigger>
                  <AccordionContent>
                    Gather documentation, fill out the form, provide detailed
                    descriptions and evidence, then submit for review by our
                    protection team.
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
                  File Incident
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Info className="h-6 w-6 text-primary" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our support team is here to assist you with any questions or
                concerns about the reporting process.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/help-center">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Clock className="h-6 w-6 text-primary" />
                Processing Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p className="mb-4">
                  Estimated processing times based on incident amount:
                </p>
                <ul className="space-y-2">
                  <li>Under $250: 3 business days</li>
                  <li>$250 - $1,000: 4 business days</li>
                  <li>$1,000 - $5,000: 6 business days</li>
                  <li>Over $5,000: Contact for details</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
