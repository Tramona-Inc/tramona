import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { EditableFee } from "@/components/settings/EditableFee";

interface HostFeeTabProps {
  handleSaveCleaningFee: (value: number) => void;
  handleSavePetFee: (value: number) => void;
  handleSaveExtraGuestFee: (value: number) => void;
}

export default function HostFeeTab({
  handleSaveCleaningFee,
  handleSavePetFee,
  handleSaveExtraGuestFee,
}: HostFeeTabProps) {
  const [feesOpen, setFeesOpen] = useState(false);
  const [cleaningFee, setCleaningFee] = useState(100);
  const [petFee, setPetFee] = useState(0);
  const [extraGuestFee, setExtraGuestFee] = useState(0);

  const handleCleaningFeeSave = (value: number) => {
    setCleaningFee(value);
    handleSaveCleaningFee(value);
  };

  const handlePetFeeSave = (value: number) => {
    setPetFee(value);
    handleSavePetFee(value);
  };

  const handleExtraGuestFeeSave = (value: number) => {
    setExtraGuestFee(value);
    handleSaveExtraGuestFee(value);
  };

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
              subtitle="Per stay"
              value={cleaningFee}
              onSave={handleCleaningFeeSave}
              title={"Cleaning fee"}
            />
          </section>

          <section>
            <EditableFee
              title="Pet fee"
              subtitle="Per stay"
              value={petFee}
              onSave={handlePetFeeSave}
            />
          </section>

          <section>
            <EditableFee
              title="Extra guest fee"
              subtitle="Per night"
              value={extraGuestFee}
              onSave={handleExtraGuestFeeSave}
              showGuestCounter
              guestCount={1}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
