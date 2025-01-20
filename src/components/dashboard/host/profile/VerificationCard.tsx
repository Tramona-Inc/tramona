import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VerificationCard() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Confirmed information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm">Identity</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm">Email address</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm">Phone number</span>
        </div>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Learn about identity verification
        </a>
      </CardContent>
    </Card>
  );
}
