import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import HostStaysCards from "./HostStaysCards";

export default function HostStays() {
  return (
    <div>
      <h1 className="mb-10 text-4xl font-bold">Stays</h1>
      <Tabs defaultValue="currently hosting">
        <TabsList>
          <TabsTrigger value="currently hosting">Currently Hosting</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="checking out">Checking out</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="currently hosting">
          <div className="mt-8">
            <HostStaysCards />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
