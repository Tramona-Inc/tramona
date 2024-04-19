import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DesktopSearchBar from '../SearchBar/DesktopSearchBar';

export default function SimpleMastHead() {
  return (
    <div className="flex items-center justify-center bg-white">
      <Tabs defaultValue={"search"}>
        <TabsList noBorder className="flex items-center justify-center">
          <TabsTrigger value="search" noBorder>
            Search
          </TabsTrigger>
          <TabsTrigger value="request" noBorder>
            Request Deal
          </TabsTrigger>
        </TabsList>
        <TabsContent value={"search"}>
          <DesktopSearchBar mode="search" />
        </TabsContent>
        <TabsContent value={"request"}>
          <DesktopSearchBar mode="request" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
