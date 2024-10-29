import React from "react";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import BackButton from "@/components/_common/BackButton";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

function TaxPage() {
  const router = useRouter();
  const stripeAcc = router.query.id as string;
  //////MAKE SURE TO BLOCK ANY REQUEST THAT IS NOT THIS USER
  // Hardcoded tax information
  const taxInfo = {
    taxId: "123-45-6789",
    businessName: "Acme Rentals LLC",
    address: "123 Main St, Anytown, USA 12345",
    taxYear: 2024,
    totalEarnings: 0,
    totalTaxWithheld: 0,
  };

  // Hardcoded monthly breakdown
  const monthlyBreakdown = [
    { month: "January", earnings: 0, taxWithheld: 0 },
    { month: "February", earnings: 0, taxWithheld: 0 },
    { month: "March", earnings: 0, taxWithheld: 0 },
    { month: "April", earnings: 0, taxWithheld: 0 },
    { month: "May", earnings: 0, taxWithheld: 0 },
    { month: "June", earnings: 0, taxWithheld: 0 },
    { month: "July", earnings: 0, taxWithheld: 0 },
    { month: "August", earnings: 0, taxWithheld: 0 },
    { month: "September", earnings: 0, taxWithheld: 0 },
    { month: "October", earnings: 0, taxWithheld: 0 },
    { month: "November", earnings: 0, taxWithheld: 0 },
    { month: "December", earnings: 0, taxWithheld: 0 },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <BackButton href="/host/finances" />
          <h1 className="text-3xl font-bold">Tax Information</h1>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Download Tax Report
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tax Summary for {taxInfo.taxYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Tax ID:</p>
                <p>{taxInfo.taxId}</p>
              </div>
              <div>
                <p className="font-semibold">Business Name:</p>
                <p>{taxInfo.businessName}</p>
              </div>
              <div>
                <p className="font-semibold">Address:</p>
                <p>{taxInfo.address}</p>
              </div>
              <div>
                <p className="font-semibold">Stripe Account ID:</p>
                <p>{stripeAcc}</p>
              </div>
              <div>
                <p className="font-semibold">Total Earnings:</p>
                <p>${taxInfo.totalEarnings.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold">Total Tax Withheld:</p>
                <p>${taxInfo.totalTaxWithheld.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Tax Withheld</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyBreakdown.map((month) => (
                  <TableRow key={month.month}>
                    <TableCell>{month.month}</TableCell>
                    <TableCell>${month.earnings.toLocaleString()}</TableCell>
                    <TableCell>${month.taxWithheld.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Tax Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Please consult with a tax professional for advice on your
                specific tax situation.
              </li>
              <li>
                Ensure all information is accurate and up-to-date in your
                account settings.
              </li>
              <li>
                Tax forms will be available for download by January 31st of the
                following year.
              </li>
              <li>
                Report any discrepancies in your tax information immediately to
                our support team.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TaxPage;
