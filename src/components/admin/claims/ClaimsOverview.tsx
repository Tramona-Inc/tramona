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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import OpenNewClaimForm from "./OpenNewClaimForm";

// Mock data for claims
const mockClaims = [
  {
    id: 1,
    host: "John Doe",
    property: "Beachfront Villa",
    guest: "Alice Smith",
    amount: 250,
    status: "Pending",
    date: "2023-05-15",
    progress: 33,
  },
  {
    id: 2,
    host: "Jane Doe",
    property: "City Apartment",
    guest: "Bob Johnson",
    amount: 100,
    status: "Approved",
    date: "2023-05-14",
    progress: 100,
  },
  {
    id: 3,
    host: "Mike Smith",
    property: "Mountain Cabin",
    guest: "Carol Williams",
    amount: 500,
    status: "Denied",
    date: "2023-05-13",
    progress: 100,
  },
  {
    id: 4,
    host: "Sarah Brown",
    property: "Lakeside Cottage",
    guest: "David Miller",
    amount: 300,
    status: "Pending",
    date: "2023-05-12",
    progress: 66,
  },
  {
    id: 5,
    host: "Tom Wilson",
    property: "Downtown Loft",
    guest: "Eva Davis",
    amount: 150,
    status: "Pending",
    date: "2023-05-11",
    progress: 0,
  },
];

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    sender: "John Doe",
    recipient: "Alice Smith",
    message: "Hi Alice, there seems to be some damage to the property.",
    timestamp: "2023-05-15 10:00",
  },
  {
    id: 2,
    sender: "Alice Smith",
    recipient: "John Doe",
    message: "I'm sorry to hear that. Can you provide more details?",
    timestamp: "2023-05-15 10:30",
  },
  {
    id: 3,
    sender: "John Doe",
    recipient: "Alice Smith",
    message:
      "Sure, I've noticed scratches on the dining table and a broken vase.",
    timestamp: "2023-05-15 11:00",
  },
];

export default function AdminClaimsDashboard() {
  const [claims, setClaims] = useState(mockClaims);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isOpenClaimDialogOpen, setIsOpenClaimDialogOpen] = useState(false);
  const filteredClaims = claims.filter(
    (claim) =>
      (filterStatus === "all" || claim.status === filterStatus) &&
      (claim.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.property.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleDecision = (claimId, decision) => {
    setClaims(
      claims.map((claim) =>
        claim.id === claimId
          ? { ...claim, status: decision, progress: 100 }
          : claim,
      ),
    );
    setSelectedClaim(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "Admin",
          recipient: selectedClaim.host,
          message: newMessage,
          timestamp: new Date().toLocaleString(),
        },
      ]);
      setNewMessage("");
    }
  };

  const handleSubmitClaim = (event: HTMLFormElement) => {
    event.preventDefault();
    // In a real application, you would send this data to your backend
    console.log(
      "Claim submitted:",
      Object.fromEntries(new FormData(event.target)),
    );
    // For demonstration, we'll just close the dialog
    setSelectedClaim(null);
  };

  const claimStats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "Pending").length,
    approved: claims.filter((c) => c.status === "Approved").length,
    denied: claims.filter((c) => c.status === "Denied").length,
  };

  return (
    <div className="container mx-auto space-y-8 p-4">
      <h1 className="mb-6 text-3xl font-bold">Admin Claims Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Claims Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{claimStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Claims</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">
                {claimStats.pending}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {claimStats.approved}
              </p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">
                {claimStats.denied}
              </p>
              <p className="text-sm text-muted-foreground">Denied</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Claims Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <Label htmlFor="filter-status">Filter by Status:</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="filter-status" className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Denied">Denied</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="search">Search:</Label>
              <Input
                id="search"
                placeholder="Search by host, guest, or property"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell>{claim.id}</TableCell>
                  <TableCell>{claim.host}</TableCell>
                  <TableCell>{claim.property}</TableCell>
                  <TableCell>{claim.guest}</TableCell>
                  <TableCell>${claim.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        claim.status === "Approved"
                          ? "success"
                          : claim.status === "Denied"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {claim.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{claim.date}</TableCell>
                  <TableCell>
                    <Progress value={claim.progress} className="w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedClaim(claim)}
                        >
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Review Claim #{claim.id}</DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue="details" className="w-full">
                          <TabsList>
                            <TabsTrigger value="details">
                              Claim Details
                            </TabsTrigger>
                            <TabsTrigger value="evidence">Evidence</TabsTrigger>
                            <TabsTrigger value="communication">
                              Communication
                            </TabsTrigger>
                            <TabsTrigger value="submit">
                              Submit Claim
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="details">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Host</Label>
                                <p>{claim.host}</p>
                              </div>
                              <div>
                                <Label>Guest</Label>
                                <p>{claim.guest}</p>
                              </div>
                              <div>
                                <Label>Property</Label>
                                <p>{claim.property}</p>
                              </div>
                              <div>
                                <Label>Amount</Label>
                                <p>${claim.amount}</p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <p>{claim.status}</p>
                              </div>
                              <div>
                                <Label>Date</Label>
                                <p>{claim.date}</p>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="evidence">
                            <p>Evidence files would be displayed here.</p>
                          </TabsContent>
                          <TabsContent value="communication">
                            <div className="space-y-4">
                              <div className="h-[300px] space-y-2 overflow-y-auto rounded border p-4">
                                {messages.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`rounded p-2 ${msg.sender === "Admin" ? "ml-8 bg-blue-100" : "mr-8 bg-gray-100"}`}
                                  >
                                    <p className="font-semibold">
                                      {msg.sender}
                                    </p>
                                    <p>{msg.message}</p>
                                    <p className="text-xs text-gray-500">
                                      {msg.timestamp}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex space-x-2">
                                <Input
                                  placeholder="Type your message..."
                                  value={newMessage}
                                  onChange={(e) =>
                                    setNewMessage(e.target.value)
                                  }
                                />
                                <Button onClick={handleSendMessage}>
                                  Send
                                </Button>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="submit">
                            <form
                              onSubmit={handleSubmitClaim}
                              className="space-y-4"
                            >
                              <div>
                                <Label htmlFor="claim-amount">
                                  Claim Amount
                                </Label>
                                <Input
                                  id="claim-amount"
                                  name="amount"
                                  type="number"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="claim-description">
                                  Description of Damage
                                </Label>
                                <Textarea
                                  id="claim-description"
                                  name="description"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="claim-evidence">
                                  Evidence (Photos, Receipts)
                                </Label>
                                <Input
                                  id="claim-evidence"
                                  name="evidence"
                                  type="file"
                                  multiple
                                />
                              </div>
                              <Button type="submit">Submit Claim</Button>
                            </form>
                          </TabsContent>
                        </Tabs>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Claim Progress</Label>
                            <Progress
                              value={claim.progress}
                              className="w-[200px]"
                            />
                          </div>
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => handleDecision(claim.id, "Denied")}
                            >
                              Deny Claim
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedClaim(null)}
                            >
                              Close
                            </Button>
                            <Button
                              onClick={() =>
                                handleDecision(claim.id, "Approved")
                              }
                            >
                              Approve Claim
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
