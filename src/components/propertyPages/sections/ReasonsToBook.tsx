import {
  HeadsetIcon,
  ListChecksIcon,
  LockKeyholeIcon,
  type LucideIcon,
} from "lucide-react";

export default function ReasonsToBook() {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="subheading">Reasons to book</h1>
      <Reason Icon={LockKeyholeIcon} title="Safe booking">
        Safe and encrypted transfer of your payment data
      </Reason>
      <Reason Icon={ListChecksIcon} title="One of a kind place">
        Wifi, Kitchen, Air conditioning, and more
      </Reason>
      <Reason Icon={HeadsetIcon} title="Top notch Customer service">
        Highly-rated 24/7 Customer support you can rely on
      </Reason>
    </div>
  );
}

function Reason({
  Icon,
  title,
  children,
}: {
  Icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-center gap-x-3 text-primaryGreen">
      <Icon />
      <div className="flex flex-col">
        <h1 className="text-base font-semibold">{title}</h1>
        <div className="text-sm tracking-tight text-black">{children}</div>
      </div>
    </div>
  );
}
