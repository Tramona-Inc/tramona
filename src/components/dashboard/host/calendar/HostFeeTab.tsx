import { Property } from "@/server/db/schema/tables/properties";
import EditableFee from "./EditableFee";

export default function HostFeeTab({ property }: { property: Property }) {
  return (
    <div className="space-y-6">
      <div className="p-6">
        <EditableFee
          title="Cleaning fee"
          subtitle="Per stay"
          value={cleaningFee}
          onSave={handleSaveCleaningFee}
        />
      </div>

      <div className="p-6">
        <EditableFee
          title="Pet fee"
          subtitle="Per stay"
          value={petFee}
          onSave={handleSavePetFee}
        />
      </div>

      <div className="p-6">
        <EditableFee
          title="Extra guest fee"
          subtitle="Per night"
          value={extraGuestFee}
          onSave={handleSaveExtraGuestFee}
          showGuestCounter
          guestCount={1}
        />
      </div>
    </div>
  );
}
