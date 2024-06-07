import { Input } from "@/components/ui/input";
import { DollarSign, Info } from "lucide-react";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";

export default function HostPropertiesPriceRestriction() {
  return (
    <div className="my-6">
      <div className="text-end">
        <HostPropertyEditBtn />
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Property bids</h2>
        <div className="grid grid-cols-1 items-center gap-4 rounded-xl bg-zinc-100 p-4 sm:grid-cols-2 sm:gap-6">
          <div>
            <h3 className="text-lg font-semibold">Lowest Price</h3>
            <p className="text-muted-foreground">
              You will not be notified for offers lower than this amount.
            </p>
          </div>
          <div>
            <Input className="w-full" icon={DollarSign} />
            <p className="mt-1 text-sm text-muted-foreground">
              Includes all additional fees you normally charge
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-zinc-100 p-2">
          <Info className=" text-blue-500" />
          <p className="text-xs font-semibold sm:text-base">
            Remember you can counteroffer a low offer.
          </p>
        </div>
      </div>
    </div>
  );
}
