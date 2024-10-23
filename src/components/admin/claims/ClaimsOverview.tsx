import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/utils/api";
import type { RouterOutputs } from "@/utils/api";
import { formatDate } from "date-fns";
import Link from "next/link";
import type { ClaimItem } from "@/server/db/schema";
export type ClaimsWDetails = RouterOutputs["claims"]["getAllClaims"][number];

export default function AdminClaimsDashboard() {
  const [selectedClaim, setSelectedClaim] = useState<null | ClaimsWDetails>(
    null,
  );
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allClaims, isLoading } = api.claims.getAllClaims.useQuery();

  const filteredClaims = allClaims?.filter(
    (claim) =>
      (filterStatus === "all" || claim.claim.claimStatus === filterStatus) &&
      claim.claim
        .filedByHostId!.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  function calculateTotalRequestedAmount(claimItems: ClaimItem[]) {
    return (
      claimItems.reduce((total, item) => total + item.requestedAmount, 0) / 100
    ).toFixed(2);
  }

  function calculateTotalOutstandingAmount(claimItems: ClaimItem[]) {
    return (
      claimItems.reduce(
        (total, item) => total + (item.outstandingAmount ?? 0),
        0,
      ) / 100
    ).toFixed(2);
  }

  function calculateProgress(
    claimStatus: "Submitted" | "In Review" | "Resolved",
  ) {
    if (claimStatus === "Submitted") {
      return 33;
    } else if (claimStatus === "In Review") {
      return 66;
    } else {
      return 100;
    }
  }
  const getBadgeByStatus = (
    claimStatus: "Submitted" | "In Review" | "Resolved",
  ) => {
    switch (claimStatus) {
      case "Submitted":
        return <Badge variant="gray">Submitted</Badge>;

      case "In Review":
        return <Badge variant="yellow">In Review</Badge>;

      case "Resolved":
        return <Badge variant="green">Resolved</Badge>;
    }
  };

  const claimStats = {
    total: allClaims?.length ?? 0,
    submitted:
      allClaims?.filter((c) => c.claim.claimStatus === "Submitted").length ?? 0,
    resolved:
      allClaims?.filter((c) => c.claim.claimStatus === "Resolved").length ?? 0,
    inReview:
      allClaims?.filter((c) => c.claim.claimStatus === "In Review").length ?? 0,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Claims Dashboard</h1>

      {/* Claims Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claimStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claimStats.submitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claimStats.inReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claimStats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Claims</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="In Review">In Review</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Search by Host ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-auto"
        />
      </div>

      {/* Claims Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Claim ID</TableHead>
            <TableHead>Host ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested Amount</TableHead>
            <TableHead>Outstanding Amount</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClaims?.map((claim) => (
            <TableRow key={claim.claim.id}>
              <TableCell>{claim.claim.id}</TableCell>
              <TableCell>{claim.claim.filedByHostId}</TableCell>
              <TableCell>
                {getBadgeByStatus(claim.claim.claimStatus!)}
              </TableCell>
              <TableCell>
                ${calculateTotalRequestedAmount(claim.claimItems)}
              </TableCell>
              <TableCell>
                ${calculateTotalOutstandingAmount(claim.claimItems)}
              </TableCell>
              <TableCell>
                {formatDate(claim.claim.createdAt!, "MM/dd/yyyy")}
              </TableCell>
              <TableCell>{claim.claimItems.length}</TableCell>
              <TableCell>
                <Link href={`reports/claim-details/${claim.claim.id}`}>
                  <Button onClick={() => setSelectedClaim(claim)}>
                    View Details
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
