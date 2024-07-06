import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BriefcaseIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HostRequestsOverview({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Offers and requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs>
          <TabsList>
            <TabsTrigger value="properties">Properties 5</TabsTrigger>
            <TabsTrigger value="cities">Cities 5</TabsTrigger>
          </TabsList>
          <TabsContent value="properties">
            <div>Properties list</div>
          </TabsContent>
          <TabsContent value="cities">
            <div>Cities list</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
