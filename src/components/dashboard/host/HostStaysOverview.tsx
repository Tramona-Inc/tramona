import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HostStaysOverview({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Stays</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs>
          <TabsList>
            <TabsTrigger value="properties">Currently hosting 3</TabsTrigger>
            <TabsTrigger value="cities">Upcoming 5</TabsTrigger>
            <TabsTrigger value="arriving">Arriving soon 1</TabsTrigger>
            <TabsTrigger value="checking-out">Checking out</TabsTrigger>
          </TabsList>
          <TabsContent value="properties">
            <div>Properties list</div>
          </TabsContent>
          <TabsContent value="cities">
            <div>Cities list</div>
          </TabsContent>
          <TabsContent value="arriving">
            <div>Arriving list</div>
          </TabsContent>
          <TabsContent value="checking-out">
            <div>Checking out list</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
