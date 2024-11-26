import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SidebarCity from "./sidebars/SideBarCity";
import SidebarRequestToBook from "./sidebars/SideBarRequestToBook";
// ---------- MAIN LAYOUT COMPONENT ----------
export default function HostRequestsLayout({
  children,
}: React.PropsWithChildren) {
  // ---------- TABS ----------
  const router = useRouter();
  const { query } = router;
  const [activeTab, setActiveTab] = useState<"city" | "property-bids">(
    "city",
  );

  // Set activeTab based on URL query when the component mounts
  useEffect(() => {
    if (query.tabs === "property-bids") {
      setActiveTab("property-bids");
    } else {
      setActiveTab("city");
    }
  }, [query.tabs]);

  const handleTabChange = (tab: "city" | "property-bids") => {
    setActiveTab(tab);
    void router.push({
      pathname: "/host/requests",
      query: { tabs: tab === "property-bids" ? "property-bids" : "city" },
    });
  };

  //---------- STATE ----------

  const [selectedOption, setSelectedOption] = useState<
    "normal" | "outsidePriceRestriction" | "sent"
  >("normal");

  return (
    <div className="flex bg-white">
      {/* ---------- SIDEBAR ---------- */}
      <div className="sticky top-20 h-screen-minus-header-n-footer w-full overflow-auto border-r px-4 py-8 xl:w-96">
        <ScrollArea className="h-1/2">
          <div className="pb-4">
            <h1 className="text-3xl font-bold">Requests</h1>

            {/* Tab Navigation */}
            <div className="mt-6 border-b">
              <div className="flex w-full">
                <button
                  onClick={() => handleTabChange("city")}
                  className={`text-md relative flex-1 pb-4 font-medium transition-colors ${
                    activeTab === "city"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  City Requests
                  {activeTab === "city" && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-primaryGreen" />
                  )}
                </button>
                <button
                  onClick={() => handleTabChange("property-bids")}
                  className={`text-md relative flex-1 pb-4 font-medium transition-colors ${
                    activeTab === "property-bids"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Property Bids
                  {activeTab === "property-bids" && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-primaryGreen" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          {activeTab === "city" ? (
            <SidebarCity selectedOption={selectedOption} />
          ) : (
            <SidebarRequestToBook />
          )}
        </ScrollArea>
      </div>

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <div className="hidden flex-1 bg-[#fafafa] xl:block">
        {children ? (
          <div className="pb-30 px-4 pt-8">
            <div className="mx-auto max-w-5xl">
              <div className="mb-4 flex flex-row justify-between">
                <div className="flex gap-2">
                  <Button
                    variant={selectedOption === "normal" ? "primary" : "white"}
                    className="rounded-full shadow-md"
                    onClick={() => {
                      setSelectedOption("normal");
                    }}
                  >
                    Primary
                  </Button>
                  <Button
                    variant={
                      selectedOption === "sent"
                        ? "primary"
                        : "white"
                    }
                    className="rounded-full shadow-md"
                    onClick={() => {
                      setSelectedOption("sent");
                    }}
                  >
                    Sent
                  </Button>
                </div>
                <Button
                  variant={
                    selectedOption === "outsidePriceRestriction"
                      ? "primary"
                      : "white"
                  }
                  className="rounded-full shadow-md"
                  onClick={() => {
                    setSelectedOption("outsidePriceRestriction");
                  }}
                >
                  Other
                </Button>
              </div>
              {children}
            </div>
          </div>
        ) : (
          // Empty State for Main Content
          <div className="flex h-[calc(100vh-280px)] flex-col items-center justify-center gap-2">
            <h2 className="text-xl font-semibold">No requests found</h2>
            <p className="text-center text-muted-foreground">
              Consider loosen requirements or allow for more ways to book to see
              more requests.
            </p>
            <Button variant="secondary" className="mt-4">
              Change requirements
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
