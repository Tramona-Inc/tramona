import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { api } from "@/utils/api";
import { Badge } from "@/components/ui/badge";

function myClaims() {
  const { data: myClaims, isLoading } = api.claims.getMyClaims.useQuery();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "In Review":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "Resolved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return <Badge variant="yellow">Submitted</Badge>;
      case "In Review":
        return <Badge variant="yellow">In Review</Badge>;
      case "Resolved":
        return <Badge variant="green">Resolved</Badge>;
    }
  };

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="text-2xl">Recent Reports</CardTitle>
        <CardDescription>
          View the status of your recent reports and incidents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading recent claims...</p>
        ) : myClaims && myClaims.length > 0 ? (
          <ul className="space-y-4">
            {myClaims.slice(0, 5).map((claim) => (
              <li key={claim.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(claim.claimStatus!)}
                  <span>
                    Claim #{claim.superhogRequestId ?? claim.id.slice(0, 8)}
                  </span>
                </div>

                {getStatusBadge(claim.claimStatus!)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent claims found.</p>
        )}
      </CardContent>
      {myClaims && myClaims.length > 0 && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Reports
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default myClaims;
