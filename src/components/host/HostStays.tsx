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
          <div className="w-5/6 border-b-4" />
          <div className="flex w-1/6 justify-end ">
            <TabsTrigger value="history" className="w-full">
              History
            </TabsTrigger>
          </div>
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
