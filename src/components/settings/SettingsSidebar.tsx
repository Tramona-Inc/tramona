import Link from "next/link";
import { settingsLinks } from "./settingsLinks";

export default function SettingsSidebar() {
  return (
    <div className="w-full space-y-4 border px-1 py-6 sm:w-56 lg:block lg:w-80 lg:p-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="grid w-full grid-cols-1 gap-2">
        {settingsLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-zinc-100"
          >
            <Icon />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
