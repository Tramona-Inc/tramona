import { cn } from "@/utils/utils";
import { useState } from "react";
import DialogCancelSave from "./DialogCancelSave";

export default function InteractionPreferencesDialog() {
  const [selectedMethodIndex, setSelectedMethodIndex] = useState<number | null>(
    null,
  );

  const interactions = [
    {
      title:
        "I won't be available in person, and prefer communicating through the app.",
    },
    {
      title: "I like to say hello in person, but keep to myself otherwise.",
    },
    {
      title: "I like socializing and spending time with guests.",
    },
    {
      title: "No preferences - I follow my guests' lead.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Interaction preferences</h1>
        <p className="text-muted-foreground">Add details</p>
      </div>
      <div className="space-y-4">
        {interactions.map((interaction, index) => (
          <div
            className={cn(
              selectedMethodIndex === index ? "bg-zinc-100" : "bg-white",
              "rounded-xl border p-3 hover:cursor-pointer hover:bg-zinc-100",
            )}
            key={index}
            onClick={() => setSelectedMethodIndex(index)}
          >
            <h2 className="font-semibold">{interaction.title}</h2>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground">
        Available throughout the booking process
      </p>
      <DialogCancelSave />
    </div>
  );
}
