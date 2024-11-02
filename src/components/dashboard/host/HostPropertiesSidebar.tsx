import { Property } from "@/server/db/schema";
import HostPropertyInfo from "./HostPropertyInfo";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/utils/utils";

export default function HostPropertiesSidebar({
  className,
  onClose,
  property,
}: {
  property?: Property;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div className={cn(className, "fixed inset-0 z-10 h-screen w-screen")}>
      <div className="flex h-full">
        <div className="flex-1 bg-black/25" onClick={onClose}></div>
        <div className="relative mt-28 h-full basis-5/12 bg-white p-4">
          <Button
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-transparent text-black"
          >
            <X />
          </Button>
          {property && <HostPropertyInfo property={property} />}
        </div>
      </div>
    </div>
  );
}
