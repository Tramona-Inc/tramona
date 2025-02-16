import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CalendarSettingsDropdown({
  open,
  setOpen,
  title,
  description,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <div
      className="flex cursor-pointer items-center justify-between px-6 py-8"
      onClick={() => setOpen(!open)}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-[20px] font-bold text-black">{title}</h3>
        <h5 className="text-sm text-muted-foreground">{description}</h5>
      </div>
      <Button variant="ghost" size="sm">
        <ChevronDown
          className="h-4 w-4 transition-transform duration-300"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Button>
    </div>
  );
}
