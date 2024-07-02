import {
  PawPrint,
  CigaretteOff,
  ArrowLeftToLine,
  ArrowRightToLine,
} from "lucide-react";

export function HouseRules() {
  return (
    <div className="mt-8 w-full lg:w-[1312px]">
      <h2 className="mb-6 text-[24px] font-bold">House rules</h2>
      <div className="hidden mb-6 lg:flex flex-row space-x-32">
        <Rule
          icon={
            <PawPrint className="size-[32px]">
              <line
                x1="0"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="currentColor"
                stroke-width="2"
              />
            </PawPrint>
          }
          title="Pets"
          text="No pets allowed"
        />
        <Rule
          icon={<CigaretteOff className="size-[32px]" />}
          title="Smoking"
          text="No smoking allowed"
        />
        <Rule
          icon={<ArrowLeftToLine className="size-[32px]" />}
          title="Check-in time"
          text="After 3:00 PM"
        />
        <Rule
          icon={<ArrowRightToLine className="size-[32px]" />}
          title="Check-out time"
          text="Before 11:00 AM"
        />
      </div>

      <div className="mt-10 space-y-8">
        <div>
          <h3 className="mb-1 text-[16px] font-bold">Additional rules</h3>
          <p className="text-[14px]">
            Let's keep the noise down between 10:00 PM and 8:00 AM to be
            considerate of our neighbors, and feel free to enjoy yourselves
            responsibly during the rest of the day. While we're all for having a
            good time, please avoid hosting large parties without giving us a
            heads up first. Please be mindful of our space, report any
            accidental breakages, and let us know if you need anything
            rearranged. Keep the doors locked when you're out and conserve
            energy when you can. Most importantly, relax and make yourselves at
            home!
          </p>
        </div>

        <div>
          <h3 className="mb-1 text-[16px] font-bold">Cancellation Policy</h3>
          <p className="text-[14px]">
            Let's keep the noise down between 10:00 PM and 8:00 AM to be
            considerate of our neighbors, and feel free to enjoy yourselves
            responsibly during the rest of the day. While we're all for having a
            good time, please avoid hosting large parties without giving us a
            heads up first. Please be mindful of our space, report any
            accidental breakages, and let us know if you need anything
            rearranged. Keep the doors locked when you're out and conserve
            energy when you can. Most importantly, relax and make yourselves at
            home!
          </p>
        </div>
      </div>
    </div>
  );
}

function Rule({ icon, title, text }) {
  return (
    <div className="flex flex-row items-center space-x-4">
      <div>{icon}</div>
      <div className="flex-col">
        <p className="text-[16px] font-bold">{title}</p>
        <p className="text-[14px] text-gray-600">{text}</p>
      </div>
    </div>
  );
}
