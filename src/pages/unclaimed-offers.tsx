import MainLayout from "@/components/_common/Layout/MainLayout";
import { AdjustedPropertiesProvider } from "@/components/landing-page/search/AdjustedPropertiesContext";
import DynamicDesktopSearchBar from "@/components/landing-page/search/DynamicDesktopSearchBar";
import TestComponent from "@/components/unclaimed-offers/UnclaimedMap";
import React from "react";

export default function Page() {
  return (
    <MainLayout>
      <AdjustedPropertiesProvider>
        <div className="h-full w-full flex-col">
          <div className="sticky top-header-height z-10 flex h-searchbar-height justify-center">
            <DynamicDesktopSearchBar />
          </div>
          <div className="h-full w-full">
            <TestComponent />
          </div>
        </div>
      </AdjustedPropertiesProvider>
    </MainLayout>
  );
}
