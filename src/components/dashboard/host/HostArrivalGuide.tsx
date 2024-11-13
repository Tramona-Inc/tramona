import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CheckInMethodDialog from "./CheckInMethodDialog";
import CheckOutDialog from "./CheckOutDialog";
import { useState } from "react";
import HouseRulesDialog from "./HouseRulesDialog";
import InteractionPreferencesDialog from "./InteractionPreferencesDialog";
import DirectionsDialog from "./DirectionsDialog";

export default function HostArrivalGuide() {
  const [activeDialog, setActiveDialog] = useState<number | null>(null);

  const guides = [
    {
      title: "Check in method",
      subtitle: "How do travelers get in?",
      dialog: <CheckInMethodDialog />,
    },
    {
      title: "Check out instructions",
      subtitle: "What should travelers do before they check out?",
      dialog: <CheckOutDialog />,
    },
    {
      title: "House rules",
      subtitle: "What are the rules of your property?",
      dialog: <HouseRulesDialog />,
    },
    {
      title: "Interaction preferences",
      subtitle: "Add details",
      dialog: <InteractionPreferencesDialog />,
    },
    {
      title: "Directions",
      subtitle: "Add details",
      dialog: <DirectionsDialog />,
    },
    {
      title: "WiFi Details",
      subtitle: "Add details",
      dialog: <CheckInMethodDialog />,
    },
    {
      title: "House manual",
      subtitle: "Add details",
      dialog: <CheckInMethodDialog />,
    },
  ];

  return (
    <div className="h-screen-minus-header-n-footer space-y-4 overflow-y-auto pb-16 pt-6">
      {guides.map((guide, index) => (
        <Dialog
          key={index}
          open={activeDialog === index}
          onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}
        >
          <DialogTrigger
            className="w-full text-start"
            onClick={() => setActiveDialog(index)}
          >
            <div className="space-y-2 rounded-xl border p-3">
              <h2 className="font-bold">{guide.title}</h2>
              <p className="text-muted-foreground">{guide.subtitle}</p>
            </div>
          </DialogTrigger>
          <DialogContent>{guide.dialog}</DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
