import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { TabsContent } from "@radix-ui/react-tabs";
import { Grid, Plus, Search } from "lucide-react";
import HostProperties from "./HostProperties";

export default function HostPropertiesHome() {
  const { data: properties } = api.properties.getHostProperties.useQuery();

  const listedProperties = properties?.filter(
    (property) => property.propertyStatus === "Listed",
  );
  const archivedProperties = properties?.filter(
    (property) => property.propertyStatus === "Archived",
  );
  const draftedProperties = properties?.filter(
    (property) => property.propertyStatus === "Drafted",
  );

  return (
    <section className="mx-auto my-14 max-w-7xl px-6">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Your properties</h1>
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            className="rounded-full bg-white font-bold text-black shadow-xl"
          >
            <Search strokeWidth={2} />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-white font-bold text-black shadow-xl"
          >
            <Grid strokeWidth={2} />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-white font-bold text-black shadow-xl"
          >
            <Plus strokeWidth={2} />
          </Button>
        </div>
      </div>

      <Tabs className="mt-6" defaultValue="listed">
        <TabsList>
          <TabsTrigger value="listed">Listed</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="listed">
          <HostProperties properties={listedProperties ?? null} />
        </TabsContent>
        <TabsContent value="drafts">
          <HostProperties properties={draftedProperties ?? null} />
        </TabsContent>
        <TabsContent value="archived">
          <HostProperties properties={archivedProperties ?? null} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
