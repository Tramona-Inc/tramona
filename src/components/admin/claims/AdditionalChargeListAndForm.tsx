"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import CreateAdditionalChargeForm from "@/components/admin/claims/CreateAdditionalChargeForm";
import AllPreviousTrips from "@/components/admin/claims/AllPreviousTrips";
import AllClaimItems from "@/components/admin/claims/AllClaimItems";

export default function AdditionalChargeListAndForm() {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth =
        e.clientX - (sidebarRef.current?.getBoundingClientRect().left ?? 0);
      setSidebarWidth(Math.max(200, Math.min(newWidth, 800)));
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Additional Charges Dashboard
      </h1>

      <div className="flex">
        <div className="flex-1 pr-4">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-semibold">
              Create Additional Charge
            </h2>
            <p className="mb-4 text-muted-foreground">
              Charge a traveler for damages or miscellaneous fees
            </p>
            <CreateAdditionalChargeForm />
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="mb-2 text-2xl font-semibold">Previous Trips</h2>
            <p className="mb-4 text-muted-foreground">
              Reference for creating charges
            </p>
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <AllPreviousTrips />
            </ScrollArea>
          </div>
        </div>

        <div
          ref={sidebarRef}
          className="relative flex-shrink-0"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div
            className="absolute left-0 top-0 h-full w-1 cursor-col-resize bg-border"
            onMouseDown={() => setIsResizing(true)}
          />
          <div className="h-full pl-4">
            <h2 className="mb-2 text-2xl font-semibold">Claim Items</h2>
            <p className="mb-4 text-muted-foreground">View all claim items</p>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <AllClaimItems />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
