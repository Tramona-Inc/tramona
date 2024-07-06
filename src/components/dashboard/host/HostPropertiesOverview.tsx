import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { EditIcon } from "lucide-react";

export default function HostPropertiesOverview({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold">Properties</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="@container">
        <div className="flex flex-col gap-4 text-lg font-semibold">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <p>Listed</p>
            <p className="text-2xl font-bold">4</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <p>Drafts</p>
            <p className="text-2xl font-bold">4</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <p>Archive</p>
            <p className="text-2xl font-bold">4</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
