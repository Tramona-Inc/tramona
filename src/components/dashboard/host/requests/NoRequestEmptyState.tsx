import React from "react";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useRouter } from "next/router";

function NoRequestEmptyState() {
  const router = useRouter();
  return (
    <Card className="flex h-full items-center justify-center">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Home className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          No requests found
        </h3>
        <p className="max-w-sm text-sm text-gray-500">
          Consider looser requirements or allow for more ways to book to see
          more requests.
        </p>
        <Button
          className="mt-4"
          variant="primary"
          onClick={() => router.push("/host/calendar")}
        >
          Change Restrictions
        </Button>
      </CardContent>
    </Card>
  );
}

export default NoRequestEmptyState;
