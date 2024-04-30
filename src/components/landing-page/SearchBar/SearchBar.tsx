import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DesktopSearchBar from "../SearchBar/DesktopSearchBar";
// import MobileSearchBar from "./MobileSearchBar";

export default function SearchBar() {
  return (
    <>
      {/* Desktop search bar */}
      <div className="flex items-center justify-center">
        <Tabs
          defaultValue={"search"}
          className="rounded-lg border-2 border-border bg-white px-10 shadow-sm"
        >
          <TabsList noBorder className=" flex items-center justify-center">
            <TabsTrigger value="search" className="border-b-2 ">
              Search Properties
            </TabsTrigger>
            <TabsTrigger value="request" className="border-b-2">
              Request Deal
            </TabsTrigger>
          </TabsList>
          <div className="mb-5 mt-[-2px] w-full border-b-2 border-border" />
          <TabsContent value={"search"}>
            <DesktopSearchBar mode="search" />
          </TabsContent>
          <TabsContent value={"request"}>
            <DesktopSearchBar mode="request" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile search bar */}
      {/* <div className="lg:hidden">
        <MobileSearchBar />
      </div> */}
    </>
  );
}
