import Head from "next/head";

import AccountSidebar from "@/components/account/AccountSidebar";
import CashbackAccount from "@/components/account/CashbackAccount";
import ReferFolks from "@/components/account/ReferFolks";
import { useSession } from "next-auth/react";

export default function MyAccount() {
  useSession({ required: true });

  return (
    <>
      <Head>
        <title>My Account | Tramona</title>
      </Head>
      <div className="min-h-[calc(100vh-5rem)] gap-10 space-y-5 bg-zinc-100 px-5 pt-5 lg:flex lg:space-y-0">
        <AccountSidebar />
        <div className="w-full space-y-5">
          <CashbackAccount />
          <ReferFolks />
        </div>
      </div>
    </>
  );
}
