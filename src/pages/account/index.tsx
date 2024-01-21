import Head from "next/head";

import AccountSidebar from "@/components/account/AccountSidebar";
import CashbackAccount from "@/components/account/CashbackAccount";
import ReferFolks from "@/components/account/ReferFolks";
import { useSession } from "next-auth/react";

export default function MyAccount() {
  useSession({ required: true });

  return (
    <>
      <Head>My Account | Tramona</Head>
      <div className="flex min-h-[calc(100vh-5.25rem)] gap-10 bg-zinc-100 px-5 pt-5">
        <AccountSidebar />
        <div className="w-full space-y-5">
          <CashbackAccount />
          <ReferFolks />
        </div>
      </div>
    </>
  );
}
