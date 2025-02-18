import { Label } from "@/components/ui/label";

export default function CalendarLegend() {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center gap-x-2">
        <div
          className="h-6 w-6"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, red, red 1px, transparent 1px, transparent 4px)",
            backgroundSize: "4px 4px",
          }}
        />
        <Label className="text-sm font-semibold">Synced with Airbnb</Label>
      </div>
      <div className="flex items-center gap-x-2">
        <div
          className="h-6 w-6"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, blue, blue 1px, transparent 1px, transparent 4px)",
            backgroundSize: "4px 4px",
          }}
        />
        <Label className="text-sm font-semibold">
          <div className="flex items-center gap-x-1">
            Booked on Tramona
            <span className="text-xs text-muted-foreground">(Not Synced with Airbnb Yet)</span>
          </div>
        </Label>
      </div>
    </div>
  );
}
