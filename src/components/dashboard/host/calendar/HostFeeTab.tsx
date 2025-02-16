import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import EditableFee from "./EditableFee";
import { Property } from "@/server/db/schema/tables/properties";

export default function HostFeeTab({
  property,
  refetch,
}: {
  property: Property;
  refetch: () => void;
}) {
  const [feesOpen, setFeesOpen] = useState(false);

  return (
    <div className="rounded-lg border">
      <div
        className="flex cursor-pointer items-center justify-between px-6 py-8"
        onClick={() => setFeesOpen(!feesOpen)}
      >
        <h3 className="text-[20px] font-bold text-black">Fees</h3>
        <Button variant="ghost" size="sm">
          <ChevronDown
            className="h-4 w-4 transition-transform duration-300"
            style={{
              transform: feesOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          feesOpen
            ? "-mt-4 max-h-[1000px] p-6 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-8">
          <section>
            <EditableFee
              property={property}
              field="cleaningFeePerStay"
              subtitle="Per stay"
              title={"Cleaning fee"}
              refetch={refetch}
            />
          </section>

          <section>
            <EditableFee
              property={property}
              field="petFeePerStay"
              title="Pet fee"
              subtitle="Per stay"
              refetch={refetch}
            />
          </section>

          <section>
            <EditableFee
              property={property}
              field="extraGuestFeePerNight"
              title="Extra guest fee"
              subtitle="Per night"
              showGuestCounter
              refetch={refetch}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
