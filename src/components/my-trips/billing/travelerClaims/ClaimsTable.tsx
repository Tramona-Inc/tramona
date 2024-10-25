import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "date-fns";
import { ChevronRight, AlertCircle } from "lucide-react";
import type { RouterOutputs } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import {
  GetBadgeByClaimStatus,
  GetBadgeByClaimItemStatus,
} from "@/components/_common/BadgeFunctions";
import Link from "next/link";

export type ClaimsWItemsAgainstTraveler =
  RouterOutputs["claims"]["getCurrentAllClaimsAgainstTraveler"];

interface ClaimsTableProps {
  claims: ClaimsWItemsAgainstTraveler;
}

export default function ClaimsTable({ claims }: ClaimsTableProps) {
  if (claims.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Claims</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">No Claims Found</p>
          <p className="text-muted-foreground">
            There are currently no claims against you.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Claim ID</TableHead>
          <TableHead>Trip ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {claims.map((claimWithItems) => (
          <React.Fragment key={claimWithItems.claim.id}>
            <TableRow className="border-t-2">
              <TableCell>{claimWithItems.claim.id}</TableCell>
              <TableCell>{claimWithItems.claim.tripId}</TableCell>
              <TableCell>
                <GetBadgeByClaimStatus
                  claimStatus={claimWithItems.claim.claimStatus}
                />
              </TableCell>
              <TableCell>
                {formatDate(claimWithItems.claim.createdAt!, "MM/dd/yyyy")}
              </TableCell>
              <TableCell>
                <Link href={`claim-details/${claimWithItems.claim.id}`}>
                  <Button variant="primary" size="sm">
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={5} className="border-none">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full border-none"
                >
                  <AccordionItem value={`claim-${claimWithItems.claim.id}`}>
                    <AccordionTrigger>View All Claim Items</AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-bold">
                              Item Name
                            </TableHead>
                            <TableHead className="font-bold">
                              Requested Amount
                            </TableHead>
                            <TableHead className="font-bold">
                              Outstanding Amount
                            </TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {claimWithItems.claimItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.itemName}</TableCell>
                              <TableCell>
                                {formatCurrency(item.requestedAmount)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(item.outstandingAmount!)}
                              </TableCell>
                              <TableCell>
                                <GetBadgeByClaimItemStatus
                                  isResolvedAt={item.paymentCompleteAt}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
