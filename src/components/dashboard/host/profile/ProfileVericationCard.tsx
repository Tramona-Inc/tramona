import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MyUserWProfile } from "./AllFieldDialogs";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

function ProfileVericationCard({
  userWProfile,
}: {
  userWProfile: MyUserWProfile;
}) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">
          {userWProfile.user.firstName}&apos;s confirmed information
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>Identity</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>Email address</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>Phone number</span>
        </div>
        {/* <Button variant="link" className="h-auto p-0">
          Learn about identity verification
        </Button> */}
      </CardContent>
    </Card>
  );
}

export default ProfileVericationCard;
