import React from "react";
import { api } from "@/utils/api";
import { type Property } from "@/server/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { DollarSign, InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";

function HostSecurityDepositSection({ property }: { property: Property }) {
  const updateSecurityDepositAmount =
    api.properties.updatePropertySecurityDepositAmount.useMutation();

  const [customAmount, setCustomAmount] = useState<number>(
    property.currentSecurityDeposit / 100,
  );

  const handleDepositChange = (amount: number | undefined) => {
    if (!amount) return;
    setCustomAmount(amount);
  };

  const handleSubmit = async () => {
    await updateSecurityDepositAmount.mutateAsync({
      propertyId: property.id,
      amount: customAmount * 100, //becuase in cents
    });
  };

  if (updateSecurityDepositAmount.isSuccess) {
    toast({
      title: "Deposit Updated",
      description: `Deposit for ${property.name} set to $${customAmount}.`,
    });
  }

  return (
    <Card className="border shadow-none">
      <CardHeader>
        <CardTitle>Property-Specific Security Deposit</CardTitle>
        <CardDescription>
          Set custom security deposit amounts for each of your properties
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p>{property.name}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="deposit-amount">Security Deposit Amount</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Set the security deposit amount for the selected property.
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
              step={5}
              onChange={(e) => handleDepositChange(Number(e.target.value))}
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
  );
}

export default HostSecurityDepositSection;
