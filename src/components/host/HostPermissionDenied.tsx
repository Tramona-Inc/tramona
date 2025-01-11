import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type ErrorCode = "FORBIDDEN";

interface HostPermissionDeniedProps {
  code?: ErrorCode;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function HostPermissionDenied({
  code,
  message,
  action,
}: HostPermissionDeniedProps) {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="px-6 pb-4 pt-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {code?.replace(/_/g, " ") ?? "Access Denied"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {message ?? "You don't have permission to access this page."}
          </p>
          <p className="text-sm font-medium text-primary">
            To get access, please ask your team owner.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6 pt-2">
        {action && (
          <Button variant="primary" onClick={action.onClick} className="w-full">
            {action.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default HostPermissionDenied;
