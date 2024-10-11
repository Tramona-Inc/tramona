import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CameraIcon,
  FileTextIcon,
  InfoIcon,
  MessageSquareIcon,
} from "lucide-react";
import MyTripsEmptySvg from "@/components/_common/EmptyStateSvg/MyTripsEmptySvg";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import React from "react";

import { api } from "@/utils/api";

function SecurityDepositOverview() {
  const [deposits, setDeposits] = useState([
    {
      id: 1,
      property: "Seaside Villa",
      host: "John Doe",
      amount: 500,
      status: "Held",
      bookingDates: "2023-07-01 to 2023-07-07",
    },
    {
      id: 2,
      property: "Mountain Cabin",
      host: "Jane Smith",
      amount: 750,
      status: "Released",
      bookingDates: "2023-06-15 to 2023-06-22",
    },
    {
      id: 3,
      property: "City Apartment",
      host: "Bob Johnson",
      amount: 300,
      status: "Claimed",
      bookingDates: "2023-05-20 to 2023-05-25",
    },
  ]);

  const [claims, setClaims] = useState([
    {
      id: 1,
      depositId: 3,
      property: "City Apartment",
      amount: 150,
      reason: "Damaged furniture",
      status: "Pending",
      evidence: "furniture_damage.jpg",
    },
    {
      id: 2,
      depositId: 1,
      property: "Seaside Villa",
      amount: 50,
      reason: "Broken glass",
      status: "Pending",
      evidence: "broken_glass.jpg",
    },
  ]);

  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);

  const handleViewDetails = (deposit) => {
    setSelectedDeposit(deposit);
  };

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
  };

  const handleDisputeClaim = (e) => {
    e.preventDefault();
    if (!evidenceUploaded) {
      toast({
        title: "Evidence Required",
        description: "Please upload evidence to support your dispute.",
        variant: "destructive",
      });
      return;
    }
    setClaims((prevClaims) =>
      prevClaims.map((c) =>
        c.id === selectedClaim.id ? { ...c, status: "Disputed" } : c,
      ),
    );
    toast({
      title: "Dispute Submitted",
      description: "Your dispute has been submitted for review.",
    });
    setDisputeReason("");
    setEvidenceUploaded(false);
    setSelectedClaim(null);
  };

  const handleUploadEvidence = () => {
    setEvidenceUploaded(true);
    toast({
      title: "Evidence Uploaded",
      description: "Your evidence has been successfully uploaded.",
    });
  };

  const handleContactHost = () => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the host.",
    });
  };

  const handleAcceptClaim = (claimId) => {
    setClaims((prevClaims) =>
      prevClaims.map((c) =>
        c.id === claimId ? { ...c, status: "Accepted" } : c,
      ),
    );
    toast({
      title: "Claim Accepted",
      description:
        "You have accepted the claim. The deposit will be released to the host.",
    });
  };

  const handleRejectClaim = (claimId) => {
    setClaims((prevClaims) =>
      prevClaims.map((c) =>
        c.id === claimId ? { ...c, status: "Rejected" } : c,
      ),
    );
    toast({
      title: "Claim Rejected",
      description:
        "You have rejected the claim. Please provide a reason for your rejection.",
    });
  };

  return (
    <div>
      {true ? (
        <div className="container mx-auto p-6">
          <h1 className="mb-6 text-3xl font-bold">
            Traveler Dashboard: Deposit Status
          </h1>
          <Tabs
            defaultValue="deposits"
            className="space-y-4"
            orientation="vertical"
          >
            <TabsList>
              <TabsTrigger value="deposits">My Deposits</TabsTrigger>
              <TabsTrigger value="disputes">Disputes</TabsTrigger>
              <TabsTrigger value="claims">Claim History</TabsTrigger>
            </TabsList>
            <TabsContent value="deposits">
              <Card>
                <CardHeader>
                  <CardTitle>My Deposits</CardTitle>
                  <CardDescription>
                    View all your security deposits and their current status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Host</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Booking Dates</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deposits.map((deposit) => (
                        <TableRow key={deposit.id}>
                          <TableCell>{deposit.property}</TableCell>
                          <TableCell>{deposit.host}</TableCell>
                          <TableCell>${deposit.amount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                deposit.status === "Held"
                                  ? "secondary"
                                  : deposit.status === "Released"
                                    ? "success"
                                    : "destructive"
                              }
                            >
                              {deposit.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{deposit.bookingDates}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(deposit)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="disputes">
              <Card>
                <CardHeader>
                  <CardTitle>Active Disputes</CardTitle>
                  <CardDescription>
                    Review and respond to claims made against your deposits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Amount Claimed</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {claims
                        .filter((claim) => claim.status === "Pending")
                        .map((claim) => (
                          <TableRow key={claim.id}>
                            <TableCell>{claim.property}</TableCell>
                            <TableCell>${claim.amount}</TableCell>
                            <TableCell>{claim.reason}</TableCell>
                            <TableCell>
                              <Badge variant="warning">Pending</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAcceptClaim(claim.id)}
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRejectClaim(claim.id)}
                                >
                                  Reject
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewClaim(claim)}
                                >
                                  Details
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="claims">
              <Card>
                <CardHeader>
                  <CardTitle>Claim History</CardTitle>
                  <CardDescription>
                    View the history of all claims made against your deposits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Amount Claimed</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {claims.map((claim) => (
                        <TableRow key={claim.id}>
                          <TableCell>{claim.property}</TableCell>
                          <TableCell>${claim.amount}</TableCell>
                          <TableCell>{claim.reason}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                claim.status === "Pending"
                                  ? "yellow"
                                  : claim.status === "Accepted"
                                    ? "green"
                                    : "red"
                              }
                            >
                              {claim.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewClaim(claim)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {selectedDeposit && (
            <Dialog
              open={!!selectedDeposit}
              onOpenChange={() => setSelectedDeposit(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deposit Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="property" className="text-right">
                      Property
                    </Label>
                    <Input
                      id="property"
                      value={selectedDeposit.property}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="host" className="text-right">
                      Host
                    </Label>
                    <Input
                      id="host"
                      value={selectedDeposit.host}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      value={`$${selectedDeposit.amount}`}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Input
                      id="status"
                      value={selectedDeposit.status}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dates" className="text-right">
                      Booking Dates
                    </Label>
                    <Input
                      id="dates"
                      value={selectedDeposit.bookingDates}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDeposit(null)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {selectedClaim && (
            <Dialog
              open={!!selectedClaim}
              onOpenChange={() => setSelectedClaim(null)}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Claim Details</DialogTitle>
                  <DialogDescription>
                    View claim details and submit a dispute if necessary.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="claim-amount" className="text-right">
                      Amount Claimed
                    </Label>
                    <Input
                      id="claim-amount"
                      value={`$${selectedClaim.amount}`}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="claim-reason" className="text-right">
                      Reason
                    </Label>
                    <Input
                      id="claim-reason"
                      value={selectedClaim.reason}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="claim-status" className="text-right">
                      Status
                    </Label>
                    <Input
                      id="claim-status"
                      value={selectedClaim.status}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="claim-evidence" className="text-right">
                      Host Evidence
                    </Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input
                        id="claim-evidence"
                        value={selectedClaim.evidence}
                        readOnly
                      />
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
                {selectedClaim.status === "Pending" && (
                  <form onSubmit={handleDisputeClaim}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dispute-reason" className="text-right">
                          Dispute Reason
                        </Label>
                        <Textarea
                          id="dispute-reason"
                          placeholder="Explain why you're disputing this claim"
                          className="col-span-3"
                          value={disputeReason}
                          onChange={(e) => setDisputeReason(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Evidence</Label>
                        <div className="col-span-3 flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleUploadEvidence}
                          >
                            <CameraIcon className="mr-2 h-4 w-4" />
                            Upload Photos
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleUploadEvidence}
                          >
                            <FileTextIcon className="mr-2 h-4 w-4" />
                            Upload Documents
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleContactHost}
                      >
                        <MessageSquareIcon className="mr-2 h-4 w-4" />
                        Contact Host
                      </Button>
                      <div>
                        <Button
                          type="button"
                          variant="secondary"
                          className="mr-2"
                          onClick={() => setSelectedClaim(null)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Submit Dispute</Button>
                      </div>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      ) : (
        <EmptyStateValue
          title="You have no current deposits"
          description="Security deposits you made will show up here."
          redirectTitle="Start Searching"
          href="/"
        >
          <MyTripsEmptySvg />
        </EmptyStateValue>
      )}
    </div>
  );
}

export default SecurityDepositOverview;
