import { plural } from "@/utils/utils";
import { BedSingle, BedDouble } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Bedroom {
  twin: number;
  full: number;
  queen: number;
  king: number;
}

interface BedsScrollableProps {
  bedrooms: Bedroom[];
}

export function BedsScrollable({ bedrooms }: BedsScrollableProps) {
  return (
    <div className="-mb-2 flex w-full max-w-full">
      <div className="mt-4 overflow-x-auto">
        <div className="mt-4 flex w-max flex-row space-x-8 pb-4">
          {bedrooms.map((bedroom, index) => (
            <BedsCard key={index} bedroom={bedroom} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface BedsCardProps {
  bedroom: Bedroom;
  index: number;
}

function BedsCard({ bedroom, index }: BedsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const bedSummary = getBedSummary(bedroom);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex h-[160px] cursor-pointer flex-col items-center space-y-3 rounded-xl border border-[#DDDDDD] p-6 w-[140px] sm:w-[165px] md:w-[170px] lg:w-[200px] xl:w-[200px] 2xl:w-[253px]">
          {bedroom.king > 0 || bedroom.queen > 0 ? (
            <BedDouble className="size-7" />
          ) : (
            <div className="flex flex-row mt-1">
              <BedSingle className="" />
              <BedSingle className="-ml-[2.5px]" />
            </div>
          )}
          <div className="text-base font-bold">Bedroom {index + 1}</div>
          <div className="text-base text-[#606161]">
            {bedSummary}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bedroom {index + 1}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {bedroom.king > 0 && (
            <div className="text-base">{plural(bedroom.king, "King bed")}</div>
          )}
          {bedroom.queen > 0 && (
            <div className="text-base">{plural(bedroom.queen, "Queen bed")}</div>
          )}
          {bedroom.full > 0 && (
            <div className="text-base">{plural(bedroom.full, "Full bed")}</div>
          )}
          {bedroom.twin > 0 && (
            <div className="text-base">{plural(bedroom.twin, "Twin bed")}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getBedSummary(bedroom: Bedroom): string {
  if (bedroom.king > 0) {
    return `${plural(bedroom.king, "King bed")}${hasOtherBeds(bedroom, 'king') ? '...' : ''}`;
  }
  if (bedroom.queen > 0) {
    return `${plural(bedroom.queen, "Queen bed")}${hasOtherBeds(bedroom, 'queen') ? '...' : ''}`;
  }
  if (bedroom.full > 0) {
    return `${plural(bedroom.full, "Full bed")}${hasOtherBeds(bedroom, 'full') ? '...' : ''}`;
  }
  if (bedroom.twin > 0) {
    return `${plural(bedroom.twin, "Twin bed")}`;
  }
  return 'No beds';
}

function hasOtherBeds(bedroom: Bedroom, excludeType: keyof Bedroom): boolean {
  const bedTypes: (keyof Bedroom)[] = ['king', 'queen', 'full', 'twin'];
  return bedTypes.some(type => type !== excludeType && bedroom[type] > 0);
}