import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import HostStaysCards from "./HostStaysCards";

export default function HostStays() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold md:mb-10 md:text-4xl">Stays</h1>
      <Tabs defaultValue="currently hosting">
        <TabsList className="mb-4 md:mb-8">
          <TabsTrigger value="currently hosting">Currently hosting</TabsTrigger>
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
          <HostStaysCards />
        </TabsContent>
        <TabsContent value="upcoming">
          <HostStaysCards />
        </TabsContent>
        <TabsContent value="accepted">
          <HostStaysCards />
        </TabsContent>
        <TabsContent value="checking out">
          <HostStaysCards />
        </TabsContent>
        <TabsContent value="history">
          <HostStaysCards />
        </TabsContent>
      </Tabs>
    </div>
  );
}
