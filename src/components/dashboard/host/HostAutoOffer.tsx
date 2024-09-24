import { useState } from "react";
import { type Property } from "@/server/db/schema";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

export default function HostAutoOffer({ property }: { property: Property }) {
  const [autoOfferEnabled, setAutoOfferEnabled] = useState(property.autoOfferEnabled ?? false);
  const [maxPercentOff, setMaxPercentOff] = useState(property.autoOfferMaxPercentOff?.toString() ?? "5");

  const updateAutoOfferMutation = api.properties.updateAutoOffer.useMutation();

  const handleSave = () => {
    updateAutoOfferMutation.mutate({
      id: property.id,
      autoOfferEnabled,
      autoOfferMaxPercentOff: parseFloat(maxPercentOff),
    });
  };

  return (
    <div className="my-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Auto-Offer Settings</h2>
        <Switch
          checked={autoOfferEnabled}
          onCheckedChange={setAutoOfferEnabled}
        />
      </div>
        <p className="text-sm text-muted-foreground">
            Automatically send offers to guests who have requested a price within a designated percent of this property's price on Airbnb.
        </p>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Maximum Percent Off Airbnb Price</label>
        <Input
          type="number"
          value={maxPercentOff}
          suffix="% off"
          onChange={(e) => setMaxPercentOff(e.target.value)}
          disabled={!autoOfferEnabled}
          min="0"
          max="100"
          step="0.1"
        />
      </div>
      <Button onClick={handleSave} disabled={!autoOfferEnabled}>
        Save Auto-Offer Settings
      </Button>
    </div>
  );
}