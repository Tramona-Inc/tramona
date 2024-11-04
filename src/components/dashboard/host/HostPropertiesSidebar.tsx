import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/utils/utils";
import { ReactNode } from "react";

export default function HostPropertiesSidebar({
  className,
  onClose,
  children,
}: {
  onClose?: () => void;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn(className, "fixed inset-0 z-50 h-screen")}>
      <div className="flex h-full">
        <div className="flex-1 bg-black/25" onClick={onClose}></div>
        <div className="relative h-full basis-5/12 bg-white p-4">
          <Button
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-transparent text-black"
          >
            <X />
          </Button>
          {children}
        </div>
      </div>
    </div>
  );
}
