import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import {
  CameraIcon,
  DollarSign,
  FileTextIcon,
  HistoryIcon,
  HomeIcon,
  InfoIcon,
  LockIcon,
} from "lucide-react";

export default function HostSecurityDepositSettings() {
  const [properties, setProperties] = useState([
    { id: 1, name: "Seaside Apartment", deposit: 500 },
    { id: 2, name: "Mountain Chalet", deposit: 1000 },
    { id: 3, name: "City Loft", deposit: 750 },
  ]);
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);
  const [customAmount, setCustomAmount] = useState(selectedProperty.deposit);
  const [globalDefault, setGlobalDefault] = useState(false);
  const [globalDefaultAmount, setGlobalDefaultAmount] = useState(500);
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);

  const [depositHistory, setDepositHistory] = useState([
    { date: "2023-05-15", amount: 500, property: "Seaside Apartment" },
    { date: "2023-06-01", amount: 1000, property: "Mountain Chalet" },
    { date: "2023-06-10", amount: 750, property: "City Loft" },
  ]);

  const [depositManagement, setDepositManagement] = useState([
    {
      id: 1,
      property: "Seaside Apartment",
      amount: 500,
      status: "Held",
      guest: "John Doe",
    },
    {
      id: 2,
      property: "Mountain Chalet",
      amount: 1000,
      status: "Released",
      guest: "Jane Smith",
    },
    {
      id: 3,
      property: "City Loft",
      amount: 750,
      status: "Claimed",
      guest: "Bob Johnson",
    },
  ]);

  const [claimStatus, setClaimStatus] = useState([
    {
      id: 1,
      property: "Seaside Apartment",
      amount: 200,
      status: "In Review",
      guest: "John Doe",
    },
    {
      id: 2,
      property: "Mountain Chalet",
      amount: 500,
      status: "Submitted",
      guest: "Jane Smith",
    },
  ]);

  const [claimHistory, setClaimHistory] = useState([
    {
      id: 1,
      property: "Seaside Apartment",
      amount: 200,
      status: "Resolved",
      guest: "John Doe",
      date: "2023-05-20",
      resolution: "Approved",
    },
    {
      id: 2,
      property: "Mountain Chalet",
      amount: 500,
      status: "Rejected",
      guest: "Jane Smith",
      date: "2023-06-05",
      resolution: "Insufficient evidence",
    },
  ]);

  useEffect(() => {
    if (globalDefault) {
      setProperties((prevProperties) =>
        prevProperties.map((p) => ({ ...p, deposit: globalDefaultAmount })),
      );
      setCustomAmount(globalDefaultAmount);
    }
  }, [globalDefault, globalDefaultAmount]);

  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find((p) => p.id.toString() === propertyId);
    if (property) {
      setSelectedProperty(property);
      setCustomAmount(property.deposit);
    }
  };

  const handleDepositChange = (amount: number) => {
    setCustomAmount(amount);
    setProperties((prevProperties) =>
      prevProperties.map((p) =>
        p.id === selectedProperty.id ? { ...p, deposit: amount } : p,
      ),
    );
    setDepositHistory((prevHistory) => [
      {
        date: new Date().toISOString().split("T")[0],
        amount,
        property: selectedProperty.name,
      },
      ...prevHistory,
    ]);
    toast({
      title: "Deposit Updated",
      description: `Deposit for ${selectedProperty.name} set to $${amount}.`,
    });
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setDepositManagement((prevState) =>
      prevState.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
    simulateEmailNotification(id, newStatus);
  };

  const simulateEmailNotification = (id: number, status: string) => {
    const deposit = depositManagement.find((item) => item.id === id);
    if (deposit) {
      toast({
        title: "Email Notification Sent",
        description: `Deposit status for ${deposit.property} has been updated to ${status}.`,
      });
    }
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceUploaded) {
      toast({
        title: "Evidence Required",
        description:
          "Please upload at least one piece of evidence before submitting the claim.",
        variant: "destructive",
      });
      return;
    }
    // Proceed with claim submission
    toast({
      title: "Claim Submitted",
      description: "Your claim has been successfully submitted for review.",
    });
    setEvidenceUploaded(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Host Dashboard: Security Deposit Settings
      </h1>
      <Tabs defaultValue="claims" className="space-y-4">
        <TabsList>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="claim-status">Claim Status</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Property-Specific Security Deposit</CardTitle>
                <CardDescription>
                  Set custom security deposit amounts for each of your
                  properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="property-select">Select Property</Label>
                  <Select
                    onValueChange={handlePropertyChange}
                    value={selectedProperty.id.toString()}
                  >
                    <SelectTrigger id="property-select">
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem
                          key={property.id}
                          value={property.id.toString()}
                        >
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="deposit-amount">
                      Security Deposit Amount
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Set the security deposit amount for the selected
                            property.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="text-muted-foreground" />
                    <Input
                      id="deposit-amount"
                      type="number"
                      value={customAmount}
                      onChange={(e) =>
                        handleDepositChange(Number(e.target.value))
                      }
                      className="w-24"
                    />
                  </div>
                  <Slider
                    value={[customAmount]}
                    onValueChange={([value]) => handleDepositChange(value)}
                    max={2000}
                    step={50}
                    className="w-[200px]"
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Global Default Settings</CardTitle>
                <CardDescription>
                  Set a default deposit for all properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="global-default"
                    checked={globalDefault}
                    onCheckedChange={setGlobalDefault}
                  />
                  <Label htmlFor="global-default">
                    Enable global default deposit
                  </Label>
                </div>
                {globalDefault && (
                  <div className="space-y-2">
                    <Label htmlFor="global-amount">Global Default Amount</Label>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="text-muted-foreground" />
                      <Input
                        id="global-amount"
                        type="number"
                        value={globalDefaultAmount}
                        onChange={(e) =>
                          setGlobalDefaultAmount(Number(e.target.value))
                        }
                        className="w-24"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Adjustment History</CardTitle>
              <CardDescription>
                View the history of changes to deposit amounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depositHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.property}</TableCell>
                      <TableCell>${item.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="management">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Management</CardTitle>
              <CardDescription>
                View and manage security deposits for your properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depositManagement.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.property}</TableCell>
                      <TableCell>{item.guest}</TableCell>
                      <TableCell>${item.amount}</TableCell>
                      <TableCell>
                        <Select
                          value={item.status}
                          onValueChange={(value) =>
                            handleStatusChange(item.id, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue>{item.status}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Held">Held</SelectItem>
                            <SelectItem value="Released">Released</SelectItem>
                            <SelectItem value="Claimed">Claimed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
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
        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Claim</CardTitle>
              <CardDescription>
                File a claim against a security deposit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="claim-property">Property</Label>
                  <Select>
                    <SelectTrigger id="claim-property">
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem
                          key={property.id}
                          value={property.id.toString()}
                        >
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claim-amount">Claim Amount</Label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="text-muted-foreground" />
                    <Input
                      id="claim-amount"
                      type="number"
                      placeholder="Enter claim amount"
                      className="w-24"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claim-reason">Reason for Claim</Label>
                  <Textarea
                    id="claim-reason"
                    placeholder="Describe the reason for your claim"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Evidence</Label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEvidenceUploaded(true)}
                    >
                      <CameraIcon className="mr-2 h-4 w-4" />
                      Upload Photos
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEvidenceUploaded(true)}
                    >
                      <FileTextIcon className="mr-2 h-4 w-4" />
                      Upload Receipts
                    </Button>
                  </div>
                </div>

                <Button type="submit">Submit Claim</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="claim-status">
          <Card>
            <CardHeader>
              <CardTitle>Claim Status</CardTitle>
              <CardDescription>
                Track the status of your submitted claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claimStatus.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.property}</TableCell>
                      <TableCell>{item.guest}</TableCell>
                      <TableCell>${item.amount}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Claim History</CardTitle>
              <CardDescription>
                View the history of all past claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resolution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claimHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.property}</TableCell>
                      <TableCell>{item.guest}</TableCell>
                      <TableCell>${item.amount}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.resolution}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
