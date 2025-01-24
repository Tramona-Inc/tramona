import React from "react";
import Link from "next/link";
import { ChevronRight, Flag, HelpCircle, ShieldCheckIcon } from "lucide-react";

function GetSupportAnytime() {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Get support anytime
        </h2>
        <p className="text-base text-muted-foreground">
          If you need help, we&apos;re available 24/7 from anywhere in the
          world.
        </p>
      </div>

      <div className="space-y-2 divide-y">
        <Link
          href="/help-center"
          className="flex items-center justify-between py-4 transition-colors hover:text-muted-foreground"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="size-5" />
            <span className="text-base">Visit the Help Center</span>
          </div>
          <ChevronRight className="size-5" />
        </Link>

        <Link
          href="/rebooking-guarantee"
          className="flex items-center justify-between py-4 transition-colors hover:text-muted-foreground"
        >
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="size-5" />
            <span className="text-base">100% Booking Guarantee</span>
          </div>
          <ChevronRight className="size-5" />
        </Link>
      </div>
    </div>
  );
}

export default GetSupportAnytime;
