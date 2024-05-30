import { CreditCard, User } from "lucide-react";
import Link from "next/link";

export default function SettingsSidebar() {
  return (
    <div className="hidden w-80 space-y-4 border p-6 lg:block">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="grid grid-cols-1 gap-2">
        <Link
          href="/settings/personal-information"
          className="rounded-lg hover:bg-zinc-100"
        >
          <div className="flex items-center gap-2 p-2">
            <User />
            Personal information
          </div>
        </Link>
        <Link
          href="/settings/payment-information"
          className="rounded-lg hover:bg-zinc-100"
        >
          <div className="flex items-center gap-2 p-2">
            <CreditCard />
            Payment information
          </div>
        </Link>
        <Link
          href="/settings/notifications"
          className="rounded-lg hover:bg-zinc-100"
        >
          <div className="flex items-center gap-2 p-2">
            <Bell />
            Notifications
          </div>
        </Link>
      </div>
    </div>
  );
}
