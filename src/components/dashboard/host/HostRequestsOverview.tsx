import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BriefcaseIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function HostRequestsOverview({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BriefcaseIcon />
          <CardTitle>Incoming Requests</CardTitle>
          <div className="flex-1" />
          <Button variant="ghost" asChild>
            <Link href="/host/requests">
              See all
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-2 rounded-lg border p-4">
          <MapPinIcon className="text-muted-foreground" />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <p className="text-xl font-semibold">Orlando, FL, USA</p>
            </div>
            <div className="flex gap-1">
              <Badge variant="secondary" size="sm">
                4 requests
              </Badge>
              <Badge variant="secondary" size="sm">
                1 bid
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
