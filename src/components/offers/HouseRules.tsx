import { formatTime } from "@/utils/utils";
import {
  PawPrint,
  CigaretteOff,
  Cigarette,
  ArrowLeftToLine,
  ArrowRightToLine,
} from "lucide-react";

function Rule({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex min-w-fit flex-row items-center space-x-4 rounded-lg border px-4 py-2">
      <div>{icon}</div>
      <div>
        <p className="text-base font-bold">{title}</p>
        <p className="text-sm text-zinc-600">{text}</p>
      </div>
    </div>
  );
}

export function PetsRule({ petsAllowed }: { petsAllowed: boolean }) {
  return (
    <Rule
      icon={
        <PawPrint className="size-8">
          {!petsAllowed && (
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="100%"
              stroke="currentColor"
              stroke-width="2"
            />
          )}
        </PawPrint>
      }
      title="Pets"
      text={petsAllowed ? "Pets allowed" : "No pets allowed"}
    />
  );
}

export function SmokingRule({ smokingAllowed }: { smokingAllowed: boolean }) {
  const Icon = smokingAllowed ? Cigarette : CigaretteOff;
  return (
    <Rule
      icon={<Icon className="size-8" />}
      title="Smoking"
      text={smokingAllowed ? "Smoking allowed" : "No smoking allowed"}
    />
  );
}

export function CheckInTimeRule({ checkInTime }: { checkInTime: string }) {
  return (
    <Rule
      icon={<ArrowLeftToLine className="size-8" />}
      title="Check-in time"
      text={`After ${formatTime(checkInTime)}`}
    />
  );
}

export function CheckOutTimeRule({ checkOutTime }: { checkOutTime: string }) {
  return (
    <Rule
      icon={<ArrowRightToLine className="size-8" />}
      title="Check-out time"
      text={`Before ${formatTime(checkOutTime)}`}
    />
  );
}
