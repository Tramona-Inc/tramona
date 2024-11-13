import { Input } from "@/components/ui/input";
import DialogCancelSave from "./DialogCancelSave";

export default function WifiDialog() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Wifi Details</h1>
        <p className="text-muted-foreground">Add details</p>
      </div>
      <div>
        <h2 className="font-semibold">Wifi network name</h2>
        <Input placeholder="Enter WiFi network name" />
      </div>
      <div>
        <h2 className="font-semibold">Wifi password</h2>
        <Input placeholder="Enter WiFi password" />
      </div>
      <div className="space-y-4 text-muted-foreground">
        <p>
          This information will be shared with guests 24-48 hours before
          check-in
        </p>
        <p>Shared 24 to 48 hours before check-in</p>
      </div>

      <DialogCancelSave />
    </div>
  );
}
