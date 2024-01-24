import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const errorMsg = searchParams.get("error");

  return (
    <>
      <Head>
        <title>Tramona</title>
      </Head>
      <p className="px-8 pt-32 text-center">
        {errorMsg}
        <br />
        <br />
        Please{" "}
        <Link href="/support" className="underline underline-offset-2">
          contact support
        </Link>{" "}
        if the issue persists
      </p>
    </>
  );
}
