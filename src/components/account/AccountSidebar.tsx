import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import Spinner from "../_common/Spinner";
import { useRouter } from "next/router";

export default function AccountSidebar() {
  const { pathname } = useRouter();
  const { data: session, status } = useSession({ required: true });
  const { data, isLoading } = api.users.myReferralCode.useQuery();

  // if (status === "loading") {
  //   return <Spinner />;
  // }

  return (
    <div className="space-y-5">
      <div className="flex divide-x-2 divide-zinc-100 rounded-xl bg-white shadow-md lg:w-[300px] lg:flex-col lg:space-y-3 lg:divide-x-0 lg:divide-y-2">
        {status === "loading" ? (
          <Spinner />
        ) : (
          <div className="w-1/2 space-y-3 px-14 py-6 text-center sm:w-full">
            <p className="text-muted-foreground">Welcome,</p>
            <p className="text-3xl font-bold">{session.user.name}</p>
            <p className="text-muted-foreground">
              Member since{" "}
              {new Date(session.user.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="space-y-4 px-14 py-6 text-center">
          <p>Lifetime Cash Back</p>
          <p className="font-bold">
            {isLoading ? (
              <Spinner />
            ) : (
              formatCurrency(data?.totalBookingVolume ?? 0)
            )}
          </p>

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
          {/* <Link
            href={"/account/wallet"}
            className={`${
              pathname === "/account/wallet"
                ? "font-bold text-primary"
                : "px-10"
            } py-4`}
          >
            My Wallet
          </Link> */}
        </div>
      </div>
    </div>
  );
}
