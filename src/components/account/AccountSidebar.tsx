import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { useSession } from "next-auth/react";

export default function AccountSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex divide-x-2 divide-zinc-100 rounded-xl bg-white shadow-md lg:w-[300px] lg:flex-col lg:space-y-3 lg:divide-x-0 lg:divide-y-2">
        <div className="w-1/2 space-y-3 px-14 py-6 text-center sm:w-full">
          <p className="text-muted-foreground">Welcome,</p>
          <p className="text-3xl font-bold">{session.user.name}</p>
          <p className="text-muted-foreground">Member since 2/5/23</p>
        </div>

        <div className="space-y-4 px-14 py-6 text-center">
          <p>Lifetime Cash Back</p>
          <p className="font-bold">$327.9</p>

          <Link
            href={"/profile"}
            className={buttonVariants({ variant: "outline" })}
          >
            Refer a Friend
          </Link>
        </div>
      </div>

      <div className="space-y-5 rounded-xl bg-white shadow-md">
        <div className="flex flex-col divide-y-2 divide-zinc-100">
          <Link
            href={"/account"}
            className={`${
              pathname === "/account" ? "px-5 font-bold text-primary" : "px-10"
            } py-4`}
          >
            My Account
          </Link>
          <Link
            href={"/account/balance"}
            className={`${
              pathname === "/account/balance"
                ? "px-5 font-bold text-primary"
                : "px-10"
            } py-4`}
          >
            Cash Back Balance
          </Link>
          <Link
            href={"/account/wallet"}
            className={`${
              pathname === "/account/wallet"
                ? "font-bold text-primary"
                : "px-10"
            } py-4`}
          >
            My Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}
