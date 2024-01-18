import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-5">
      <div className="space-y-3 divide-y-2 divide-zinc-100 rounded-xl bg-white shadow-md">
        <div className="w-full space-y-3 px-14 py-6 text-center">
          <p className="text-muted-foreground">Welcome,</p>
          <p className="text-3xl font-bold">Kierra</p>
          <p className="text-muted-foreground">Member since 2/5/23</p>
        </div>

        <div className="space-y-4 px-14 py-6 text-center">
          <p>Lifetime Cash Back</p>
          <p className="font-bold">$327.9</p>

          <Link
            href={"/refer"}
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
