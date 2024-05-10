import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileSearchBar from "./MobileSearchBar";
import { useMediaQuery } from "@/components/_utils/useMediaQuery";
import DesktopSearchBar from "./DesktopSearchBar";

export default function SearchBar() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  return isMobile ? <MobileSearchLayout /> : <DesktopSearchLayout />;
}

// Path: src/components/landing-page/SearchBar/DesktopSearchBar.tsx
export function DesktopSearchLayout() {
  return (
    <div className="flex items-center justify-center">
      <Tabs
        defaultValue={"search"}
        className="rounded-3xl border-2 border-border bg-white px-10 shadow-sm"
      >
        <TabsList noBorder className="flex items-center justify-center">
          <TabsTrigger value="search" className="border-b-2 font-bold data-[state=active]:border-[#004236] data-[state=active]:text-[#004236]">
            <span className="text-sm">
              Search Properties
            </span>
          </TabsTrigger>
          <TabsTrigger value="request" className="border-b-2 font-bold data-[state=active]:border-[#004236] data-[state=active]:text-[#004236]">
            <span className="text-sm">
              Request Deal
            </span>
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
  );
}

export function MobileSearchLayout() {
  return <MobileSearchBar />;
}
