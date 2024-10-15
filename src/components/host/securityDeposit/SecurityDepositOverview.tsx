import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { DollarSign, InfoIcon } from "lucide-react";
import type { Property } from "@/server/db/schema";

import { api } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/utils";
import { getQueryKey } from "@trpc/react-query";

export default function SecurityDepositOverview() {
  const queryClient = useQueryClient();
  const { data: hostProperties } = api.properties.getHostProperties.useQuery();

  const updateSecurityDepositAmount =
    api.properties.updatePropertySecurityDepositAmount.useMutation();

  const [selectedProperty, setSelectedProperty] = useState<null | Property>(
    hostProperties ? hostProperties[0]! : null,
  );

  const [customAmount, setCustomAmount] = useState<number>(0);

  //   const [globalDefault, setGlobalDefault] = useState(false);
  //   const [globalDefaultAmount, setGlobalDefaultAmount] = useState(500);

  //   useEffect(() => {
  //     if (globalDefault) {
  //       setProperties((prevProperties) =>
  //         prevProperties.map((p) => ({ ...p, deposit: globalDefaultAmount })),
  //       );
  //       setCustomAmount(globalDefaultAmount);
  //     }
  //   }, [globalDefault, globalDefaultAmount]);

  useEffect(() => {
    console.log(selectedProperty);
    if (selectedProperty === null) {
      setCustomAmount(0);
    }
  }, [selectedProperty]);

  const handlePropertyChange = (propertyId: string) => {
    const property = hostProperties?.find(
      (p) => p.id.toString() === propertyId,
    );
    console.log(property);
    if (property) {
      setSelectedProperty(property);
      setCustomAmount(property.currentSecurityDeposit / 100);
    }
  };

  const handleDepositChange = (amount: number | undefined) => {
    if (!amount) return;
    setCustomAmount(amount);
  };

  const handleSubmit = async () => {
    if (selectedProperty) {
      await updateSecurityDepositAmount.mutateAsync({
        propertyId: selectedProperty.id,
        amount: customAmount * 100, //becuase in cents
      });
    }
    const getPropertiesQueryKey = getQueryKey(api.properties.getHostProperties);
    await queryClient.invalidateQueries(getPropertiesQueryKey);

    if (updateSecurityDepositAmount.isSuccess) {
      toast({
        title: "Deposit Updated",
        description: `Deposit for ${selectedProperty?.name} set to $${customAmount}.`,
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Host Dashboard: Security Deposit Settings
      </h1>
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Property Security Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              {hostProperties ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead className="text-right">
                        Security Deposit Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hostProperties.map((property, index) => (
                      <TableRow key={index}>
                        <TableCell>{property.name}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(property.currentSecurityDeposit)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
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
                  {hostProperties && (
                    <Select
                      onValueChange={handlePropertyChange}
                      defaultValue={
                        selectedProperty
                          ? selectedProperty.id.toString()
                          : hostProperties[0]!.id.toString()
                      }
                    >
                      <SelectTrigger id="property-select">
                        <SelectValue placeholder="Select a property" />
                      </SelectTrigger>
                      <SelectContent>
                        {hostProperties.map((property) => (
                          <SelectItem
                            key={property.id}
                            value={property.id.toString()}
                          >
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
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
                      disabled={selectedProperty === null}
                      step={5}
                      onChange={(e) =>
                        handleDepositChange(Number(e.target.value))
                      }
                      className="w-24"
                    />
                  </div>
                  <div className="flex w-full flex-row justify-between">
                    <Slider
                      value={[customAmount]}
                      onValueChange={([value]) => handleDepositChange(value)}
                      max={2000}
                      step={10}
                      className="[data-disabled]:cursor-not-allowed w-[200px]"
                      disabled={selectedProperty === null}
                    />
                    <Button onClick={handleSubmit}>
                      {!updateSecurityDepositAmount.isLoading
                        ? "Update Deposit"
                        : "Updating..."}
                    </Button>
                  </div>
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
                {/* <div className="flex items-center space-x-2">
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
                )} */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
