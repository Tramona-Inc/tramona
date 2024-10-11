import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FlagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
function HostReportOverview() {
  return (
    <Card className="flex justify-center">
      <CardHeader className="">
        <CardTitle className="jus flex flex-row items-center gap-x-2">
          <FlagIcon />
          Report
        </CardTitle>
      </CardHeader>
      <CardContent className="flex w-5/6 flex-col justify-around self-center">
        <div className="max-w-sm">
          Need to report damages to your property, an issue with a traveler, or{" "}
          request a security deposit charge? File a report to start the process.
        </div>
        <Button variant="secondary">
          <Link href="/host/report">Report here</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default HostReportOverview;
