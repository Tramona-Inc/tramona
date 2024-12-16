import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { AdjustedPropertiesProvider } from "@/components/landing-page/search/AdjustedPropertiesContext";
import { DesktopSearchTab } from "@/components/landing-page/search/DesktopSearchTab";
import UnclaimedMap from "@/components/unclaimed-offers/UnclaimedMap";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <DashboardLayout>
      {/* Main scrolling container */}
      <div className="relative h-screen overflow-y-auto">
        {/* Sticky header */}
        <AdjustedPropertiesProvider>
          <div
            className={`sticky top-0 z-20 w-full border-b-2 transition-all duration-300 ease-in-out ${
              isScrolled
                ? "border-white bg-white shadow-md"
                : "border-transparent bg-white"
            }`}
          >
            <DesktopSearchTab
              isCompact={isScrolled}
              handleTabChange={() => {
                return;
              }}
              isLandingPage={false}
            />
          </div>

          {/* Scrollable content */}
          <div className="">
            <UnclaimedMap />
          </div>
        </AdjustedPropertiesProvider>
      </div>
    </DashboardLayout>
  );
}
