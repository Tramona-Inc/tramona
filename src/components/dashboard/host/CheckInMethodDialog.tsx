import { cn } from "@/utils/utils";
import { useState } from "react";
import DialogCancelSave from "./DialogCancelSave";
import { Textarea } from "@/components/ui/textarea";

export default function CheckInMethodDialog() {
  const [selectedMethodIndex, setSelectedMethodIndex] = useState<number | null>(
    null,
  );

  const methods = [
    {
      title: "Smart lock",
      subtitle: "Guests will use a code or app to open a wifi-connected lock.",
    },
    {
      title: "Keypad",
      subtitle:
        "Guests will use the code you provide to open an electronic lock.",
    },
    {
      title: "Lockbox",
      subtitle:
        "Guests will use a code you provide to open a small safe that has a key inside.",
    },
    {
      title: "Building staff",
      subtitle: "Someone will be available 24 hours a day to let guests in.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Check-in method</h1>
        <p className="text-muted-foreground">How do travelers get in?</p>
      </div>
      <div className="space-y-4">
        {methods.map((method, index) => (
          <div
            className={cn(
              selectedMethodIndex === index ? "bg-zinc-100" : "bg-white",
              "rounded-xl border p-3 hover:cursor-pointer hover:bg-zinc-100",
            )}
            key={index}
            onClick={() => setSelectedMethodIndex(index)}
          >
            <h2 className="font-semibold">{method.title}</h2>
            <p className="text-muted-foreground">{method.subtitle}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="font-semibold">Additional check-in details</h2>
        <Textarea placeholder="Add any important details for getting inside your place..." />
      </div>
      <p className="text-muted-foreground">
        Shared 24 to 48 hours before check-in
      </p>
      <DialogCancelSave />
    </div>
  );
}
