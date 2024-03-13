import MainLayout from "@/components/_common/Layout/MainLayout";
import Head from "next/head";
import Link from "next/link";

export default function Page() {
  return (
    <MainLayout>
      <Head>
        <title>Tramona</title>
      </Head>
      <p className="px-8 pt-32 text-center">
        Something went wrong on our end
        <br />
        <br />
        Please{" "}
        <Link href="/support" className="underline underline-offset-2">
          contact support
        </Link>{" "}
        if the issue persists
      </p>
    </MainLayout>
  );
}
