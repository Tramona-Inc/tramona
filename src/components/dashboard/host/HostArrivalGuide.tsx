import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CheckInMethodDialog from "./CheckInMethodDialog";
import CheckOutDialog from "./CheckOutDialog";
import { useState } from "react";
import HouseRulesDialog from "./HouseRulesDialog";
import InteractionPreferencesDialog from "./InteractionPreferencesDialog";
import DirectionsDialog from "./DirectionsDialog";
import WifiDialog from "./WifiDialog";
import HouseManualDialog from "./HouseManualDialog";
import { Property } from "@/server/db/schema";

export default function HostArrivalGuide({ property }: { property: Property }) {
  const [activeDialog, setActiveDialog] = useState<number | null>(null);

  const guides = [
    // {
    //   title: "Check in method",
    //   subtitle: "How do travelers get in?",
    //   dialog: <CheckInMethodDialog />,
    // },
    {
      title: "Check out instructions",
      subtitle: "What should travelers do before they check out?",
      dialog: <CheckOutDialog property={property} />,
    },
    {
      title: "House rules",
      subtitle: "What are the rules of your property?",
      dialog: <HouseRulesDialog property={property} />,
    },
    {
      title: "Interaction preferences",
      subtitle: "Add details",
      dialog: <InteractionPreferencesDialog property={property} />,
    },
    {
      title: "Directions",
      subtitle: "Add details",
      dialog: <DirectionsDialog property={property} />,
    },
    {
      title: "WiFi Details",
      subtitle: "Add details",
      dialog: <WifiDialog property={property} />,
    },
    {
      title: "House manual",
      subtitle: "Add details",
      dialog: <HouseManualDialog property={property} />,
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
